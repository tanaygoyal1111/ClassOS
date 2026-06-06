export interface QuestionRow {
  type: string;
  difficulty: string;
  count: number;
  marks: number;
  hasInternalChoice: boolean;
}

export interface Section {
  name: string;
  questions: QuestionRow[];
}

export interface AssignmentFormData {
  classLevel: string;
  subject: string;
  timeAllowed: string;
  totalMarks?: number;
  additionalInfo?: string;
  sections: Section[];
}

/**
 * Constructs a highly advanced, dynamic system prompt for the LLM.
 * Flawlessly translates granular frontend constraints into strict directives.
 */
export const buildSystemPrompt = (formData: AssignmentFormData, extractedText: string): string => {
  let blueprintStr = "";

  if (formData.sections && formData.sections.length > 0) {
    formData.sections.forEach((sec, sIdx) => {
      blueprintStr += `\n[Section ${sIdx + 1}: ${sec.name}]\n`;
      sec.questions.forEach((row, rIdx) => {
        let rule = `- Rule ${rIdx + 1}: Generate exactly ${row.count} question(s) of type '${row.type}' worth ${row.marks} marks each. Difficulty: ${row.difficulty}.`;
        
        const qTypeLower = row.type.toLowerCase();
        
        if (qTypeLower.includes("multiple choice") || qTypeLower === "mcq") {
          rule += " You MUST provide exactly 4 options in the 'options' array.";
        }
        
        if (qTypeLower.includes("fill in the blanks") || qTypeLower.includes("blank")) {
          rule += " The questionText MUST contain a blank line (e.g., '________').";
        }
        
        if (row.hasInternalChoice) {
          rule += " This question MUST have an internal choice. You MUST provide an alternative question in the 'orQuestionText' field and set 'isOrChoice' to true.";
        } else {
          rule += " Do NOT provide an internal choice. Omit 'orQuestionText' and set 'isOrChoice' to false.";
        }
        
        blueprintStr += `${rule}\n`;
      });
    });
  }

  let instructionsStr = "";
  if (formData.additionalInfo && formData.additionalInfo.trim() !== "") {
    instructionsStr = `\nTEACHER'S STRICT INSTRUCTIONS:\n${formData.additionalInfo}\n\nYou MUST incorporate these specific requirements into the paper's difficulty, tone, or content.\n`;
  }

  return `You are an elite academic curriculum designer. Your task is to generate an assignment using ONLY the provided text as the source of truth. Do not invent facts.

### Global Instructions:
- Subject: ${formData.subject}
- Class/Grade Level: ${formData.classLevel}
- Time Allowed: ${formData.timeAllowed}
${formData.totalMarks ? `- Total Marks: ${formData.totalMarks}` : ''}
${instructionsStr}

### Dynamic Section Blueprint (The Engine):
You MUST follow this exact structure, question count, question type, and marks allocation.
${blueprintStr}

### Source Material:
The following text is the raw extracted content from the uploaded document. Base all questions strictly on this content.
<source_material>
${extractedText}
</source_material>

### Output Enforcement:
Return ONLY a valid JSON object matching the requested schema. NO markdown formatting. NO introductory text.

Schema required:
{
  "paperTitle": "string",
  "subject": "string",
  "classLevel": "string",
  "timeAllowed": "string",
  "totalMarks": number,
  "sections": [
    {
      "sectionName": "string",
      "instructions": "string",
      "questions": [
        {
          "questionType": "string",
          "questionText": "string",
          "options": ["string", "string", "string", "string"], // Strictly for MCQs
          "orQuestionText": "string", // Strictly populated ONLY if the user requested an "OR" choice
          "marks": number,
          "difficulty": "Easy" | "Moderate" | "Challenging",
          "isOrChoice": boolean
        }
      ]
    }
  ],
  "answerKey": [
    {
      "questionText": "string",
      "answer": "string" // For 'OR' questions, include answers for both alternatives clearly
    }
  ]
}
`;
};
