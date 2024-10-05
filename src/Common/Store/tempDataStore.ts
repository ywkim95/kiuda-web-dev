import { create } from "zustand";
import { DataList } from "../Model/DataList.model";

interface DataState {
  tempData: DataList | null;
}

interface DataAction {
  setTempData: (data: DataList) => void;
  remove: () => void;
}

export const useTempDataStore = create<DataState & DataAction>((set) => ({
  tempData: null,
  setTempData: (tempData: DataList) => {
    set({ tempData });
  },
  remove: () => {
    set({ tempData: null });
  },
}));
