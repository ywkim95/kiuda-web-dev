import { useCallback } from "react";
import { useSelectedDeviceStore } from "../../../Store/deviceStore";
import { useSensorDeviceListStore } from "../../../Store/sensorDeviceListStore";
import { Device } from "../../../Model/Device.model";

const useChangeDevice = () => {
  const sensorList = useSensorDeviceListStore((state) => state.sensorList);
  const setDevice = useSelectedDeviceStore((state) => state.setDevice);
  const changeDevice = useCallback(
    (id: number) => {
      if (sensorList) {
        const device = sensorList.find((value: Device) => id === value.id);
        if (device) {
          setDevice(device);
        } else {
          console.log("해당하는 센서가 없습니다.");
        }
      }
    },
    [sensorList, setDevice]
  );
  return changeDevice;
};

export default useChangeDevice;
