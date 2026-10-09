import { create } from "zustand";

interface EnvironmentState {
  snowEnabled: boolean;
  setSnowEnabled: (enabled: boolean) => void;
}

export const useEnvironment = create<EnvironmentState>((set) => ({
  snowEnabled: true,
  setSnowEnabled: (enabled) => set({ snowEnabled: enabled }),
}));
