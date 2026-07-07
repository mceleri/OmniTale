import { Message } from '../types/story';

export const fetchNarrative = async (
  url: string,
  key: string,
  modelName: string,
  systemPrompt: string,
  last10Messages: Message[]
): Promise<string> => {
  if (!key) {
    throw new Error('API Key is missing. Please click the Settings gear icon in the top-right of the Home screen to configure your LLM API Key.');
  }

  const endpoint = url || 'https://openrouter.ai/api/v1/chat/completions';
  
  const mappedMessages = last10Messages.map((msg) => ({
    role: msg.role === 'player' ? 'user' : (msg.role === 'master' ? 'assistant' : 'system'),
    content: msg.content,
  }));

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        ...mappedMessages,
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM API returned status ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  const content = choice?.message?.content || choice?.text || '';
  return content.trim();
};
