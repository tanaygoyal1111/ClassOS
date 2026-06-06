import { create } from 'zustand';

export interface QuestionRow {
  id: string;
  type: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
  marks: number;
  hasInternalChoice: boolean;
}

export interface Section {
  id: string;
  name: string;
  questions: QuestionRow[];
}

interface FormState {
  step: 1 | 2;
  setStep: (step: 1 | 2) => void;
  
  basicInfo: { 
    classLevel: string; 
    subject: string; 
    dueDate: string; 
    instructions: string; 
    institutionName: string;
    studentFields: string[];
    timeAllowed: string;
    uploadedFile: File | null;
    groupId?: string;
  };
  updateBasicInfo: (field: string, value: any) => void;
  setUploadedFile: (file: File | null) => void;
  
  sections: Section[];
  addSection: () => void;
  removeSection: (id: string) => void;
  updateSectionName: (id: string, name: string) => void;
  addQuestionToSection: (sectionId: string) => void;
  updateQuestion: (sectionId: string, questionId: string, field: keyof QuestionRow, value: any) => void;
  removeQuestion: (sectionId: string, questionId: string) => void;
  
  getTotalQuestions: () => number;
  getTotalMarks: () => number;
  getSectionTotalQuestions: (sectionId: string) => number;
  getSectionTotalMarks: (sectionId: string) => number;

  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  generationStatus: string;
  setGenerationStatus: (val: string) => void;
  generatedPaper: any | null;
  setGeneratedPaper: (paper: any) => void;
}

const OBJECTIVE_TYPES = ['Multiple Choice Questions', 'Fill in the Blanks', 'True/False'];

export const useFormStore = create<FormState>((set, get) => ({
  step: 1,
  setStep: (step) => set({ step }),
  
  basicInfo: { classLevel: '', subject: '', dueDate: '', instructions: '', institutionName: '', studentFields: ['Name', 'Roll Number'], timeAllowed: '', uploadedFile: null, groupId: '' },
  updateBasicInfo: (field, value) => set((state) => {
    if (field === 'studentFields') {
      const currentFields = state.basicInfo.studentFields || [];
      const newFields = currentFields.includes(value as string)
        ? currentFields.filter(f => f !== value)
        : [...currentFields, value as string];
      return { basicInfo: { ...state.basicInfo, studentFields: newFields } };
    }
    return { basicInfo: { ...state.basicInfo, [field]: value } };
  }),
  setUploadedFile: (file) => set((state) => ({
    basicInfo: { ...state.basicInfo, uploadedFile: file }
  })),
  
  sections: [
    {
      id: 'sec-1',
      name: 'Section A',
      questions: [
        { id: 'q-1', type: 'Multiple Choice Questions', difficulty: 'Medium', count: 4, marks: 1, hasInternalChoice: false }
      ]
    }
  ],
  
  addSection: () => set((state) => ({
    sections: [
      ...state.sections,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: `Section ${String.fromCharCode(65 + state.sections.length)}`, // Section B, C...
        questions: []
      }
    ]
  })),
  
  removeSection: (id) => set((state) => ({
    sections: state.sections.filter(sec => sec.id !== id)
  })),

  updateSectionName: (id, name) => set((state) => ({
    sections: state.sections.map(sec => sec.id === id ? { ...sec, name } : sec)
  })),
  
  addQuestionToSection: (sectionId) => set((state) => ({
    sections: state.sections.map(sec => 
      sec.id === sectionId ? {
        ...sec,
        questions: [
          ...sec.questions,
          {
            id: Math.random().toString(36).substr(2, 9),
            type: 'Short Questions',
            difficulty: 'Medium',
            count: 1,
            marks: 2,
            hasInternalChoice: false
          }
        ]
      } : sec
    )
  })),
  
  updateQuestion: (sectionId, questionId, field, value) => set((state) => ({
    sections: state.sections.map(sec => 
      sec.id === sectionId ? {
        ...sec,
        questions: sec.questions.map(q => {
          if (q.id === questionId) {
            let updatedQ: any = { ...q };

            if (field === 'count' || field === 'marks') {
              updatedQ[field] = Number(value) || 0;
            } else {
              updatedQ[field] = value;
            }

            // Constraint A: If changing to objective type, force hasInternalChoice: false
            if (field === 'type' && OBJECTIVE_TYPES.includes(String(value))) {
              updatedQ.hasInternalChoice = false;
            }

            // Constraint B: If changing hasInternalChoice to true, force count: 1
            if (field === 'hasInternalChoice' && value === true) {
              updatedQ.count = 1;
            }

            return updatedQ;
          }
          return q;
        })
      } : sec
    )
  })),
  
  removeQuestion: (sectionId, questionId) => set((state) => ({
    sections: state.sections.map(sec => 
      sec.id === sectionId ? {
        ...sec,
        questions: sec.questions.filter(q => q.id !== questionId)
      } : sec
    )
  })),
  
  getTotalQuestions: () => {
    const { sections } = get();
    return sections.reduce((totalQs, section) => {
      const sectionQs = section.questions.reduce((sum, q) => sum + Number(q.count || 0), 0);
      return totalQs + sectionQs;
    }, 0);
  },
  
  getTotalMarks: () => {
    const { sections } = get();
    return sections.reduce((totalMarks, section) => {
      const sectionMarks = section.questions.reduce((sum, q) => sum + (Number(q.count || 0) * Number(q.marks || 0)), 0);
      return totalMarks + sectionMarks;
    }, 0);
  },

  getSectionTotalQuestions: (sectionId) => {
    const section = get().sections.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.questions.reduce((sum, q) => sum + Number(q.count || 0), 0);
  },

  getSectionTotalMarks: (sectionId) => {
    const section = get().sections.find(s => s.id === sectionId);
    if (!section) return 0;
    return section.questions.reduce((sum, q) => sum + (Number(q.count || 0) * Number(q.marks || 0)), 0);
  },

  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),
  generationStatus: "",
  setGenerationStatus: (val) => set({ generationStatus: val }),
  generatedPaper: null,
  setGeneratedPaper: (paper) => set({ generatedPaper: paper })
}));
