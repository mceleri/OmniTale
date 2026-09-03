import { Message } from '../types/story';

export interface LLMProviderPlugin {
  id: 'openrouter' | 'gemini' | 'openai';
  name: string;
  defaultUrl: string;
  defaultModel: string;
  isUrlEditable: boolean;
  prepareRequest(config: {
    url: string;
    key: string;
    modelName: string;
    systemPrompt: string;
    messages: Message[];
  }): {
    url: string;
    headers: Record<string, string>;
    body: string;
  };
  parseResponse(data: any): string;
  parseUsage?(data: any): { prompt_tokens: number; completion_tokens: number; total_tokens: number } | null;
}

const OpenRouterPlugin: LLMProviderPlugin = {
  id: 'openrouter',
  name: 'OpenRouter',
  defaultUrl: 'https://openrouter.ai/api/v1/chat/completions',
  defaultModel: 'google/gemma-2-9b-it:free',
  isUrlEditable: false,
  prepareRequest({ url, key, modelName, systemPrompt, messages }) {
    const baseUrl = url || 'https://openrouter.ai/api/v1/chat/completions';
    const targetUrl = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/chat/completions`;

    const mappedMessages = messages.map((msg) => ({
      role: msg.role === 'player' ? 'user' : (msg.role === 'master' ? 'assistant' : 'system'),
      content: msg.content,
    }));

    return {
      url: targetUrl,
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
    };
  },
  parseResponse(data) {
    const choice = data.choices?.[0];
    return (choice?.message?.content || choice?.text || '').trim();
  },
  parseUsage(data) {
    if (data.usage) {
      return {
        prompt_tokens: Number(data.usage.prompt_tokens) || 0,
        completion_tokens: Number(data.usage.completion_tokens) || 0,
        total_tokens: Number(data.usage.total_tokens) || 0,
      };
    }
    return null;
  },
};

const GeminiPlugin: LLMProviderPlugin = {
  id: 'gemini',
  name: 'Google Gemini (Native)',
  defaultUrl: 'https://generativelanguage.googleapis.com/v1beta',
  defaultModel: 'gemini-flash-lite-latest',
  isUrlEditable: false,
  prepareRequest({ url, key, modelName, systemPrompt, messages }) {
    const baseUrl = url || 'https://generativelanguage.googleapis.com/v1beta';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    const cleanModelName = modelName.includes('/') ? modelName.split('/').pop() || modelName : modelName;
    const targetUrl = `${cleanBaseUrl}/models/${cleanModelName}:generateContent?key=${key}`;

    // Map messages to native Gemini API "contents" structure
    const initialContents = messages.map((msg) => {
      let role = 'user';
      let text = msg.content;
      if (msg.role === 'master') {
        role = 'model';
      } else if (msg.role === 'system') {
        role = 'user';
        text = `[System Message]: ${msg.content}`;
      }
      return {
        role,
        parts: [{ text }]
      };
    });

    // Alternate roles: Gemini requires alternating roles starting with 'user'
    const cleanContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    
    initialContents.forEach((item) => {
      if (cleanContents.length === 0) {
        if (item.role === 'user') {
          cleanContents.push(item);
        } else {
          // If first item is a model message, we insert a placeholder user message first
          cleanContents.push({
            role: 'user',
            parts: [{ text: 'Continue the narrative.' }]
          });
          cleanContents.push(item);
        }
      } else {
        const lastItem = cleanContents[cleanContents.length - 1];
        if (lastItem.role === item.role) {
          // Merge consecutive same-role messages
          lastItem.parts[0].text += '\n\n' + item.parts[0].text;
        } else {
          cleanContents.push(item);
        }
      }
    });

    let finalContents = cleanContents;
    if (finalContents.length === 0) {
      finalContents = [
        {
          role: 'user',
          parts: [{ text: 'Please begin the narrative and set the scene based on your instructions.' }]
        }
      ];
    }

    const sanitizedContents = finalContents.map((item) => ({
      role: item.role,
      parts: item.parts.map((p) => {
        const txt = p.text ? p.text.trim() : '';
        return { text: txt !== '' ? txt : ' ' };
      })
    }));

    const requestBody: any = {
      contents: sanitizedContents,
    };

    if (systemPrompt && systemPrompt.trim()) {
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt.trim() }]
      };
    }

    return {
      url: targetUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };
  },
  parseResponse(data) {
    const candidate = data.candidates?.[0];
    return (candidate?.content?.parts?.[0]?.text || '').trim();
  },
  parseUsage(data) {
    if (data.usageMetadata) {
      return {
        prompt_tokens: Number(data.usageMetadata.promptTokenCount) || 0,
        completion_tokens: Number(data.usageMetadata.candidatesTokenCount) || 0,
        total_tokens: Number(data.usageMetadata.totalTokenCount) || 0,
      };
    }
    return null;
  },
};

const OpenAIPlugin: LLMProviderPlugin = {
  id: 'openai',
  name: 'OpenAI / Custom',
  defaultUrl: 'https://api.openai.com/v1',
  defaultModel: 'gpt-4o-mini',
  isUrlEditable: true,
  prepareRequest({ url, key, modelName, systemPrompt, messages }) {
    const baseUrl = url || 'https://api.openai.com/v1';
    const targetUrl = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/chat/completions`;

    const mappedMessages = messages.map((msg) => ({
      role: msg.role === 'player' ? 'user' : (msg.role === 'master' ? 'assistant' : 'system'),
      content: msg.content,
    }));

    return {
      url: targetUrl,
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
    };
  },
  parseResponse(data) {
    const choice = data.choices?.[0];
    return (choice?.message?.content || choice?.text || '').trim();
  },
  parseUsage(data) {
    if (data.usage) {
      return {
        prompt_tokens: Number(data.usage.prompt_tokens) || 0,
        completion_tokens: Number(data.usage.completion_tokens) || 0,
        total_tokens: Number(data.usage.total_tokens) || 0,
      };
    }
    return null;
  },
};

