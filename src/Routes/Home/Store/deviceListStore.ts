import {Device} from "../../../Common/Model/Device.model";
import {create} from "zustand";

interface DeviceListStore {
  deviceList: Device[] | null,
  setDeviceList: (deviceList: (Device[] | null)) => void,
}

export const useDeviceListStore = create<DeviceListStore>((set) => ({
  deviceList: null,
  setDeviceList: (deviceList) => {
    set({deviceList})
  },
}));