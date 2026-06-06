"use client";

import React from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const PrintActionCard = ({ paperTitle = "Assignment" }: { paperTitle?: string }) => {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#1F2937] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xl border border-gray-700/50 print:hidden">
      <button 
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <button 
        onClick={handlePrint}
        disabled={isDownloading}
        className="shrink-0 bg-white hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed text-black px-7 py-3.5 rounded-full flex items-center gap-2.5 font-bold text-[14px] transition-all active:scale-95 shadow-sm"
      >
        {isDownloading ? <span className="animate-spin mr-1 text-lg leading-none">↻</span> : <Printer className="w-4 h-4" />}
        Print / Save PDF
      </button>
    </div>
  );
};
