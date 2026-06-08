import React from 'react';

interface MarkdownProps {
  text: string;
}

export const MarkdownText: React.FC<MarkdownProps> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  
  const flushList = (key: string | number) => {
    if (!currentList) return null;
    const list = currentList;
    currentList = null;
    
    if (list.type === 'ul') {
      return (
        <ul key={key} className="list-disc list-inside pl-4 my-2 space-y-1">
          {list.items.map((item, idx) => (
            <li key={idx} className="text-zinc-300">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <ol key={key} className="list-decimal list-inside pl-4 my-2 space-y-1">
          {list.items.map((item, idx) => (
            <li key={idx} className="text-zinc-300">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    }
  };

  const renderInline = (inlineText: string) => {
    // Basic regex for bold (**bold**) and italic (*italic*)
    const boldParts = inlineText.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const cleanBold = part.slice(2, -2);
        return <strong key={idx} className="font-bold text-zinc-100">{renderItalic(cleanBold)}</strong>;
      }
      return <React.Fragment key={idx}>{renderItalic(part)}</React.Fragment>;
    });
  };

  const renderItalic = (italicText: string) => {
    const italicParts = italicText.split(/(\*.*?\*)/g);
    return italicParts.map((part, idx) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const cleanItalic = part.slice(1, -1);
        return <em key={idx} className="italic">{cleanItalic}</em>;
      }
      return part;
    });
  };

  let elementKey = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if empty line
    if (trimmed === '') {
      if (currentList) {
        elements.push(flushList(`list-${elementKey++}`));
      }
      continue;
    }
    
    // Check for headers (e.g. ### Header)
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      if (currentList) {
        elements.push(flushList(`list-${elementKey++}`));
      }
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const Tag = `h${level}` as any;
      const headerClasses = [
        "text-xl font-bold text-zinc-100 mt-4 mb-2",
        "text-lg font-bold text-zinc-100 mt-3 mb-2",
        "text-base font-bold text-zinc-100 mt-2 mb-1",
        "text-sm font-bold text-zinc-100 mt-2 mb-1",
        "text-xs font-bold text-zinc-100 mt-1 mb-1",
        "text-xs font-bold text-zinc-100 mt-1 mb-1"
      ];
      elements.push(
        <Tag key={`h-${elementKey++}`} className={headerClasses[level - 1]}>
          {renderInline(content)}
        </Tag>
      );
      continue;
    }
    
    // Check for blockquote (e.g. > text)
    if (trimmed.startsWith('>')) {
      if (currentList) {
        elements.push(flushList(`list-${elementKey++}`));
      }
      const content = trimmed.slice(1).trim();
      elements.push(
        <blockquote key={`bq-${elementKey++}`} className="border-l-2 border-zinc-700 pl-3 italic text-zinc-400 my-2">
          {renderInline(content)}
        </blockquote>
      );
      continue;
    }
    
    // Check for unordered list item
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (ulMatch) {
      const content = ulMatch[2];
      if (currentList && currentList.type !== 'ul') {
        elements.push(flushList(`list-${elementKey++}`));
      }
      if (!currentList) {
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(content);
      continue;
    }
    
    // Check for ordered list item
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      const content = olMatch[2];
      if (currentList && currentList.type !== 'ol') {
        elements.push(flushList(`list-${elementKey++}`));
      }
      if (!currentList) {
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(content);
      continue;
    }
    
    // Regular paragraph text
    if (currentList) {
      elements.push(flushList(`list-${elementKey++}`));
    }
    
    let pContent = [trimmed];
    while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !lines[i + 1].trim().match(/^(#{1,6})\s+/) && !lines[i + 1].trim().startsWith('>') && !lines[i + 1].match(/^(\s*)[-*+]\s+/) && !lines[i + 1].match(/^(\s*)\d+\.\s+/)) {
      i++;
      pContent.push(lines[i].trim());
    }
    
    elements.push(
      <p key={`p-${elementKey++}`} className="text-zinc-300 leading-relaxed mb-3 last:mb-0">
        {pContent.map((textLine, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {renderInline(textLine)}
          </React.Fragment>
        ))}
      </p>
    );
  }
  
  if (currentList) {
    elements.push(flushList(`list-${elementKey++}`));
  }
  
  return <div className="space-y-1">{elements}</div>;
};
