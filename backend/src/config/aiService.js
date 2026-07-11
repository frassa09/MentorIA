import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function validarContextoProgramacao(texto, aiConfig) {
  if (!texto || !texto.trim()) {
    return { valido: false, mensagem: 'Conteudo vazio.' };
  }

  const prompt = `Analise o texto abaixo e responda APENAS com "SIM" ou "NAO".

O texto deve ser sobre programacao, desenvolvimento de software, ou tecnologia (como frameworks, linguagens, algoritmos, banco de dados, APIs, infraestrutura, etc).

Se NAO for sobre programacao/tecnologia, responda NAO.

Texto: "${texto.trim()}"`;

  try {
    const resultado = await completar({
      provider: aiConfig.provider,
      apiKey: aiConfig.apiKey,
      model: aiConfig.provider === 'gemini' ? 'gemini-1.5-flash' : 'llama-3.1-8b-instant',
      prompt,
      temperature: 0,
    });

    const resposta = resultado.trim().toUpperCase();
    const isProgramming = resposta.includes('SIM') && !resposta.includes('NAO');

    console.log('[VALIDACAO]', { texto: texto.substring(0, 80), resposta: resultado.trim(), isProgramming });

    if (!isProgramming) {
      return {
        valido: false,
        mensagem: 'O conteudo informado nao esta relacionado a programacao ou tecnologia. Este site e exclusivamente para estudo de programacao, desenvolvimento de software e areas tech.',
      };
    }
    return { valido: true };
  } catch (e) {
    console.log('Erro na validacao de contexto:', e.message);
    return { valido: true };
  }
}

export async function completar({ provider, apiKey, model, prompt, temperature = 0.7 }) {
  if (provider === 'gemini') {
    return completarGemini({ apiKey, model, prompt, temperature });
  }
  return completarGroq({ apiKey, model, prompt, temperature });
}

async function completarGroq({ apiKey, model, prompt, temperature }) {
  const groq = new Groq({ apiKey });
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: model || 'llama-3.3-70b-versatile',
    temperature,
  });
  return completion.choices[0]?.message?.content || '';
}

async function completarGemini({ apiKey, model, prompt, temperature }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const generativeModel = genAI.getGenerativeModel({ model: model || 'gemini-2.0-flash' });
  const result = await generativeModel.generateContent(prompt);
  return result.response.text() || '';
}

export const MODELOS_GROQ = [
  { id: 'llama-3.3-70b-versatile', nome: 'Llama 3.3 70B (Versatile)' },
  { id: 'llama-3.1-8b-instant', nome: 'Llama 3.1 8B (Instant)' },
  { id: 'gemma2-9b-it', nome: 'Gemma 2 9B' },
  { id: 'mixtral-8x7b-32768', nome: 'Mixtral 8x7B' },
];

export const MODELOS_GEMINI = [
  { id: 'gemini-2.0-flash', nome: 'Gemini 2.0 Flash' },
  { id: 'gemini-2.5-flash', nome: 'Gemini 2.5 Flash' },
  { id: 'gemini-1.5-flash', nome: 'Gemini 1.5 Flash' },
  { id: 'gemini-1.5-pro', nome: 'Gemini 1.5 Pro' },
];

export function extractAIConfig(req) {
  const provider = (req.headers['x-ai-provider'] && req.headers['x-ai-provider'] !== 'undefined') ? req.headers['x-ai-provider'] : 'groq';
  const apiKey = (req.headers['x-ai-api-key'] && req.headers['x-ai-api-key'] !== 'undefined') ? req.headers['x-ai-api-key'] : process.env.GROQ_API_KEY;
  const model = (req.headers['x-ai-model'] && req.headers['x-ai-model'] !== 'undefined') ? req.headers['x-ai-model'] : (provider === 'gemini' ? 'gemini-2.0-flash' : 'llama-3.3-70b-versatile');
  return { provider, apiKey, model };
}
