import {create} from "zustand";

export interface selectedSensor {
  name: string;
  index: number;
}

interface SelectedSensorStore {
  selectedSensor: selectedSensor | null;
  setSelectedSensor: (selectedSensor: selectedSensor) => void;
}

const useSelectedSensorStore = create<SelectedSensorStore>((set) => ({
  selectedSensor: null,
  setSelectedSensor: (selectedSensor) => {
    set({selectedSensor})
  },
}));

export default useSelectedSensorStore;