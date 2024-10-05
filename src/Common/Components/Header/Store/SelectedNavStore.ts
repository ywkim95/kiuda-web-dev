import {create} from "zustand";

interface SelectedNavStore {
  selectedNav: number;
  setSelectedNav: (selectedNav: number) => void;
}

const useSelectedNavStore = create<SelectedNavStore>((set) => ({
  selectedNav: 0,
  setSelectedNav: (selectedNav: number) => set({selectedNav}),
}));

export default useSelectedNavStore;