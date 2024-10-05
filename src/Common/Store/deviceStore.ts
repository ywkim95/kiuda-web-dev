import { create } from "zustand";
import { Device } from "../Model/Device.model";

interface DeviceStore {
  device: Device | null;
  setDevice: (device: Device | null) => void;
}

export const useSelectedDeviceStore = create<DeviceStore>((set) => ({
  device: null,
  setDevice: (device) => {
    set({ device });
  },
}));
