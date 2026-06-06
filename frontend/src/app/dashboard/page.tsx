"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FileText, Users, Clock, ChevronRight, Plus } from "lucide-react";
import { useAssignmentsStore } from "@/store/useAssignmentsStore";

export default function HomePage() {
  const { data: session, status } = useSession();
  const assignments = useAssignmentsStore((state) => state.assignments);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Derived Stats
  const totalPapers = assignments.length;
  // Mock calculation: Let's assume each paper saves 45 mins. 45 mins = 0.75 hours.
  const hoursSaved = Math.round(totalPapers * 0.75);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const firstName = session?.user?.name ? session.user.name.split(" ")[0] : "Educator";

  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900">
      <Sidebar />
      <MobileHeader />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex-1 px-5 pt-28 pb-32 md:p-8 overflow-y-auto relative flex flex-col">
          <div className="max-w-5xl mx-auto w-full">
            
            {/* 1. Greeting Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  Welcome back, {firstName} 👋
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-1">{currentDate}</p>
              </div>
              <Link
                href="/assignments/create"
                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-full font-semibold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 w-full md:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </Link>
            </div>

            {/* 2. Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8">
              {/* Card 1: Total Papers */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-[#FF5A36]" />
                </div>
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-gray-500">Total Papers Generated</p>
                  <div className="flex items-end gap-2 mt-1">
                    {!mounted ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900 tracking-tight">{totalPapers}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Active Groups */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                <div className="absolute top-6 right-6 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Coming Soon
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 opacity-50">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="mt-auto opacity-50">
                  <p className="text-sm font-semibold text-gray-500">Active Groups</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">0</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Time Saved */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-gray-500">Time Saved with AI</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    {!mounted ? (
                      <div className="h-8 w-16 bg-gray-200 animate-pulse rounded-md"></div>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">{hoursSaved}</span>
                        <span className="text-sm font-semibold text-gray-500 mb-1">Hours</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Recent Activity */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Recent Assignments</h2>
              
              {!mounted ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white h-20 rounded-2xl border border-gray-100 animate-pulse"></div>
                  ))}
                </div>
              ) : assignments.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No assignments yet</h3>
                  <p className="text-gray-500 text-sm font-medium max-w-sm mt-2 mb-6">
                    You haven't created any assignments yet. Generate your first AI-powered question paper in seconds.
                  </p>
                  <Link
                    href="/assignments/create"
                    className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm"
                  >
                    Create Assignment
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.slice(0, 3).map((assignment) => (
                    <Link
                      key={assignment.id}
                      href={`/assignments/${assignment.id}`}
                      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-[#FF5A36]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-base font-bold text-gray-900 truncate pr-4">
                            {assignment.title || "Untitled Assignment"}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs font-medium text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">{assignment.subject || "Subject"}</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">{assignment.classLevel || "Class"}</span>
                            <span className="hidden sm:inline-block text-gray-400">•</span>
                            <span className="hidden sm:inline-block">
                              Generated on {assignment.assignedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center shrink-0 transition-colors">
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
