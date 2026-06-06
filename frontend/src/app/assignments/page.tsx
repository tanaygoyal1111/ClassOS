"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { EmptyState } from "@/components/EmptyState";
import { FilledState } from "@/components/FilledState";
import { useAssignmentsStore } from "@/store/useAssignmentsStore";
import { Loader2 } from "lucide-react";

export default function AssignmentsPage() {
  const { status } = useSession();
  const assignments = useAssignmentsStore((state) => state.assignments);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900">
      <Sidebar />
      <MobileHeader />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex-1 px-5 pt-28 pb-32 md:p-8 overflow-y-auto relative flex flex-col">
          {!mounted || status === "loading" ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : assignments.length === 0 ? (
            <EmptyState />
          ) : (
            <FilledState assignments={assignments} />
          )}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
