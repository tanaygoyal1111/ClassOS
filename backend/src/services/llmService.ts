import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { AssignmentFormData, buildSystemPrompt } from '../utils/promptBuilder.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// ── Multi-Provider Model Fallback Chain ─────────────────────────
// This chain ensures absolute maximum reliability. If Groq hits a rate limit
// or gets overloaded, we immediately failover to NVIDIA's extremely powerful
// API. Both APIs use the same OpenAI-compatible interface.
// All models selected are massive (70B+) ensuring flawless structured JSON output.
const MODEL_CHAIN = [
  // Primary: Groq is extremely fast, use its Llama 3.3 70B first.
  { provider: 'groq', model: 'llama-3.3-70b-versatile', client: groq },
  
  // Fallback 1: NVIDIA's Llama 3.3 70B (Identical quality, different quota pool)
  { provider: 'nvidia', model: 'meta/llama-3.3-70b-instruct', client: nvidia },
  
  // Fallback 2: Groq GPT-OSS 120B (Massive model, excellent JSON adherence)
  { provider: 'groq', model: 'openai/gpt-oss-120b', client: groq },
  
  // Fallback 3: NVIDIA Mixtral 8x22B (Very strong MoE, distinct architecture)
  { provider: 'nvidia', model: 'mistralai/mixtral-8x22b-v0.1', client: nvidia },
] as const;

// HTTP status codes that warrant trying the next model
const RETRYABLE_STATUS_CODES = new Set([429, 502, 503, 504]);

/**
 * Checks whether an SDK error is transient (rate-limit / server overload)
 * and therefore eligible for model/provider fallback.
 */
const isRetryableError = (error: any): boolean => {
  const status: number | undefined =
    error?.status ?? error?.statusCode ?? error?.error?.status;
  return typeof status === 'number' && RETRYABLE_STATUS_CODES.has(status);
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates an assignment with automatic cross-provider model fallback.
 */
export const generateAssignment = async (
  formData: AssignmentFormData,
  textContent: string
) => {
  const systemPrompt = buildSystemPrompt(formData, textContent);
  let lastError: any = null;

  for (let i = 0; i < MODEL_CHAIN.length; i++) {
    const { provider, model, client } = MODEL_CHAIN[i];

    try {
      console.log(`[LLM] Attempting generation with [${provider.toUpperCase()}] model: ${model}`);

      // Both Groq and OpenAI SDKs support this exact identical interface
      const response = await (client.chat.completions as any).create({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ],
        temperature: 0.7,
        // Only enforce json_object if supported, otherwise rely on the prompt instructing it.
        // Groq supports it broadly, NVIDIA supports it on Llama 3 models.
        response_format: { type: 'json_object' },
      });

      const rawContent = response.choices[0]?.message?.content;

      if (!rawContent) {
        throw new Error(`[${provider.toUpperCase()}] returned an empty response.`);
      }

      // Sanitise: Some models might still output markdown fences or reasoning tags
      const content = rawContent
        .replace(/<think>[\s\S]*?<\/think>/gi, '')   // strip reasoning tags
        .replace(/^```(?:json)?\s*/i, '')             // strip leading code fence
        .replace(/\s*```$/i, '')                      // strip trailing code fence
        .trim();

      // Parse the JSON — failures here are NOT retryable (prompt issue, not provider availability)
      try {
        const parsed = JSON.parse(content);
        console.log(`[LLM] Successfully generated with [${provider.toUpperCase()}] model: ${model}`);
        return parsed;
      } catch {
        console.error(`[LLM] JSON parse failed for model "${model}". Raw content (first 500 chars):`, rawContent.substring(0, 500));
        throw new Error('Failed to parse AI response as valid JSON.');
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`[LLM] [${provider.toUpperCase()}] Model "${model}" failed: ${error?.message || error}`);

      // Non-retryable errors (401 auth, 400 bad request, JSON parse, etc.) — fail fast
      if (!isRetryableError(error)) {
        break;
      }

      // If there's a next model in the chain, wait briefly then try it
      if (i < MODEL_CHAIN.length - 1) {
        console.log(`[LLM] Rate-limited/Overloaded on "${model}", falling back to "${MODEL_CHAIN[i + 1].model}"...`);
        await delay(1000);
      }
    }
  }

  // All models exhausted or a non-retryable error occurred
  console.error('[LLM] All models across all providers failed:', lastError);
  throw new Error(`Failed to generate assignment: ${lastError?.message || 'Unknown error'}`);
};

