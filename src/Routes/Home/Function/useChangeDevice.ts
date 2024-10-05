import {useCallback} from "react";
import {useDeviceListStore} from "../Store/deviceListStore";
import {useDeviceStore} from "../Store/deviceStore";
import {useContDeviceStore} from "../Store/contDeviceStore";
import {Device} from "../../../Common/Model/Device.model";

const useChangeDevice = () => {
  const deviceList = useDeviceListStore(state => state.deviceList);
  const setDevice = useDeviceStore(state => state.setDevice);
  const setContDevice = useContDeviceStore(state => state.setContDevice);
  const changeDevice = useCallback((selectedId: number) => {
    
    if (deviceList) {
      const device = deviceList.find((value: Device) => value.id === selectedId);
      
      if (device) {
        setDevice(device);
        const contDevice = deviceList.find((value: Device) => {
          return value.controllers?.find((controller) => controller.connectedDeviceId === device.id);
        });
        if (contDevice) {
          setContDevice(contDevice);
        }
      } else {
        console.log('해당하는 디바이스가 없습니다.');
      }
    }
  }, [deviceList, setDevice]);
  
  return changeDevice;
};


export default useChangeDevice;