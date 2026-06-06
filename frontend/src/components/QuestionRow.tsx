import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Counter } from './Counter';
import { QuestionRow as QuestionRowType } from '@/store/useFormStore';
import { useFormStore } from '@/store/useFormStore';

interface QuestionRowProps {
  sectionId: string;
  row: QuestionRowType;
}

const QUESTION_TYPES = [
  'Multiple Choice Questions',
  'Fill in the Blanks',
  'True/False',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Long Answer Questions'
];

const OBJECTIVE_TYPES = ['Multiple Choice Questions', 'Fill in the Blanks', 'True/False'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const QuestionRow = ({ sectionId, row }: QuestionRowProps) => {
  const updateQuestion = useFormStore(state => state.updateQuestion);
  const removeQuestion = useFormStore(state => state.removeQuestion);

  const isObjective = OBJECTIVE_TYPES.includes(row.type);

  const handleToggleClick = () => {
    if (isObjective) {
      toast.error("Internal choice ('OR') is not applicable for objective questions.");
      return;
    }
    
    const newValue = !row.hasInternalChoice;
    updateQuestion(sectionId, row.id, 'hasInternalChoice', newValue);
    
    if (newValue) {
      toast.info("Question count locked to 1 for 'OR' choice questions.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-3 py-4 md:py-2.5 group bg-white border border-gray-100 rounded-2xl px-4 shadow-sm md:shadow-[0_2px_10px_rgb(0,0,0,0.01)] md:hover:shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all mb-4 md:mb-0 relative">
      
      <div className="flex items-center justify-between w-full md:w-auto md:flex-1 gap-3">
        {/* Type Dropdown */}
        <div className="relative flex-1 md:min-w-[200px]">
          <select 
            value={row.type}
            onChange={(e) => updateQuestion(sectionId, row.id, 'type', e.target.value)}
            className="w-full appearance-none bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl px-4 py-2.5 md:py-2 text-[13px] font-semibold text-gray-800 focus:outline-none"
          >
            {QUESTION_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>

        {/* Mobile Delete Button */}
        <button 
          onClick={() => removeQuestion(sectionId, row.id)}
          className="md:hidden w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-md bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-100 transition-colors"
          title="Delete Question"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Difficulty Dropdown */}
      <div className="relative w-full md:w-[110px] shrink-0">
        <select 
          value={row.difficulty}
          onChange={(e) => updateQuestion(sectionId, row.id, 'difficulty', e.target.value)}
          className="w-full appearance-none bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl px-4 py-2.5 md:py-2 text-[13px] font-semibold text-gray-800 focus:outline-none"
        >
          {DIFFICULTIES.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
      </div>

      <div className="grid grid-cols-2 md:flex items-center gap-4 md:gap-3 w-full md:w-auto">
        {/* No. of Questions */}
        <div className="flex flex-col items-start md:items-center shrink-0 w-full md:w-[100px]">
          <span className="text-[10px] font-bold text-gray-400 mb-1.5 md:mb-1 uppercase tracking-wider">Count</span>
          <div className="w-full md:w-auto">
            <Counter 
              value={row.count} 
              onChange={(val) => updateQuestion(sectionId, row.id, 'count', val)} 
              disabled={row.hasInternalChoice}
            />
          </div>
        </div>

        {/* Marks */}
        <div className="flex flex-col items-start md:items-center shrink-0 w-full md:w-[100px]">
          <span className="text-[10px] font-bold text-gray-400 mb-1.5 md:mb-1 uppercase tracking-wider">Marks</span>
          <div className="w-full md:w-auto">
            <Counter 
              value={row.marks} 
              onChange={(val) => updateQuestion(sectionId, row.id, 'marks', val)} 
            />
          </div>
        </div>

        {/* Internal Choice Toggle */}
        <div className="col-span-2 md:col-span-1 md:w-[90px] flex flex-row md:flex-col items-center justify-between md:justify-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:px-2 mt-1 md:mt-0">
          <span className="text-[11px] md:text-[10px] font-bold text-gray-400 mb-0 md:mb-1.5 uppercase tracking-wider">"OR" Choice</span>
          {/* Wrapper Div for catching clicks when disabled */}
          <div 
            onClick={handleToggleClick}
            className={`w-10 h-5 rounded-full flex items-center transition-all px-0.5 ${isObjective ? 'opacity-50 cursor-not-allowed bg-gray-200' : (row.hasInternalChoice ? 'bg-green-500 cursor-pointer' : 'bg-gray-200 cursor-pointer')}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${row.hasInternalChoice && !isObjective ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        </div>
      </div>

      {/* Desktop Delete Button */}
      <button 
        onClick={() => removeQuestion(sectionId, row.id)}
        className="hidden md:flex w-8 h-8 items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-1"
        title="Delete Question"
      >
        <X className="w-4 h-4" />
      </button>

    </div>
  );
};
