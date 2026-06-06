const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: "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",
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-pro",
      messages: [{"role":"system","content":"Return a JSON object with key \"test\" set to true. No markdown."}],
      temperature: 0.1,
    });
    console.log(completion.choices[0].message.content);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
main();
