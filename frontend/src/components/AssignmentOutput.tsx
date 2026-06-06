'use client';
import React, { useRef, useState } from 'react';
import { Download, Loader2, Printer } from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';
import { useRouter } from 'next/navigation';
import { PaperRenderer } from './shared/PaperRenderer';

export const AssignmentOutput = () => {
  const generatedPaper = useFormStore(state => state.generatedPaper);
  const basicInfo = useFormStore(state => state.basicInfo);
  const router = useRouter();
  const paperRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (!generatedPaper) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-4">
        <p>No assignment generated yet. Please generate one first.</p>
        <button 
          onClick={() => router.push('/assignments/create')}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-full font-bold transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#27272A] rounded-[32px] p-6 md:p-10 overflow-y-auto animate-in fade-in duration-500 relative scroll-smooth print:bg-white print:p-0 print:overflow-visible print:h-auto print:block print:rounded-none">
      
      {/* Top Action Card */}
      <div className="bg-[#1F2937] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-10 shadow-2xl border border-gray-700/50 print:hidden">
        <h2 className="text-white text-[15px] md:text-[17px] font-medium leading-relaxed max-w-[70%] tracking-wide">
          <span className="font-bold text-white">Certainly!</span> Here is the customized <span className="font-bold underline decoration-white/40 underline-offset-4">Question Paper</span> for your classes:
        </h2>
        <button 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="shrink-0 bg-white hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed text-black px-7 py-3.5 rounded-full flex items-center gap-2.5 font-bold text-[14px] transition-all active:scale-95 shadow-sm"
        >
          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
          Print / Save PDF
        </button>
      </div>

      {/* A4 Paper Canvas */}
      {/* We add print-specific utility classes to ensure only this area prints, with no background styling on the paper itself */}
      <div 
        ref={paperRef}
        className="max-w-[850px] mx-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] print:shadow-none p-12 md:px-20 md:py-16 print:p-0 text-gray-900 font-sans border border-gray-200 print:border-none print:m-0 print:max-w-none"
      >
        <PaperRenderer paperData={{
          ...generatedPaper,
          institutionName: basicInfo?.institutionName,
          studentFields: basicInfo?.studentFields
        }} />
      </div>
    </div>
  );
};