export const LLM_PLUGINS: Record<'openrouter' | 'gemini' | 'openai', LLMProviderPlugin> = {
  openrouter: OpenRouterPlugin,
  gemini: GeminiPlugin,
  openai: OpenAIPlugin,
};

export const fetchNarrative = async (
  provider: 'openrouter' | 'gemini' | 'openai',
  url: string,
  key: string,
  modelName: string,
  systemPrompt: string,
  last10Messages: Message[],
  onUsage?: (usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }) => void
): Promise<string> => {
  if (!key) {
    throw new Error('API Key is missing. Please click the Settings gear icon in the top-right of the Home screen to configure your LLM API Key.');
  }

  const plugin = LLM_PLUGINS[provider];
  if (!plugin) {
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  // CRITICAL: Only use custom url if provider is 'openai' (which is editable).
  // Otherwise, use the plugin's defaultUrl to ensure maximum correctness and avoid legacy stored URL contamination.
  const targetBaseUrl = provider === 'openai' ? (url || plugin.defaultUrl) : plugin.defaultUrl;

  const { url: finalUrl, headers, body: requestBody } = plugin.prepareRequest({
    url: targetBaseUrl,
    key,
    modelName,
    systemPrompt,
    messages: last10Messages,
  });

  console.log(`[LLM Plugin] Sending ${plugin.name} request:`, {
    url: finalUrl.replace(/key=[^&]+/, 'key=***'),
    headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined }
  });

  const response = await fetch(finalUrl, {
    method: 'POST',
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `LLM API returned status ${response.status}: ${errText}\n\n` +
      `[Debug Diagnostic Info]\n` +
      `- Provider: ${plugin.name}\n` +
      `- URL: ${finalUrl.replace(/key=[^&]+/, 'key=***')}\n` +
      `- Model: ${modelName}\n` +
      `- Body Snippet: ${requestBody.substring(0, 400)}${requestBody.length > 400 ? '...' : ''}`
    );
  }

  const data = await response.json();
  
  if (onUsage && plugin.parseUsage) {
    const usage = plugin.parseUsage(data);
    if (usage) {
      onUsage(usage);
    }
  }

  return plugin.parseResponse(data);
};

export function cleanAndParseJson<T = any>(rawText: string): T | null {
  if (!rawText || typeof rawText !== 'string') return null;

  let cleaned = rawText.trim();

  // Strip markdown code fences like ```json ... ``` or ``` ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }

  // Attempt direct parse first
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // If direct parse fails, try extracting the outermost JSON object { ... }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(extracted) as T;
      } catch (innerErr) {
        console.warn('[cleanAndParseJson] Failed to parse extracted JSON block:', innerErr);
      }
    }
  }

  return null;
}

