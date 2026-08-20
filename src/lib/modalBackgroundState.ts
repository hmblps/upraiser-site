import { create } from "zustand";

interface ModalBackgroundState {
  isOpen: boolean;
  openModalBg: () => void;
  closeModalBg: () => void;
}

export const useModalBackground = create<ModalBackgroundState>((set) => ({
  isOpen: false,
  openModalBg: () => set({ isOpen: true }),
  closeModalBg: () => set({ isOpen: false }),
}));
