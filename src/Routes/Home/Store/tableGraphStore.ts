import { AccumulatedData } from "../Model/accumulatedData.model";
import { create } from "zustand";

interface TableGraphStore {
  accData: AccumulatedData | null;
  setAccData: (accData: AccumulatedData) => void;
}

const useTableGraphStore = create<TableGraphStore>((set) => ({
  accData: null,
  setAccData: (accData) => {
    set({ accData });
  },
}));

export default useTableGraphStore;
