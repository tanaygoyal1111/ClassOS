'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Filter, Search, Plus, ChevronDown, PackageOpen } from 'lucide-react';
import { AssignmentCard } from './AssignmentCard';
import { useRouter } from 'next/navigation';
import { useAssignmentsStore, SavedAssignment } from '@/store/useAssignmentsStore';
import { useFormStore } from '@/store/useFormStore';
import { toast } from 'sonner';

export type Assignment = SavedAssignment;

interface FilledStateProps {
  assignments: Assignment[];
}

interface FilterState {
  classLevel: string[];
  subject: string[];
  status: string[];
}

const INITIAL_FILTERS: FilterState = {
  classLevel: [],
  subject: [],
  status: [],
};

const getAssignmentStatus = (dueDate: string) => {
  const [d, m, y] = dueDate.split('-');
  const due = new Date(Number(y), Number(m) - 1, Number(d));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today ? 'Past Due' : 'Active';
};

export const FilledState = ({ assignments }: FilledStateProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const deleteAssignment = useAssignmentsStore(state => state.deleteAssignment);
  const setGeneratedPaper = useFormStore(state => state.setGeneratedPaper);
  const updateBasicInfo = useFormStore(state => state.updateBasicInfo);

  const [localAssignments, setLocalAssignments] = useState<Assignment[]>(assignments);
  useEffect(() => {
    setLocalAssignments(assignments);
  }, [assignments]);

  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [draftFilters, setDraftFilters] = useState<FilterState>(INITIAL_FILTERS);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When opening dropdown, sync draft with applied
  useEffect(() => {
    if (isFilterOpen) {
      setDraftFilters(appliedFilters);
    }
  }, [isFilterOpen, appliedFilters]);

  const toggleDraftFilter = (category: keyof FilterState, value: string) => {
    setDraftFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      }
      return { ...prev, [category]: [...current, value] };
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setDraftFilters(INITIAL_FILTERS);
    setAppliedFilters(INITIAL_FILTERS);
    setIsFilterOpen(false);
  };

  const handleView = (id: string) => {
    const assignment = localAssignments.find(a => (a as any)._id === id || a.id === id);
    if (assignment) {
      setGeneratedPaper(assignment.paperData);
      if (assignment.basicInfoSnapshot) {
        // Restore basic info to render student fields and institution name correctly
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
      setLocalAssignments(prev => prev.filter(a => (a as any)._id !== id && a.id !== id));
    } else {
      toast.error('Failed to delete assignment');
    }
  };

  const availableClasses = useMemo(() => {
    const classes = assignments.map(a => a.classLevel).filter(Boolean);
    return Array.from(new Set(classes)).sort();
  }, [assignments]);

  const availableSubjects = useMemo(() => {
    const subjects = assignments.map(a => a.subject).filter(Boolean);
    return Array.from(new Set(subjects)).sort();
  }, [assignments]);

  // High-performance filtering using useMemo
  const filteredAssignments = useMemo(() => {
    return localAssignments.filter((assignment) => {
      // 1. Search Query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (!assignment.title.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // 2. Class Filter
      if (appliedFilters.classLevel.length > 0) {
        if (!appliedFilters.classLevel.includes(assignment.classLevel)) {
          return false;
        }
      }

      // 3. Subject Filter
      if (appliedFilters.subject.length > 0) {
        if (!appliedFilters.subject.includes(assignment.subject)) {
          return false;
        }
      }

      // 4. Status Filter
      if (appliedFilters.status.length > 0) {
        const status = getAssignmentStatus(assignment.dueDate);
        if (!appliedFilters.status.includes(status)) {
          return false;
        }
      }

      return true;
    });
  }, [localAssignments, searchQuery, appliedFilters]);

  return (
    <div className="w-full h-full flex flex-col relative animate-in fade-in duration-500">
      
      {/* Mobile Sub-Header (Only visible on mobile) */}
      <div className="md:hidden flex items-center relative mb-4">
        <button className="w-10 h-10 bg-gray-200/50 rounded-full flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">Assignments</h1>
      </div>

      {/* Desktop Top Bar (Only visible on desktop) */}
      <div className="hidden md:block mb-4 shrink-0">
        <div className="flex items-center gap-2.5 mb-1.5 px-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Assignments</h1>
        </div>
        <p className="text-[14px] text-gray-400 mb-2 ml-6 font-medium">Manage and create assignments for your classes.</p>
      </div>
        
      {/* Search & Filter Bar (Responsive Pill) */}
      <div className="mb-6 shrink-0 mt-2 md:mt-4">
        <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-[2rem] flex items-center p-1 px-4 md:px-6 md:py-3.5 shadow-sm mx-0 md:mx-2 relative z-20">
          <div className="relative border-r border-gray-200 pr-3 md:pr-6 h-6 md:h-auto flex items-center" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors"
            >
              <Filter className="w-4 h-4 md:w-4 md:h-4" />
              <span className="hidden md:inline">Filter By</span>
              <span className="md:hidden">Filter</span>
              {(appliedFilters.classLevel.length > 0 || appliedFilters.subject.length > 0 || appliedFilters.status.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-[#FF5A36] absolute top-1 -right-1"></span>
              )}
              <ChevronDown className={`hidden md:block w-3.5 h-3.5 text-gray-400 ml-0.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute top-12 left-0 w-[260px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col z-50"
              >
                <div className="p-5 max-h-[300px] overflow-y-auto">
                  {availableClasses.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Class</h4>
                      <div className="flex flex-col gap-2.5">
                        {availableClasses.map(item => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={draftFilters.classLevel.includes(item)}
                              onChange={() => toggleDraftFilter('classLevel', item)}
                              className="w-4 h-4 rounded border-gray-300 accent-[#18181B] cursor-pointer" 
                            />
                            <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {availableSubjects.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Subject</h4>
                      <div className="flex flex-col gap-2.5">
                        {availableSubjects.map(item => (
                          <label key={item} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={draftFilters.subject.includes(item)}
                              onChange={() => toggleDraftFilter('subject', item)}
                              className="w-4 h-4 rounded border-gray-300 accent-[#18181B] cursor-pointer" 
                            />
                            <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Status</h4>
                    <div className="flex flex-col gap-2.5">
                      {['Active', 'Past Due'].map(item => (
                        <label key={item} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={draftFilters.status.includes(item)}
                            onChange={() => toggleDraftFilter('status', item)}
                            className="w-4 h-4 rounded border-gray-300 accent-[#18181B] cursor-pointer" 
                          />
                          <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-100 p-3 bg-gray-50 flex items-center justify-between shrink-0">
                  <button 
                    onClick={handleResetFilters}
                    className="text-[13px] font-bold text-gray-500 hover:text-gray-900 px-3 py-2 transition-colors"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={handleApplyFilters}
                    className="text-[13px] font-bold bg-[#18181B] hover:bg-black text-white px-5 py-2 rounded-xl transition-all shadow-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 flex items-center gap-2 md:gap-3 pl-3 md:pl-6">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search Name" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-sm font-semibold text-gray-800 placeholder:text-gray-400 py-2.5"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid or Fallback */}
      <div className="flex-1 overflow-y-auto px-0 md:px-2 pb-40">
        {filteredAssignments.length === 0 ? (
          <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200/50 shadow-sm">
              <PackageOpen className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-[17px] font-bold text-gray-900 mb-1">No results found</h3>
            <p className="text-[13px] font-medium text-gray-500 max-w-[260px] text-center">
              We couldn't find any assignments matching your current filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard 
                key={assignment.id}
                id={assignment.id}
                title={assignment.title}
                classLevel={assignment.classLevel}
                subject={assignment.subject}
                assignedDate={assignment.assignedDate}
                dueDate={assignment.dueDate}
                groupId={assignment.groupId}
                viewContext="dashboard"
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Floating Action Button */}
      <div className="hidden md:flex absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F4F5F7] via-[#F4F5F7]/80 to-transparent pointer-events-none items-end justify-center pb-8 z-10">
        <Link 
          href="/assignments/create"
          className="pointer-events-auto bg-[#18181B] hover:bg-black text-white px-8 py-3.5 rounded-full flex items-center gap-2.5 font-semibold shadow-lg transition-transform hover:-translate-y-1 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </Link>
      </div>
    </div>
  );
};
