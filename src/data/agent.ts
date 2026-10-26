import { AgentStep, ChatMessage, ProviderConfig, MemoryEntry } from './types';

export const allTools = [
  {
    id: 'calculator',
    name: 'Калькулятор',
    description: 'Математические вычисления',
    icon: '🧮',
    execute: async (input: string) => {
      try {
        const result = eval(input);
        return `Результат: ${result}`;
      } catch (error) {
        return `Ошибка: ${error}`;
      }
    }
  },
  {
    id: 'datetime',
    name: 'Дата и время',
    description: 'Текущая дата и время',
    icon: '🕐',
    execute: async () => {
      return `Сейчас: ${new Date().toLocaleString('ru-RU')}`;
    }
  },
  {
    id: 'uuid',
    name: 'Генератор UUID',
    description: 'Уникальные идентификаторы',
    icon: '🔑',
    execute: async (input: string) => {
      const count = parseInt(input) || 1;
      const uuids = [];
      for (let i = 0; i < Math.min(count, 10); i++) {
        uuids.push(crypto.randomUUID());
      }
      return `Сгенерированные UUID:\n${uuids.join('\n')}`;
    }
  },
  {
    id: 'hash',
    name: 'Хеш-функция',
    description: 'SHA-256 хеш',
    icon: '#️⃣',
    execute: async (input: string) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `SHA-256:\n${hashHex}`;
    }
  },
  {
    id: 'base64',
    name: 'Base64',
    description: 'Кодирование/декодирование',
    icon: '🔄',
    execute: async (input: string) => {
      try {
        const encoded = btoa(input);
        return `Base64: ${encoded}`;
      } catch (error) {
        return `Ошибка: ${error}`;
      }
    }
  },
  {
    id: 'json',
    name: 'JSON форматтер',
    description: 'Форматирование JSON',
    icon: '📋',
    execute: async (input: string) => {
      try {
        const parsed = JSON.parse(input);
        return JSON.stringify(parsed, null, 2);
      } catch (error) {
        return `Ошибка JSON: ${error}`;
      }
    }
  },
  {
    id: 'text_analysis',
    name: 'Анализ текста',
    description: 'Статистика текста',
    icon: '📝',
    execute: async (input: string) => {
      const words = input.trim().split(/\s+/).length;
      const chars = input.length;
      const sentences = input.split(/[.!?]+/).filter(s => s.trim()).length;
      return `Статистика:\nСлов: ${words}\nСимволов: ${chars}\nПредложений: ${sentences}`;
    }
  },
  {
    id: 'code_helper',
    name: 'Помощник кода',
    description: 'Шаблоны кода',
    icon: '💻',
    execute: async (input: string) => {
      return `Шаблон для: ${input}\n\n// Ваш код здесь`;
    }
  }
];

function detectToolUse(message: string): { tool: any; input: string } | null {
  const lower = message.toLowerCase();
  
  if (lower.includes('посчитай') || lower.includes('вычисли') || /\d+\s*[\+\-\*\/]\s*\d+/.test(message)) {
    const match = message.match(/[\d\+\-\*\/\(\)\s\.]+/);
    return { tool: allTools[0], input: match ? match[0].trim() : '0' };
  }
  
  if (lower.includes('время') || lower.includes('дата') || lower.includes('час')) {
    return { tool: allTools[1], input: '' };
  }
  
  if (lower.includes('uuid') || lower.includes('уникальный')) {
    const match = message.match(/\d+/);
    return { tool: allTools[2], input: match ? match[0] : '1' };
  }
  
  if (lower.includes('хеш') || lower.includes('sha')) {
    return { tool: allTools[3], input: message.replace(/.*хеш|sha.*:?/i, '').trim() };
  }
  
  if (lower.includes('base64') || lower.includes('закодируй')) {
    return { tool: allTools[4], input: message.replace(/.*base64|закодируй.*:?/i, '').trim() };
  }
  
  if (lower.includes('json') || lower.includes('формат')) {
    return { tool: allTools[5], input: message.replace(/.*json|формат.*:?/i, '').trim() };
  }
  
  if (lower.includes('анализ') || lower.includes('текст')) {
    return { tool: allTools[6], input: message.replace(/.*анализ|текст.*:?/i, '').trim() };
  }
  
  if (lower.includes('код') || lower.includes('шаблон')) {
    return { tool: allTools[7], input: message.replace(/.*код|шаблон.*:?/i, '').trim() };
  }
  
  return null;
}

import { agentMemory } from './memory';

