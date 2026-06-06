import React from 'react';
import Link from 'next/link';
import { Plus, Search, X } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center w-full animate-in fade-in zoom-in duration-500 pb-32 md:pb-0">
      {/* Decorative Illustration */}
      <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
        {/* Soft Background Blob */}
        <div className="absolute inset-0 bg-blue-50/60 rounded-full blur-3xl"></div>
        
        {/* Central Document Graphic */}
        <div className="relative bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl w-28 h-36 border border-gray-100/50 flex flex-col p-5 gap-3.5 z-10">
          <div className="w-12 h-2.5 bg-gray-800 rounded-full"></div>
          <div className="w-full h-2 bg-gray-100 rounded-full mt-1"></div>
          <div className="w-4/5 h-2 bg-gray-100 rounded-full"></div>
          <div className="w-full h-2 bg-gray-100 rounded-full"></div>
          <div className="w-3/4 h-2 bg-gray-100 rounded-full"></div>
        </div>

        {/* Magnifying Glass Overlay with Red Cross */}
        <div className="absolute -bottom-2 -right-4 z-20 transform rotate-12">
          <div className="relative">
            {/* The Lens and Handle */}
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-full p-4 border border-gray-50">
              <Search className="w-14 h-14 text-[#FF5A36]/20 stroke-[4]" />
            </div>
            {/* The Cross in the center of the lens */}
            <div className="absolute top-[42%] left-[42%] -translate-x-1/2 -translate-y-1/2 bg-red-100/80 rounded-full p-1.5 shadow-sm">
               <X className="w-6 h-6 text-red-500 stroke-[4]" />
            </div>
          </div>
        </div>

        {/* Soft decorative floating elements */}
        <div className="absolute top-8 left-6 w-3 h-3 bg-blue-400 rotate-45 rounded-sm opacity-60"></div>
        <div className="absolute bottom-16 -left-4 w-2 h-2 bg-orange-400 rounded-full opacity-60"></div>
        <div className="absolute top-12 -right-2 w-2.5 h-2.5 bg-indigo-400 rounded-full opacity-60"></div>
        
        {/* Squiggly line placeholder using SVG */}
        <svg className="absolute top-0 -left-6 w-16 h-16 text-gray-300 opacity-70" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M 10 50 Q 25 30 40 50 T 70 50" />
        </svg>
      </div>

      <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">No assignments yet</h2>
      
      <p className="text-gray-500 mt-3 text-[15px] leading-relaxed max-w-[420px]">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
      </p>

      <Link href="/assignments/create" className="hidden md:flex mt-8 bg-[#18181B] hover:bg-black text-white px-7 py-3 rounded-full items-center justify-center gap-2.5 font-medium transition-all hover:shadow-lg active:scale-[0.98]">
        <Plus className="w-4 h-4" />
        Create Your First Assignment
      </Link>
    </div>
  );
};
