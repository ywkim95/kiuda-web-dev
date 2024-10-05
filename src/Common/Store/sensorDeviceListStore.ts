import {create} from "zustand";
import {Device} from "../Model/Device.model";

interface SensorDeviceListStore {
  sensorList: Device[] | null,
  setSensorList: (sensorList: (Device[] | null)) => void,
}

export const useSensorDeviceListStore = create<SensorDeviceListStore>((set) => ({
  sensorList: null,
  setSensorList: (sensorList) => {
    set({sensorList})
  },
}));