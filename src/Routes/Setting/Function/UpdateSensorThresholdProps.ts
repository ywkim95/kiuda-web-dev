import cloneDeep from "lodash/cloneDeep";
import {useSettingStore} from "../../../Common/Store/settingStore";


export interface UpdateSensorThresholdProps {
  deviceId: number;
  sensorId: number;
  thresholdType: 'min' | 'max' | 'cal';
  newValue: number;
}

//최소/최대/보정값 업데이트 로직 - 20240205
const updateSensorThreshold = ({deviceId, sensorId, thresholdType, newValue}: UpdateSensorThresholdProps) => {
  const {setting, setSetting} = useSettingStore.getState();
  const newSetting = cloneDeep(setting);
  const device = newSetting.find(value => value.id === deviceId);
  if (device) {
    const sensor = device.sensors?.find(value => value.id === sensorId);
    if (sensor) {
      switch (thresholdType) {
        case "min":
          sensor.customStableStart = newValue;
          break;
        case "max":
          sensor.customStableEnd = newValue;
          break;
        case "cal":
          sensor.correctionValue = newValue;
          break;
      }
      setSetting(newSetting);
      
    }
  }
};

export default updateSensorThreshold;