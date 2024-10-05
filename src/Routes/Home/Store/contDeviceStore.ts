import {Device} from "../../../Common/Model/Device.model";
import {create} from "zustand";

interface ContDeviceStore {
  contDevice: Device | null,
  setContDevice: (device: (Device | null)) => void,
}

export const useContDeviceStore = create<ContDeviceStore>((set) => ({
  contDevice: null,
  setContDevice: (device) => {
    set({contDevice: device})
  },
}));
