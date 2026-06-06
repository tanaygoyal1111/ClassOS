'use client';
import React from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { StepOneBasics } from './StepOneBasics';
import { StepTwoStructure } from './StepTwoStructure';
import { useFormStore } from '@/store/useFormStore';
import { useRouter } from 'next/navigation';
import { useGenerateAssignment } from '@/hooks/useGenerateAssignment';

export const CreateAssignment = () => {
  const router = useRouter();
  const step = useFormStore(state => state.step);
  const setStep = useFormStore(state => state.setStep);
  const totalQuestions = useFormStore(state => state.getTotalQuestions());
  const totalMarks = useFormStore(state => state.getTotalMarks());
  const isGenerating = useFormStore(state => state.isGenerating);
  const generationStatus = useFormStore(state => state.generationStatus);
  const { generate } = useGenerateAssignment();

  const handlePrevious = () => {
    if (step === 1) {
      router.push('/dashboard');
    } else {
      setStep(1);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      generate();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full relative">
      {/* Top Header & Progress Bar */}
      <div className="mb-6 px-4">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Create Assignment</h1>
        </div>
        <p className="text-[14px] text-gray-500 mb-5 ml-5 font-medium">Set up a new assignment for your students</p>
        
        {/* Progress Bar */}
        <div className="flex gap-1.5 ml-5 max-w-[400px]">
          <div className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${step >= 1 ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
          <div className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${step >= 2 ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-10 shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-white flex-1 overflow-y-auto mb-24 z-10 flex flex-col">
        <div className="mb-8 shrink-0 flex justify-between items-end">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900">
              {step === 1 ? 'Step 1: Basic Information' : 'Step 2: Paper Structure'}
            </h2>
            <p className="text-[13px] text-gray-400 font-medium mt-1">
              {step === 1 ? 'Provide the foundational details for your assignment' : 'Define sections and question distributions'}
            </p>
          </div>
          {step === 2 && (
            <div className="flex items-center gap-4 text-sm font-bold text-gray-900 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <div>Total Qs : <span className="text-[#FF5A36]">{totalQuestions}</span></div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div>Marks : <span className="text-[#FF5A36]">{totalMarks}</span></div>
            </div>
          )}
        </div>

        <div className="flex-1">
          {step === 1 ? <StepOneBasics /> : <StepTwoStructure />}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-4 right-4 flex justify-between items-center z-20">
        <button 
          onClick={handlePrevious}
          className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-7 py-3 rounded-full flex items-center gap-2.5 shadow-sm border border-gray-200 transition-all text-sm hover:-translate-x-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        <button 
          onClick={handleNext}
          disabled={isGenerating}
          className="bg-[#18181B] hover:bg-black text-white font-semibold px-9 py-3 rounded-full flex items-center gap-2.5 shadow-md transition-all text-sm hover:translate-x-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-x-0"
        >
          {step === 1 ? (
            <>Next <ArrowRight className="w-4 h-4" /></>
          ) : isGenerating ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {generationStatus}</>
          ) : (
            <>Generate Paper <Check className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </div>
  );
};
