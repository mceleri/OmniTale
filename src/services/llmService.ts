import { Message, LLMProvider } from '../types/story';

export interface LLMProviderPlugin {
  id: LLMProvider;
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
    stream?: boolean;
  }): {
    url: string;
    headers: Record<string, string>;
    body: string;
  };
  parseResponse(data: any): string;
  parseUsage?(data: any): { prompt_tokens: number; completion_tokens: number; total_tokens: number } | null;
}

const LocalPlugin: LLMProviderPlugin = {
  id: 'local',
  name: 'Local (Ollama / vLLM / llama.cpp / LM Studio)',
  defaultUrl: 'http://localhost:11434/v1/chat/completions',
  defaultModel: 'llama3.1:8b',
  isUrlEditable: true,
  prepareRequest({ url, key, modelName, systemPrompt, messages, stream }) {
    const rawUrl = url || 'http://localhost:11434/v1';
    let targetUrl = rawUrl.trim();
    if (targetUrl.endsWith('/')) {
      targetUrl = targetUrl.slice(0, -1);
    }
    if (!targetUrl.endsWith('/chat/completions')) {
      if (targetUrl.endsWith('/v1')) {
        targetUrl = `${targetUrl}/chat/completions`;
      } else {
        targetUrl = `${targetUrl}/v1/chat/completions`;
      }
    }

    const mappedMessages = messages
      .filter((msg) => msg.role === 'player' || msg.role === 'master')
      .map((msg) => ({
        role: msg.role === 'player' ? 'user' : 'assistant',
        content: msg.content,
      }));

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (key && key.trim()) {
      headers['Authorization'] = `Bearer ${key.trim()}`;
    }

    const bodyPayload: any = {
      model: modelName || 'llama3.1:8b',
      messages: [
        { role: 'system', content: systemPrompt },
        ...mappedMessages,
      ],
      stream: Boolean(stream),
    };

    if (stream) {
      bodyPayload.stream_options = { include_usage: true };
    }

    return {
      url: targetUrl,
      headers,
      body: JSON.stringify(bodyPayload),
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

const OpenRouterPlugin: LLMProviderPlugin = {
  id: 'openrouter',
  name: 'OpenRouter',
  defaultUrl: 'https://openrouter.ai/api/v1/chat/completions',
  defaultModel: 'google/gemma-2-9b-it:free',
  isUrlEditable: false,
  prepareRequest({ url, key, modelName, systemPrompt, messages, stream }) {
    const baseUrl = url || 'https://openrouter.ai/api/v1/chat/completions';
    const targetUrl = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/chat/completions`;

    const mappedMessages = messages
      .filter((msg) => msg.role === 'player' || msg.role === 'master')
      .map((msg) => ({
        role: msg.role === 'player' ? 'user' : 'assistant',
        content: msg.content,
      }));

    const bodyPayload: any = {
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        ...mappedMessages,
      ],
      stream: Boolean(stream),
    };

    if (stream) {
      bodyPayload.stream_options = { include_usage: true };
    }

    return {
      url: targetUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify(bodyPayload),
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
  defaultModel: 'gemini-flash-latest',
  isUrlEditable: false,
  prepareRequest({ url, key, modelName, systemPrompt, messages, stream }) {
    const baseUrl = url || 'https://generativelanguage.googleapis.com/v1beta';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    const cleanModelName = modelName.includes('/') ? modelName.split('/').pop() || modelName : modelName;
    const method = stream ? 'streamGenerateContent?alt=sse&' : 'generateContent?';
    const targetUrl = `${cleanBaseUrl}/models/${cleanModelName}:${method}key=${key}`;

    // Map messages to native Gemini API "contents" structure (player & master only)
    const initialContents = messages
      .filter((msg) => msg.role === 'player' || msg.role === 'master')
      .map((msg) => ({
        role: msg.role === 'master' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

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
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Gemini blocked prompt: ${data.promptFeedback.blockReason}`);
    }
    const candidate = data.candidates?.[0];
    if (candidate?.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Gemini generation stopped due to safety filters.');
      }
    }
    const parts = candidate?.content?.parts;
    if (Array.isArray(parts)) {
      const textParts = parts.map((p: any) => (typeof p?.text === 'string' ? p.text : '')).filter(Boolean);
      if (textParts.length > 0) {
        return textParts.join('').trim();
      }
    }
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

export const LLM_PLUGINS: Record<LLMProvider, LLMProviderPlugin> = {
  local: LocalPlugin,
  openrouter: OpenRouterPlugin,
  gemini: GeminiPlugin,
};

export type OnChunkCallback = (fullText: string, chunkText: string) => void;
export type OnUsageCallback = (usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number }) => void;

export const fetchNarrative = async (
  provider: LLMProvider,
  url: string,
  key: string,
  modelName: string,
  systemPrompt: string,
  last10Messages: Message[],
  onUsage?: OnUsageCallback,
  onChunk?: OnChunkCallback
): Promise<string> => {
  if (!key && provider !== 'local') {
    throw new Error('API Key is missing. Please click the Settings gear icon in the top-right of the Home screen to configure your LLM API Key.');
  }

  const plugin = LLM_PLUGINS[provider] || LLM_PLUGINS.openrouter;
  const targetBaseUrl = plugin.isUrlEditable ? (url || plugin.defaultUrl) : plugin.defaultUrl;
  const isStreaming = Boolean(onChunk);

  const { url: finalUrl, headers, body: requestBody } = plugin.prepareRequest({
    url: targetBaseUrl,
    key,
    modelName,
    systemPrompt,
    messages: last10Messages,
    stream: isStreaming,
  });

  console.log(`[LLM Plugin] Sending ${plugin.name} request (stream=${isStreaming}):`, {
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

  // Handle streaming SSE response
  if (isStreaming && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulatedText = '';

    const processLine = (line: string) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith(':')) return;

      let payload = trimmed;
      if (payload.startsWith('data:')) {
        payload = payload.slice(5).trim();
      }

      if (payload === '[DONE]') return;

      try {
        const json = JSON.parse(payload);

        // 1. Google Gemini Native format
        if (json.candidates?.[0]?.content?.parts) {
          for (const part of json.candidates[0].content.parts) {
            if (typeof part.text === 'string' && part.text) {
              accumulatedText += part.text;
              onChunk?.(accumulatedText, part.text);
            }
          }
          if (json.usageMetadata && onUsage) {
            onUsage({
              prompt_tokens: Number(json.usageMetadata.promptTokenCount) || 0,
              completion_tokens: Number(json.usageMetadata.candidatesTokenCount) || 0,
              total_tokens: Number(json.usageMetadata.totalTokenCount) || 0,
            });
          }
        }
        // 2. OpenAI / OpenRouter / Local (Ollama, LM Studio, vLLM, llama.cpp) format
        else if (json.choices?.[0]) {
          const choice = json.choices[0];
          const delta = choice.delta;
          const chunkText = delta?.content || delta?.text || choice.text || '';
          if (chunkText) {
            accumulatedText += chunkText;
            onChunk?.(accumulatedText, chunkText);
          }
          if (json.usage && onUsage) {
            onUsage({
              prompt_tokens: Number(json.usage.prompt_tokens) || 0,
              completion_tokens: Number(json.usage.completion_tokens) || 0,
              total_tokens: Number(json.usage.total_tokens) || 0,
            });
          }
        }
      } catch {
        // Line might be partial JSON, will be buffered or ignored if non-JSON
      }
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          processLine(line);
        }
      }

      if (buffer.trim()) {
        processLine(buffer);
      }
    } catch (streamErr) {
      console.warn('[fetchNarrative] Stream reading encountered an error, falling back to accumulated text:', streamErr);
    }

    if (accumulatedText) {
      return accumulatedText.trim();
    }
  }

  // Non-streaming fallback or standard JSON response
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
