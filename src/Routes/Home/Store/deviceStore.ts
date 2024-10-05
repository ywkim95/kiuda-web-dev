import {Device} from "../../../Common/Model/Device.model";
import {create} from "zustand";

interface DeviceStore {
  device: Device | null,
  setDevice: (device: (Device | null)) => void,
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  device: null,
  setDevice: (device) => {
    set({device})
  },
}));