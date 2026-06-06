const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: "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",
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const models = [
  "nvidia/llama-3.1-nemotron-70b-instruct",
  "deepseek-ai/deepseek-v4-pro",
  "minimaxai/minimax-m2.7",
  "moonshotai/kimi-k2.6"
];

async function main() {
  for (const model of models) {
    try {
      const start = Date.now();
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{"role":"system","content":"Return a JSON object with key \"test\" set to true. No markdown."}],
        temperature: 0.1,
      });
      const time = Date.now() - start;
      console.log(`[SUCCESS] ${model} - ${time}ms - Output: ${completion.choices[0].message.content.substring(0, 50)}`);
    } catch (err) {
      console.error(`[ERROR] ${model} - ${err.message}`);
    }
  }
}
main();
