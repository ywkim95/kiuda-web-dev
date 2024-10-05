import { create } from "zustand";
import { DeviceList } from "../Model/DeviceList.model";

interface DataState {
  data: DeviceList | null;
}

interface DataAction {
  setData: (data: DeviceList) => void;
  remove: () => void;
}

export const useDataStore = create<DataState & DataAction>((set) => ({
  data: null,
  setData: (data: DeviceList) => {
    set({ data: data });
  },
  remove: () => {
    set({ data: null });
  },
}));
