"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AssignmentCard } from "@/components/AssignmentCard";
import { useAssignmentsStore } from "@/store/useAssignmentsStore";
import { useFormStore } from "@/store/useFormStore";
import { Group } from "@/store/useGroupsStore";
import { ArrowLeft, Loader2, PackageOpen, Folder } from "lucide-react";
import { toast } from "sonner";

export default function GroupDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const deleteAssignment = useAssignmentsStore(state => state.deleteAssignment);
  const setGeneratedPaper = useFormStore(state => state.setGeneratedPaper);
  const updateBasicInfo = useFormStore(state => state.updateBasicInfo);

  useEffect(() => {
    if (!groupId) return;

    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch group details
        const groupRes = await fetch(`/api/groups/${groupId}`);
        const groupData = await groupRes.json();
        
        if (!groupData.success) {
          toast.error("Group not found");
          router.push("/groups");
          return;
        }
        setGroup(groupData.data);

        // Fetch linked assignments
        const assignmentsRes = await fetch(`/api/assignments?groupId=${groupId}`);
        const assignmentsData = await assignmentsRes.json();
        
        if (assignmentsData.success) {
          setAssignments(assignmentsData.data);
        }
      } catch (error) {
        console.error("Failed to fetch group details:", error);
        toast.error("Failed to load group");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [groupId, router]);

  const handleView = (id: string) => {
    const assignment = assignments.find(a => a._id === id);
    if (assignment) {
      setGeneratedPaper(assignment.paperContent);
      if (assignment.basicInfoSnapshot) {
        Object.keys(assignment.basicInfoSnapshot).forEach(key => {
          updateBasicInfo(key, assignment.basicInfoSnapshot[key]);
        });
      }
      router.push(`/assignments/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAssignment(id);
    if (success) {
      toast.success('Assignment deleted successfully');
      setAssignments(prev => prev.filter(a => a._id !== id));
    } else {
      toast.error('Failed to delete assignment');
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900 relative">
      <Sidebar />
      <MobileHeader />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex-1 px-5 pt-28 pb-32 md:p-8 overflow-y-auto relative flex flex-col">
          <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
            
            {/* Header Area */}
            <div className="mb-8 shrink-0 flex items-start gap-4">
              <button 
                onClick={() => router.push("/groups")}
                className="mt-1 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center shrink-0 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex-1">
                {isLoading ? (
                  <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                ) : (
                  <>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                      {group?.name}
                    </h1>
                    {group?.description && (
                      <p className="text-sm font-medium text-gray-500 mt-2 max-w-2xl leading-relaxed">
                        {group.description}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : assignments.length === 0 ? (
                /* Empty State */
                <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Folder className="w-10 h-10 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">No assignments yet</h2>
                  <p className="text-gray-500 text-[15px] font-medium max-w-sm mt-3 mb-8 leading-relaxed">
                    You haven't linked any papers to this group yet. Head over to the Assignments tab to create one.
                  </p>
                  <button
                    onClick={() => router.push("/assignments/create")}
                    className="bg-[#18181B] hover:bg-black text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95"
                  >
                    Create Assignment
                  </button>
                </div>
              ) : (
                /* Grid State */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 animate-in fade-in duration-500 pb-20">
                  {assignments.map((assignment) => {
                    // Extract data based on how Assignment model saves it
                    const dDate = new Date(assignment.createdAt);
                    const assignedDateStr = isNaN(dDate.getTime()) ? "Unknown" : `${dDate.getDate()}-${dDate.getMonth() + 1}-${dDate.getFullYear()}`;
                    
                    return (
                      <AssignmentCard 
                        key={assignment._id}
                        id={assignment._id}
                        title={assignment.title}
                        classLevel={assignment.classLevel}
                        subject={assignment.subject}
                        assignedDate={assignedDateStr}
                        dueDate={assignment.dueDate || "N/A"}
                        groupId={assignment.groupId}
                        viewContext="group"
                        onView={handleView}
                        onDelete={handleDelete}
                        onRemoveFromGroup={(removedId) => setAssignments(prev => prev.filter(a => a._id !== removedId))}
                      />
                    );
                  })}
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
