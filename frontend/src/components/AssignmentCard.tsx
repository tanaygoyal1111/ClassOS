'use client';
import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Folder, X } from 'lucide-react';
import { useGroupsStore } from '@/store/useGroupsStore';
import { useAssignmentsStore } from '@/store/useAssignmentsStore';
import { toast } from 'sonner';

interface AssignmentCardProps {
  id: string;
  title: string;
  classLevel: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  groupId?: string | null;
  viewContext?: 'dashboard' | 'group';
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onRemoveFromGroup?: (id: string) => void;
}

export const AssignmentCard = ({ 
  id, 
  title, 
  classLevel, 
  subject, 
  assignedDate, 
  dueDate, 
  groupId,
  viewContext = 'dashboard',
  onView, 
  onDelete,
  onRemoveFromGroup 
}: AssignmentCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const { groups } = useGroupsStore();
  const updateAssignmentGroupId = useAssignmentsStore(state => state.updateAssignmentGroupId);

  const matchedGroup = groups.find(g => g._id === groupId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemoveFromGroup = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    
    const success = await updateAssignmentGroupId(id, null);
    if (success) {
      toast.success('Removed from group');
      if (onRemoveFromGroup) onRemoveFromGroup(id);
    } else {
      toast.error('Failed to remove from group');
    }
  };

  const handleAssignSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedGroupId) return;
    
    const success = await updateAssignmentGroupId(id, selectedGroupId);
    if (success) {
      toast.success('Assigned to group successfully');
      setIsModalOpen(false);
    } else {
      toast.error('Failed to assign group');
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    const link = `${window.location.origin}/paper/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Share link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <>
      <div className="bg-white rounded-[2rem] p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between min-h-[160px] relative transition-transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-[19px] text-gray-900 tracking-tight">{title}</h3>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
              className="text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 top-10 bg-white/95 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-2xl py-2 w-[180px] z-50 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onView(id); }}
                  className="w-full text-left px-5 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Assignment
                </button>
                
                <button 
                  onClick={handleCopyLink}
                  className="w-full text-left px-5 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Copy Share Link
                </button>
                
                {viewContext === 'dashboard' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); setIsModalOpen(true); }}
                    className="w-full text-left px-5 py-2.5 text-sm text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Assign to Group
                  </button>
                )}

                {viewContext === 'group' && (
                  <button 
                    onClick={handleRemoveFromGroup}
                    className="w-full text-left px-5 py-2.5 text-sm text-orange-600 font-semibold hover:bg-orange-50 transition-colors"
                  >
                    Remove from Group
                  </button>
                )}

                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); onDelete(id); }}
                  className="w-full text-left px-5 py-2.5 text-sm text-red-500 font-semibold hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-auto flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-bold bg-gray-100/80 text-gray-600 px-3 py-1.5 rounded-lg shadow-sm border border-gray-200/50">
            {classLevel} • {subject}
          </span>
          {matchedGroup && (
            <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg shadow-sm border border-blue-100/50 flex items-center gap-1.5">
              <Folder className="w-3 h-3" />
              {matchedGroup.name}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center text-[13px] font-semibold text-gray-500 mt-8">
          <span className="text-gray-800">Assigned on : <span className="text-gray-500 font-medium">{assignedDate}</span></span>
          <span className="text-gray-800">Due : <span className="text-gray-500 font-medium">{dueDate}</span></span>
        </div>
      </div>

      {/* Assign Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}>
          <div 
            className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Assign to Group</h2>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">Select a Group</label>
              <div className="relative">
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Choose a group...</option>
                  {groups.map(group => (
                    <option key={group._id} value={group._id}>{group.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignSubmit}
                disabled={!selectedGroupId}
                className="flex-1 py-3 px-4 bg-[#18181B] hover:bg-black text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
