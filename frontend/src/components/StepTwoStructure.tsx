'use client';
import React from 'react';
import { Plus, Trash2, Mic, Square } from 'lucide-react';
import { QuestionRow } from './QuestionRow';
import { useFormStore } from '@/store/useFormStore';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export const StepTwoStructure = () => {
  const sections = useFormStore(state => state.sections);
  const basicInfo = useFormStore(state => state.basicInfo);
  const addSection = useFormStore(state => state.addSection);
  const removeSection = useFormStore(state => state.removeSection);
  const addQuestionToSection = useFormStore(state => state.addQuestionToSection);
  const updateSectionName = useFormStore(state => state.updateSectionName);
  const updateBasicInfo = useFormStore(state => state.updateBasicInfo);
  const getSectionTotalQuestions = useFormStore(state => state.getSectionTotalQuestions);
  const getSectionTotalMarks = useFormStore(state => state.getSectionTotalMarks);

  const { isListening, toggleListening } = useSpeechRecognition((transcript) => {
    const currentText = useFormStore.getState().basicInfo.instructions;
    const newText = currentText ? `${currentText} ${transcript}` : transcript;
    updateBasicInfo('instructions', newText);
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {sections.map(section => {
        const sectionQs = getSectionTotalQuestions(section.id);
        const sectionMarks = getSectionTotalMarks(section.id);

        return (
          <div key={section.id} className="bg-gray-50/60 border border-gray-100 rounded-[28px] p-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.01)] relative group">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4 flex-1">
                <input 
                  type="text" 
                  value={section.name}
                  onChange={(e) => updateSectionName(section.id, e.target.value)}
                  className="bg-transparent border-none text-[17px] font-bold text-gray-900 focus:outline-none focus:ring-0 placeholder:text-gray-400 w-[160px]"
                  placeholder="Section Name"
                />
                <span className="bg-white border border-gray-200 text-gray-500 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm tracking-tight">
                  {sectionQs} Qs • {sectionMarks} Marks
                </span>
              </div>
              <button 
                onClick={() => removeSection(section.id)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-colors shadow-sm opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100 shrink-0"
                title="Delete Section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Question Rows */}
            <div className="flex flex-col gap-3">
              {section.questions.map(q => (
                <QuestionRow key={q.id} sectionId={section.id} row={q} />
              ))}
            </div>

            <button 
              onClick={() => addQuestionToSection(section.id)}
              className="mt-5 flex items-center gap-2.5 text-[13px] font-bold text-gray-600 hover:text-gray-900 transition-colors ml-1"
            >
              <div className="w-6 h-6 bg-white border border-gray-200 text-gray-600 rounded-full flex items-center justify-center shadow-sm">
                <Plus className="w-3.5 h-3.5" />
              </div>
              Add Question
            </button>
          </div>
        );
      })}

      <div className="flex justify-center mt-2 mb-4">
        <button 
          onClick={addSection}
          className="flex items-center gap-2 bg-[#18181B] hover:bg-black text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4" />
          Add New Section
        </button>
      </div>

      {/* Additional Information Relocated */}
      <div className="mt-2">
        <label className="block text-[13px] font-bold text-gray-800 mb-2.5 ml-1 tracking-tight">Additional Information (For better output)</label>
        <div className="relative">
          <textarea 
            rows={4}
            placeholder="e.g Generate a question paper for 3 hour exam duration..."
            value={basicInfo.instructions}
            onChange={(e) => updateBasicInfo('instructions', e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 text-[13px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none shadow-sm"
          />
          <button 
            onClick={toggleListening}
            title={isListening ? "Stop recording" : "Start Voice-to-Text"}
            className={`absolute bottom-4 right-4 w-9 h-9 shadow-sm border rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 animate-pulse' : 'bg-white border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            {isListening ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
