export interface LoreBlock {
  id: string;
  title: string;
  content: string;
}

export const parseMarkdownToBlocks = (markdown: string): LoreBlock[] => {
  if (!markdown) {
    return [{ id: 'block_setting_' + Date.now(), title: 'Setting', content: '' }];
  }
  
  // Try to parse as JSON first (for backward compatibility with older stores)
  try {
    const parsed = JSON.parse(markdown);
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        id: item.id ? String(item.id) : `block_json_${Date.now()}_${index}`,
        title: item.title || 'Untitled Aspect',
        content: item.content || ''
      }));
    }
  } catch (e) {
    // If not JSON, parse as Markdown
  }

  // Splitting by '## '
  const parts = markdown.split(/(?=^##\s)/m);
  const parsedBlocks: LoreBlock[] = [];
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    
    if (part.startsWith('##')) {
      // Find the first newline or end of line for title
      const lines = part.split('\n');
      const titleLine = lines[0];
      const title = titleLine.replace(/^##\s*/, '').trim();
      const content = lines.slice(1).join('\n').trim();
      parsedBlocks.push({
        id: `block_${Date.now()}_${i}`,
        title: title || 'Untitled Aspect',
        content: content
      });
    } else {
      // No '##' prefix, maybe it's just raw content without title
      parsedBlocks.push({
        id: `block_${Date.now()}_${i}`,
        title: i === 0 ? 'Setting' : 'Untitled Aspect',
        content: part
      });
    }
  }
  
  if (parsedBlocks.length === 0) {
    return [{ id: 'block_setting_' + Date.now(), title: 'Setting', content: markdown }];
  }
  
  return parsedBlocks;
};

export const compileBlocksToMarkdown = (blocks: LoreBlock[]): string => {
  return blocks
    .map(b => `## ${b.title || 'Untitled Aspect'}\n\n${b.content || ''}`)
    .join('\n\n');
};
