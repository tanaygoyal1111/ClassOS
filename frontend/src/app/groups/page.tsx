"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { MobileHeader } from "@/components/MobileHeader";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { EditProfileModal } from "@/components/EditProfileModal";
import { NewGroupModal } from "@/components/NewGroupModal";
import { useGroupsStore, Group } from "@/store/useGroupsStore";
import { Loader2, Folder, Plus, Users, BookOpen, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const GroupCard = ({ group }: { group: Group }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteGroup = useGroupsStore(state => state.deleteGroup);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    setIsDeleting(true);
    
    // Add a small delay for smoother UX
    await new Promise(r => setTimeout(r, 400));
    
    const success = await deleteGroup(group._id);
    if (success) {
      toast.success("Deleted successfully");
    } else {
      toast.error("Failed to delete group");
      setIsDeleting(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center justify-center min-h-[160px] animate-pulse">
        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <Link href={`/groups/${group._id}`} className="block">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer flex flex-col h-full relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <Folder className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="relative">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDropdown(!showDropdown); }}
              className="p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
            >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDropdown(false); }}></div>
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={(e) => { e.preventDefault(); handleDelete(e); }}
                  className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
        {group.name}
      </h3>
      
      {group.description && (
        <p className="text-sm font-medium text-gray-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {group.description}
        </p>
      )}

      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-600">{group.students?.length || 0} Students</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-600">{group.assignmentCount || 0} Papers</span>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default function GroupsPage() {
  const { status } = useSession();
  const { groups, isLoading, error, fetchGroups } = useGroupsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      fetchGroups();
    }
  }, [status, fetchGroups]);

  return (
    <div className="h-screen w-full flex bg-[#F4F5F7] overflow-hidden font-sans text-gray-900 relative">
      <EditProfileModal />
      <NewGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <Sidebar />
      <MobileHeader />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex-1 px-5 pt-28 pb-32 md:p-8 overflow-y-auto relative flex flex-col">
          <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shrink-0">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                  <Folder className="w-8 h-8 text-blue-500" />
                  My Groups
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-2">Manage your classes and linked assignments</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#18181B] hover:bg-black text-white px-6 py-3 rounded-full font-semibold text-sm transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2 w-full md:w-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Create Group</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : groups.length === 0 ? (
                /* Empty State */
                <div className="flex-1 bg-white border border-gray-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
                  <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse opacity-60"></div>
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md border border-gray-100 flex items-center justify-center z-10 relative">
                      <Users className="w-8 h-8 text-blue-500" />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
                        <Plus className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">No groups created yet</h2>
                  <p className="text-gray-500 text-[15px] font-medium max-w-sm mt-3 mb-8 leading-relaxed">
                    Create a group to organize your students into classes or batches. You can assign papers directly to them.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Group
                  </button>
                </div>
              ) : (
                /* Filled State Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-500 pb-20">
                  {groups.map((group) => (
                    <GroupCard key={group._id} group={group} />
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
