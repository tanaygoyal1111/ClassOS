import { create } from 'zustand';

export interface Group {
  _id: string;
  name: string;
  description: string;
  teacherId: string;
  students: any[];
  assignments: string[];
  assignmentCount?: number;
  createdAt?: string;
}

interface GroupsState {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
  deleteGroup: (id: string) => Promise<boolean>;
  updateGroup: (id: string, data: Partial<Group>) => void;
  fetchGroups: () => Promise<void>;
}

export const useGroupsStore = create<GroupsState>()((set) => ({
  groups: [],
  isLoading: true,
  error: null,
  setGroups: (groups) => set({ groups }),
  addGroup: (group) => set((state) => ({ groups: [group, ...state.groups] })),
  removeGroup: (id) => set((state) => ({ groups: state.groups.filter(g => g._id !== id) })),
  updateGroup: (id, data) => set((state) => ({
    groups: state.groups.map(g => g._id === id ? { ...g, ...data } : g)
  })),
  fetchGroups: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/groups');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        set({ groups: data.data, isLoading: false });
      } else {
        set({ error: data.error || 'Failed to fetch groups', isLoading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch groups', isLoading: false });
    }
  },
  deleteGroup: async (id: string) => {
    try {
      const response = await fetch(`/api/groups/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        set((state) => ({ groups: state.groups.filter(g => g._id !== id) }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete group', error);
      return false;
    }
  }
}));
