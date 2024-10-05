import {create} from "zustand";
import {Device} from "../Model/Device.model";

interface SettingStore {
  setting: Device[],
  setSetting: (setting: Device[]) => void,
}

export const useSettingStore = create<SettingStore>((set) => ({
  setting: [],
  setSetting: (setting) => {
    set({setting})
  },
}));