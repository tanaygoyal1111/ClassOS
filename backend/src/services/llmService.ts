import Groq from 'groq-sdk';
import { AssignmentFormData, buildSystemPrompt } from '../utils/promptBuilder.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── Model Fallback Chain ────────────────────────────────────────
// Each model on Groq has *independent* rate limits.
// If the primary hits 429/503, we gracefully fall back to the next.
const MODEL_CHAIN = [
  'llama-3.3-70b-versatile',   // Primary  — best quality, lower free-tier limits
  'llama-3.1-8b-instant',      // Fallback — fast, ~10x higher rate limits
] as const;

// HTTP status codes that warrant trying the next model
const RETRYABLE_STATUS_CODES = new Set([429, 502, 503]);

/**
 * Checks whether a Groq SDK error is transient (rate-limit / server overload)
 * and therefore eligible for model fallback.
 */
const isRetryableError = (error: any): boolean => {
  const status: number | undefined =
    error?.status ?? error?.statusCode ?? error?.error?.status;
  return typeof status === 'number' && RETRYABLE_STATUS_CODES.has(status);
};

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generates an assignment using Groq, with automatic model fallback.
 * The function signature is identical to the original — no caller changes needed.
 */
export const generateAssignment = async (
  formData: AssignmentFormData,
  textContent: string
) => {
  const systemPrompt = buildSystemPrompt(formData, textContent);
  let lastError: any = null;

  for (let i = 0; i < MODEL_CHAIN.length; i++) {
    const model = MODEL_CHAIN[i];

    try {
      console.log(`[LLM] Attempting generation with model: ${model}`);

      const response = await groq.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Groq returned an empty response.');
      }

      // Parse the JSON — failures here are NOT retryable (prompt issue, not model availability)
      try {
        const parsed = JSON.parse(content);
        console.log(`[LLM] Successfully generated with model: ${model}`);
        return parsed;
      } catch {
        throw new Error('Failed to parse AI response as valid JSON.');
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`[LLM] Model "${model}" failed: ${error?.message || error}`);

      // Non-retryable errors (401 auth, 400 bad request, JSON parse, etc.) — fail fast
      if (!isRetryableError(error)) {
        break;
      }

      // If there's a next model in the chain, wait briefly then try it
      if (i < MODEL_CHAIN.length - 1) {
        console.log(`[LLM] Rate-limited on "${model}", falling back to "${MODEL_CHAIN[i + 1]}"...`);
        await delay(1000);
      }
    }
  }

  // All models exhausted or a non-retryable error occurred
  console.error('[LLM] All models failed:', lastError);
  throw new Error(`Failed to generate assignment: ${lastError?.message || 'Unknown error'}`);
};

