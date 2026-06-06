const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: "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",
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [{"role":"system","content":"Return a JSON object with key \"test\" set to true."}],
      temperature: 0.1,
    });
    console.log(completion.choices[0].message.content);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
main();
