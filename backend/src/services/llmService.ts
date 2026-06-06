import Groq from 'groq-sdk';
import { AssignmentFormData, buildSystemPrompt } from '../utils/promptBuilder.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAssignment = async (
  formData: AssignmentFormData,
  textContent: string
) => {
  try {
    const systemPrompt = buildSystemPrompt(formData, textContent);

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Groq returned an empty response.');
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error('[Groq LLM Error]:', error);
    throw new Error(`Failed to generate assignment: ${error.message}`);
  }
};
