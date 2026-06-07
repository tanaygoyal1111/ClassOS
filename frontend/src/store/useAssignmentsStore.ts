import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedAssignment {
  id: string;
  title: string;
  classLevel: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  paperData: any; // The complete generated assignment JSON
  basicInfoSnapshot?: any; // Snapshot of the institution name, etc.
  groupId?: string | null;
}

interface AssignmentsState {
  assignments: SavedAssignment[];
  addAssignment: (assignment: SavedAssignment) => void;
  removeAssignment: (id: string) => void;
  deleteAssignment: (id: string) => Promise<boolean>;
  updateAssignmentGroupId: (id: string, groupId: string | null) => Promise<boolean>;
}

export const useAssignmentsStore = create<AssignmentsState>()(
  persist(
    (set) => ({
      assignments: [],
      addAssignment: (assignment) => set((state) => ({ 
        assignments: [assignment, ...state.assignments] 
      })),
      removeAssignment: (id) => set((state) => ({ 
        assignments: state.assignments.filter(a => a.id !== id && (a as any)._id !== id) 
      })),
      deleteAssignment: async (id) => {
        try {
          const response = await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
          const data = await response.json();
          if (data.success) {
            set((state) => ({ assignments: state.assignments.filter(a => a.id !== id && (a as any)._id !== id) }));
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to delete assignment', error);
          return false;
        }
      },
      updateAssignmentGroupId: async (id, groupId) => {
        try {
          const response = await fetch(`/api/assignments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ groupId })
          });
          const data = await response.json();
          if (data.success) {
            set((state) => ({
              assignments: state.assignments.map(a => (a.id === id || (a as any)._id === id) ? { ...a, groupId } : a)
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to update assignment group', error);
          return false;
        }
      },
    }),
    {
      name: 'classos-assignments-storage',
    }
  )
);
