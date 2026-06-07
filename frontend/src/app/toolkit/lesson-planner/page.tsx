"use client";

import React, { useState } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ArrowLeft, Sparkles, Copy, Check, Loader2, BookOpen, Printer, Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function LessonPlannerPage() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [duration, setDuration] = useState("45");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !subject || !grade) return;
    
    setIsGenerating(true);
    setGeneratedPlan("");
    setIsSaved(false);
    
    try {
      const res = await fetch("/api/toolkit/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, subject, grade, duration }),
      });
      
      const data = await res.json();
      if (data.success) {
        setGeneratedPlan(data.data);
      } else {
        alert("Failed to generate plan: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while generating the lesson plan.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!generatedPlan) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/toolkit/lesson-plan/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, subject, grade, duration, content: generatedPlan }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        toast.success("Saved to your library!");
      } else {
        toast.error("Failed to save: " + data.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900 relative print:h-auto print:block print:bg-white print:overflow-visible">
      <div className="print:hidden">
        <Sidebar />
        <MobileHeader />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full print:block print:h-auto">
        <div className="hidden md:block print:hidden">
          <Topbar />
        </div>

        <main className="flex-1 px-5 pt-28 pb-32 md:p-10 lg:p-12 overflow-y-auto relative flex flex-col print:p-0 print:overflow-visible">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col print:block">
            
            {/* Header */}
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 print:hidden">
              <Link href="/toolkit" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold text-sm mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 w-fit">
                <ArrowLeft className="w-4 h-4" />
                Back to Toolkit
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 flex items-center gap-3">
                <div className="bg-[#FF5A36]/10 p-2 rounded-xl">
                  <Sparkles className="w-8 h-8 text-[#FF5A36]" />
                </div>
                AI Lesson Planner
              </h1>
              <p className="text-base md:text-lg font-medium text-gray-500 max-w-2xl leading-relaxed">
                Instantly generate a structured, highly-engaging lesson plan tailored to your classroom's exact needs.
              </p>
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-700 delay-150 print:block">
              
              {/* Input Section */}
              <div className="lg:col-span-4 bg-white border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[24px] p-6 md:p-8 h-fit relative overflow-hidden print:hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF5A36]/5 to-transparent rounded-full blur-2xl -mr-10 -mt-10" />
                
                <form onSubmit={handleGenerate} className="flex flex-col gap-6 relative z-10">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Topic / Objective</label>
                    <input 
                      type="text" 
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Fractions, Photosynthesis" 
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-medium placeholder:text-gray-400 text-[15px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Mathematics, Science" 
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-medium placeholder:text-gray-400 text-[15px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Grade Level</label>
                    <input 
                      type="text" 
                      required
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. 5th Grade, High School" 
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-medium placeholder:text-gray-400 text-[15px]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Duration (Minutes)</label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all font-medium text-gray-700 text-[15px] appearance-none"
                    >
                      <option value="30">30 Mins (Quick Lesson)</option>
                      <option value="45">45 Mins (Standard Class)</option>
                      <option value="60">60 Mins (Long Block)</option>
                      <option value="90">90 Mins (Double Block)</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isGenerating || !topic || !subject || !grade}
                    className="mt-2 w-full bg-[#18181B] hover:bg-black disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold shadow-md transition-all active:scale-[0.98]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-[#FF5A36]" />
                        Generate Lesson Plan
                      </>
                    )}
                  </button>

                </form>
              </div>

              {/* Output Section */}
              <div className="lg:col-span-8 print:w-full print:block print:col-span-full">
                {generatedPlan ? (
                  <div className="bg-white border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden flex flex-col h-full min-h-[600px] print:shadow-none print:border-none print:m-0 print:p-0">
                    
                    {/* Output Header */}
                    <div className="bg-gray-50/80 border-b border-gray-100 px-6 md:px-8 py-4 flex items-center justify-between shrink-0 print:hidden">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Your Lesson Plan is Ready</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleSave}
                          disabled={isSaving || isSaved}
                          className="flex items-center gap-2 text-[13px] font-bold bg-[#27272A] text-white border border-gray-700 px-4 py-2 rounded-xl hover:bg-[#18181B] transition-colors shadow-sm disabled:bg-gray-200 disabled:text-gray-500 disabled:border-gray-200 active:scale-95 print:hidden"
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isSaved ? <Check className="w-4 h-4 text-green-500" /> : <Bookmark className="w-4 h-4" />)}
                          {isSaved ? "Saved" : "Save"}
                        </button>
                        <button 
                          onClick={() => window.print()}
                          className="flex items-center gap-2 text-[13px] font-bold bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 shadow-sm active:scale-95"
                        >
                          <Printer className="w-4 h-4" />
                          Download PDF
                        </button>
                        <button 
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 text-[13px] font-bold bg-white border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 shadow-sm active:scale-95"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    {/* Markdown Content */}
                    <div className="p-6 md:p-10 overflow-y-auto max-h-[700px] text-[15px] text-gray-800 leading-relaxed font-medium print:max-h-none print:overflow-visible print:p-0">
                      <ReactMarkdown
                        components={{
                          h2: ({node, ...props}) => <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100 first:mt-0 flex items-center gap-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4 text-gray-600 leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-600" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />
                        }}
                      >
                        {generatedPlan}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/50 border border-gray-200/60 border-dashed rounded-[24px] h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100/50 flex items-center justify-center mb-6">
                      <BookOpen className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">Ready to plan your lesson?</h3>
                    <p className="text-[15px] font-medium text-gray-500 max-w-sm leading-relaxed">
                      Fill out the topic, subject, and grade details on the left, then click generate to create a beautifully structured, AI-powered lesson plan.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      <div className="print:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