export async function processAgentMessage(
  userMessage: string,
  history: ChatMessage[],
  config: ProviderConfig,
  onStep: (step: AgentStep) => void,
  onToken: (token: string) => void,
  settings: { temperature: number; maxTokens: number; reasoning?: boolean }
): Promise<string> {
  const steps: AgentStep[] = [];

  const toolUse = detectToolUse(userMessage);
  if (toolUse) {
    const toolStep: AgentStep = { id: crypto.randomUUID(), type: 'tool_call', content: `🔧 ${toolUse.tool.name}`, toolName: toolUse.tool.name, timestamp: new Date() };
    steps.push(toolStep);
    onStep(toolStep);

    try {
      const result = await toolUse.tool.execute(toolUse.input);
      const resultStep: AgentStep = { id: crypto.randomUUID(), type: 'tool_result', content: result, toolName: toolUse.tool.name, timestamp: new Date() };
      steps.push(resultStep);
      onStep(resultStep);
    } catch (error: any) {
      const errorStep: AgentStep = { id: crypto.randomUUID(), type: 'tool_result', content: `Ошибка: ${error.message}`, toolName: toolUse.tool.name, timestamp: new Date() };
      steps.push(errorStep);
      onStep(errorStep);
    }
  }

  const facts = agentMemory.extractFacts(userMessage);
  for (const fact of facts) {
    agentMemory.add(fact.key, fact.value);
    const memoryStep: AgentStep = { id: crypto.randomUUID(), type: 'memory', content: `💾 ${fact.key} = ${fact.value}`, timestamp: new Date() };
    steps.push(memoryStep);
    onStep(memoryStep);
  }

  const memoryContext = agentMemory.getAll().map((m: MemoryEntry) => `${m.key}: ${m.value}`).join('\n');
  const systemPrompt = `Ты полезный AI-ассистент. Отвечай на том же языке, что и пользователь.

ВАЖНО: Ты видишь ВСЮ историю чата выше. Учитывай контекст предыдущих сообщений, помни о чём шла речь, и продолжай разговор логично. Не повторяйся и ссылайся на предыдущие сообщения когда это уместно.

${memoryContext ? `Информация о пользователе из памяти:\n${memoryContext}` : ''}`;
  
  const apiMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map((m: ChatMessage) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
  ];

  const thinkingStep: AgentStep = { id: crypto.randomUUID(), type: 'thinking', content: '🤔 Анализирую...', timestamp: new Date() };
  steps.push(thinkingStep);
  onStep(thinkingStep);

  try {
    let fullContent = '';

    if (config.type === 'ollama') {
      let response: Response;
      try {
        response = await fetch(`${config.baseUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: config.model, messages: apiMessages, stream: true, options: { temperature: settings.temperature, num_predict: settings.maxTokens } }),
        });
      } catch (fetchError: any) {
        throw new Error(`Не удалось подключиться к Ollama.\n\n1. Запустите: OLLAMA_ORIGINS=* ollama serve\n2. Проверьте модель: ollama list\n\nОшибка: ${fetchError.message}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama ошибка ${response.status}: ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        let lineCount = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim()) {
              lineCount++;
              try {
                const json = JSON.parse(line);
                if (json.error) throw new Error(`Ollama: ${json.error}`);
                const content = json.message?.content || '';
                if (content) { fullContent += content; onToken(content); }
                if (json.done) break;
              } catch (parseError: any) {
                if (parseError.message.includes('Ollama:')) throw parseError;
              }
            }
          }
        }
        
        if (lineCount === 0) throw new Error('Ollama не вернула данных. Проверьте: ollama list');
      }

      if (!fullContent) throw new Error('Ollama вернула пустой ответ.');
    } else if (config.type === 'zai') {
      const response = await fetch(config.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.apiKey}` },
        body: JSON.stringify({ model: config.model, messages: apiMessages, temperature: settings.temperature, max_tokens: settings.maxTokens, stream: false }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `Z.ai ошибка ${response.status}`);
      }

      const data = await response.json();
      fullContent = data.choices?.[0]?.message?.content || '';
      if (!fullContent) throw new Error('Z.ai не вернул ответ.');
      onToken(fullContent);
    } else {
      const requestBody: any = { model: config.model, messages: apiMessages, temperature: settings.temperature, max_tokens: settings.maxTokens, stream: true };

      if (settings.reasoning) {
        requestBody.reasoning = { enabled: true };
        const reasoningStep: AgentStep = { id: crypto.randomUUID(), type: 'thinking', content: '🧠 Режим рассуждений...', timestamp: new Date() };
        steps.push(reasoningStep);
        onStep(reasoningStep);
      }

      let response: Response;
      try {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${config.apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Agent'
          },
          body: JSON.stringify(requestBody),
        });
      } catch (fetchError: any) {
        throw new Error(`Не удалось подключиться к OpenRouter.\n\nВозможные причины:\n1. Нет интернета\n2. API ключ недействителен\n3. CORS блокировка\n\nОшибка: ${fetchError.message}`);
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const errorMessage = err.error?.message || `HTTP ${response.status}`;
        
        if (response.status === 401) throw new Error('❌ Неверный API ключ OpenRouter. Проверьте настройки.');
        if (response.status === 429) throw new Error('⏱️ Превышен лимит запросов. Подождите минуту.');
        if (response.status === 402) throw new Error('💰 Закончились кредиты. Пополните баланс на openrouter.ai/credits');
        if (response.status === 404) throw new Error(`❌ Модель ${config.model} не найдена. Выберите другую.`);
        
        throw new Error(`OpenRouter: ${errorMessage}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        let lineCount = 0;
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() && line.startsWith('data: ')) {
              lineCount++;
              const data = line.slice(6).trim();
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) { 
                  fullContent += content; 
                  onToken(content); 
                }
              } catch (e) {
                console.warn('Ошибка парсинга:', line);
              }
            }
          }
        }
        
        if (lineCount === 0) {
          throw new Error('OpenRouter не вернул данных. Модель может быть недоступна.');
        }
      }

      if (!fullContent) {
        throw new Error(`OpenRouter не вернул ответ.\n\nПопробуйте:\n1. Другую модель из списка\n2. Проверьте API ключ\n3. Используйте Ollama (локально)`);
      }
    }

    const responseStep: AgentStep = { id: crypto.randomUUID(), type: 'response', content: '✅ Ответ получен', timestamp: new Date() };
    steps.push(responseStep);
    onStep(responseStep);

    return fullContent || 'Нет ответа';
  } catch (error: any) {
    throw error;
  }
}
