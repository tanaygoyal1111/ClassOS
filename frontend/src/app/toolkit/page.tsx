import React from 'react';
import Link from 'next/link';
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { BookOpen, FileCheck, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';

interface ToolkitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  link?: string;
  className?: string;
}

const ToolkitCard = ({ title, description, icon, isActive, link, className = '' }: ToolkitCardProps) => {
  const CardWrapper = isActive && link ? Link : 'div';
  
  return (
    <CardWrapper
      href={link || '#'}
      className={`relative group bg-white border border-gray-100 rounded-[24px] p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] ${!isActive ? 'opacity-80' : ''} ${className}`}
    >
      {/* Decorative Gradient Blob */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-150" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 text-gray-700 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-white">
          {icon}
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">{title}</h3>
        <p className="text-[15px] font-medium text-gray-500 leading-relaxed max-w-[95%]">
          {description}
        </p>
      </div>

      <div className="mt-10 relative z-10 flex items-center justify-between">
        {isActive ? (
          <div className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-full text-[14px] font-bold shadow-sm group-hover:bg-black group-hover:px-7 transition-all duration-300 gap-2">
            Try Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        ) : (
          <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-400 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider">
            Coming Soon
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

export default function ToolkitPage() {
  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900 relative">
      <Sidebar />
      <MobileHeader />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex-1 px-5 pt-28 pb-32 md:p-10 lg:p-12 overflow-y-auto relative flex flex-col">
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
            
            {/* Page Header */}
            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-gray-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5 border border-gray-200 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                ClassOS Labs
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                AI Teacher's Toolkit
              </h1>
              <p className="text-base md:text-[17px] font-medium text-gray-500 max-w-2xl leading-relaxed">
                Supercharge your daily teaching workflow with AI-powered micro-tools designed specifically for modern educators.
              </p>
            </div>

            {/* Bento Box Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
              
              {/* Highlighted Tool (Spans 2 columns) */}
              <ToolkitCard 
                title="AI Lesson Planner"
                description="Instantly generate structured 45-minute lesson plans for any topic. Complete with learning objectives, interactive activities, and assessments."
                icon={<BookOpen className="w-6 h-6 text-gray-800" />}
                isActive={true}
                link="/toolkit/lesson-planner"
                className="md:col-span-2 lg:col-span-2"
              />

              {/* standard bento grid cards */}
              <ToolkitCard 
                title="Grading Rubric Creator"
                description="Generate fair, objective grading criteria for subjective assignments and essays in seconds."
                icon={<FileCheck className="w-6 h-6 text-gray-800" />}
                isActive={true}
                link="/toolkit/rubric-creator"
              />

              <ToolkitCard 
                title="Concept Simplifier"
                description="Break down complex topics into easy-to-understand analogies and real-world examples for your students."
                icon={<Lightbulb className="w-6 h-6 text-gray-800" />}
                isActive={true}
                link="/toolkit/concept-simplifier"
              />

            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
