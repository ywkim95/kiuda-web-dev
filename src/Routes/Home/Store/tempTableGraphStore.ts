import { TempAccumulatedData } from "../Model/tempAccumulatedData.model";
import { create } from "zustand";

interface TempTableGraphStore {
  accTempData: TempAccumulatedData | null;
  setTempAccData: (accTempData: TempAccumulatedData) => void;
}

const useTempTableGraphStore = create<TempTableGraphStore>((set) => ({
  accTempData: null,
  setTempAccData: (accTempData) => {
    set({ accTempData });
  },
}));

export default useTempTableGraphStore;
