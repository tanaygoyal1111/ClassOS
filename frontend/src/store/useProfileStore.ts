import { create } from 'zustand';

interface ProfileStore {
  isEditModalOpen: boolean;
  setIsEditModalOpen: (isOpen: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isEditModalOpen: false,
  setIsEditModalOpen: (isOpen) => set({ isEditModalOpen: isOpen }),
}));
