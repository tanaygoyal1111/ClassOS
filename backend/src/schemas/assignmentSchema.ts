import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

export const QuestionSchema = z.object({
  questionType: z.string().describe("The type of question, e.g., 'MCQ', 'Fill in the Blanks', 'Short Answer'."),
  questionText: z.string().describe("The exact text of the generated main question."),
  options: z.array(z.string()).optional().describe("Strictly for MCQs. Must contain exactly 4 options. Omit otherwise."),
  orQuestionText: z.string().optional().describe("Strictly populated ONLY if the user requested an 'OR' choice for this question. This serves as the alternative question."),
  marks: z.number().describe("Marks allocated to this specific question."),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]).describe("Difficulty level of the question."),
  isOrChoice: z.boolean().describe("True if this question has an 'OR' alternative provided in orQuestionText.")
});

export const SectionSchema = z.object({
  sectionName: z.string().describe("The name of the section (e.g., 'Section A')."),
  instructions: z.string().describe("Instructions specific to this section (e.g., 'Attempt all questions')."),
  questions: z.array(QuestionSchema).describe("List of questions in this section.")
});

export const AnswerKeyItemSchema = z.object({
  questionText: z.string().describe("The text of the question (or the 'OR' question) this answer corresponds to."),
  answer: z.string().describe("The detailed answer or key points for the question.")
});

export const AssignmentResponseSchema = z.object({
  paperTitle: z.string(),
  subject: z.string(),
  classLevel: z.string(),
  timeAllowed: z.string(),
  totalMarks: z.number(),
  sections: z.array(SectionSchema),
  answerKey: z.array(AnswerKeyItemSchema).describe("Answer key matching all generated questions and alternative 'OR' questions.")
});

export type AssignmentResponse = z.infer<typeof AssignmentResponseSchema>;

// Convert to OpenAI's structured output format natively via the helper
export const assignmentResponseFormat = zodResponseFormat(AssignmentResponseSchema, "assignment_generation");
