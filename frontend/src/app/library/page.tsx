"use client";

import React, { useState, useEffect } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AssignmentCard } from "@/components/AssignmentCard";
import { BookOpen, FileText, Loader2, Calendar, Clock, BookMarked, Trash2, X, Eye, FileCheck, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { useAssignmentsStore } from '@/store/useAssignmentsStore';

export default function LibraryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"papers" | "lessons" | "rubrics" | "concepts">("papers");
  const [assignments, setAssignments] = useState<any[]>([]);
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [rubrics, setRubrics] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State for viewing a saved document
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<"lesson" | "rubric" | "concept" | null>(null);

  // Modal State for delete confirmation
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: "lesson" | "rubric" | "concept" | "assignment"; title: string } | null>(null);
  const [isDeletingItem, setIsDeletingItem] = useState(false);

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    try {
      const res = await fetch("/api/library");
      const data = await res.json();
      if (data.success) {
        setAssignments(data.assignments);
        setLessonPlans(data.lessonPlans);
        setRubrics(data.rubrics);
        setConcepts(data.concepts);
      }
    } catch (error) {
      console.error("Failed to fetch library", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeAssignment = useAssignmentsStore(state => state.removeAssignment);

  const handleAssignmentDelete = async (id: string) => {
    setIsDeletingItem(true);
    try {
      const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAssignments(prev => prev.filter(a => a._id !== id));
        removeAssignment(id);
        toast.success("Assignment deleted");
        setItemToDelete(null);
      } else {
        toast.error("Failed to delete assignment");
      }
    } catch (e) {
      toast.error("Failed to delete assignment");
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleDelete = async (id: string, type: "lesson" | "rubric" | "concept") => {
    setIsDeletingItem(true);
    const endpointMap = {
      lesson: "/api/toolkit/lesson-plan",
      rubric: "/api/toolkit/rubric-creator",
      concept: "/api/toolkit/concept-simplifier"
    };

    try {
      const res = await fetch(`${endpointMap[type]}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (type === "lesson") setLessonPlans(prev => prev.filter(item => item._id !== id));
        if (type === "rubric") setRubrics(prev => prev.filter(item => item._id !== id));
        if (type === "concept") setConcepts(prev => prev.filter(item => item._id !== id));
        
        toast.success("Item deleted");
        setItemToDelete(null);
        if (selectedDoc?._id === id) {
          setSelectedDoc(null);
          setSelectedDocType(null);
        }
      } else {
        toast.error("Failed to delete item");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsDeletingItem(false);
    }
  };

  const openDoc = (doc: any, type: "lesson" | "rubric" | "concept") => {
    setSelectedDoc(doc);
    setSelectedDocType(type);
  };

  const closeDoc = () => {
    setSelectedDoc(null);
    setSelectedDocType(null);
  };

  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900">
      <Sidebar />
      <MobileHeader />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex-1 px-5 pt-28 pb-32 md:p-10 lg:p-12 overflow-y-auto relative flex flex-col">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
            
            {/* Header */}
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3 flex items-center gap-3">
                <div className="bg-[#18181B] p-2 rounded-xl">
                  <BookMarked className="w-8 h-8 text-white" />
                </div>
                My Library
              </h1>
              <p className="text-base md:text-lg font-medium text-gray-500 max-w-2xl leading-relaxed">
                Access your saved exam papers and toolkit assets in one centralized dashboard.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl w-fit shadow-sm border border-gray-100 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
              <button 
                onClick={() => setActiveTab("papers")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "papers" ? "bg-[#18181B] text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                <FileText className="w-4 h-4" />
                Saved Papers
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs">{assignments.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab("lessons")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "lessons" ? "bg-[#18181B] text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                <BookOpen className="w-4 h-4" />
                Lesson Plans
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs">{lessonPlans.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab("rubrics")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "rubrics" ? "bg-[#18181B] text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                <FileCheck className="w-4 h-4" />
                Rubrics
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs">{rubrics.length}</span>
              </button>
              <button 
                onClick={() => setActiveTab("concepts")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "concepts" ? "bg-[#18181B] text-white shadow-md" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}
              >
                <Lightbulb className="w-4 h-4" />
                Concepts
                <span className="ml-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-xs">{concepts.length}</span>
              </button>
            </div>

            {/* Content Area */}
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                {/* Papers View */}
                {activeTab === "papers" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {assignments.length > 0 ? (
                      assignments.map(assignment => (
                        <AssignmentCard
                          key={assignment._id}
                          id={assignment._id}
                          title={assignment.paperContent?.paperTitle || "Untitled Paper"}
                          classLevel={assignment.classLevel}
                          subject={assignment.subject}
                          assignedDate={assignment.createdAt ? format(new Date(assignment.createdAt), 'MMM d, yyyy') : "N/A"}
                          dueDate={assignment.createdAt ? format(new Date(assignment.createdAt), 'MMM d, yyyy') : "N/A"}
                          viewContext="dashboard"
                          onView={(id) => router.push(`/assignments/${id}`)}
                          onDelete={(id) => setItemToDelete({ id, type: "assignment", title: assignment.paperContent?.paperTitle || "Untitled Paper" })}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No papers saved yet</h3>
                        <p className="text-gray-500 font-medium">Generated exam papers will appear here.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Lesson Plans View */}
                {activeTab === "lessons" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {lessonPlans.length > 0 ? (
                      lessonPlans.map(plan => (
                        <div key={plan._id} className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group relative flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                              <BookOpen className="w-3.5 h-3.5" />
                              {plan.subject}
                            </div>
                            <button 
                              onClick={() => setItemToDelete({ id: plan._id, type: "lesson", title: plan.topic })}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                            {plan.topic}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium mt-auto pt-6">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(plan.createdAt), 'MMM d, yyyy')}
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{plan.grade}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => openDoc(plan, "lesson")}
                            className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-xl transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Plan
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No lesson plans saved</h3>
                      </div>
                    )}
                  </div>
                )}

                {/* Rubrics View */}
                {activeTab === "rubrics" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {rubrics.length > 0 ? (
                      rubrics.map(rubric => (
                        <div key={rubric._id} className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group relative flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                              <FileCheck className="w-3.5 h-3.5" />
                              {rubric.subject}
                            </div>
                            <button 
                              onClick={() => setItemToDelete({ id: rubric._id, type: "rubric", title: rubric.assignmentTitle })}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                            {rubric.assignmentTitle}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium mt-auto pt-6">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(rubric.createdAt), 'MMM d, yyyy')}
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{rubric.gradeLevel}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => openDoc(rubric, "rubric")}
                            className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-xl transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Rubric
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <FileCheck className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No rubrics saved</h3>
                      </div>
                    )}
                  </div>
                )}

                {/* Concepts View */}
                {activeTab === "concepts" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {concepts.length > 0 ? (
                      concepts.map(concept => (
                        <div key={concept._id} className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group relative flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                              <Lightbulb className="w-3.5 h-3.5" />
                              {concept.subject}
                            </div>
                            <button 
                              onClick={() => setItemToDelete({ id: concept._id, type: "concept", title: concept.concept })}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-yellow-600 transition-colors">
                            {concept.concept}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium mt-auto pt-6">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(concept.createdAt), 'MMM d, yyyy')}
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{concept.gradeLevel}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => openDoc(concept, "concept")}
                            className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-xl transition-colors text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            View Concept
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                        <Lightbulb className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No concepts saved</h3>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isDeletingItem && setItemToDelete(null)} />
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl relative z-10 flex flex-col overflow-hidden p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete {itemToDelete.type === 'lesson' ? 'Lesson Plan' : itemToDelete.type === 'rubric' ? 'Rubric' : itemToDelete.type === 'concept' ? 'Concept' : 'Saved Paper'}</h3>
            <p className="text-gray-500 mb-6 font-medium">
              Are you sure you want to delete <span className="font-bold text-gray-700">"{itemToDelete.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setItemToDelete(null)}
                disabled={isDeletingItem}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (itemToDelete.type === "assignment") {
                    handleAssignmentDelete(itemToDelete.id);
                  } else {
                    handleDelete(itemToDelete.id, itemToDelete.type);
                  }
                }}
                disabled={isDeletingItem}
                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 disabled:opacity-70 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isDeletingItem ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isDeletingItem ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Document View Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-12 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDoc} />
          <div className="bg-white w-full max-w-5xl max-h-full rounded-[32px] shadow-2xl relative z-10 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedDocType === 'lesson' ? selectedDoc.topic : selectedDocType === 'rubric' ? selectedDoc.assignmentTitle : selectedDoc.concept}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-2 font-medium">
                  <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-700 shadow-sm">{selectedDoc.subject}</span>
                  <span>•</span>
                  <span>{selectedDoc.gradeLevel || selectedDoc.grade}</span>
                  {selectedDoc.duration && (
                    <>
                      <span>•</span>
                      <span>{selectedDoc.duration}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={closeDoc}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body (Markdown rendering) */}
            <div className="p-8 md:p-12 overflow-y-auto flex-1">
              <div className="prose prose-gray max-w-3xl mx-auto prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 first:prose-h2:mt-0 prose-h2:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 marker:text-gray-400">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm as any]}
                  components={{
                    table: ({node, ...props}) => <div className="overflow-x-auto my-8"><table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm" {...props} /></div>,
                    thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-gray-200" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-gray-50/50 transition-colors" {...props} />,
                    th: ({node, ...props}) => <th className="px-6 py-4 text-left text-sm font-black text-gray-900 tracking-wider border-x border-gray-200 first:border-l-0 last:border-r-0" {...props} />,
                    td: ({node, ...props}) => <td className="px-6 py-4 text-sm text-gray-600 border-x border-gray-200 first:border-l-0 last:border-r-0 align-top" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl md:text-2xl font-black text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100 first:mt-0 flex items-center gap-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-gray-800 mt-6 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-gray-600 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-600" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />
                  }}
                >
                  {selectedDoc.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="print:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
