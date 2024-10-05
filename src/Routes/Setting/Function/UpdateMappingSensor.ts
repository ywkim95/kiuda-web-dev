import cloneDeep from "lodash/cloneDeep";
import {useSettingStore} from "../../../Common/Store/settingStore";

interface UpdateMappingSensorProps {
  deviceId: number;
  controllerId: number;
  newMappingSensorId: number;
}

//기준센서 업데이트 로직 - 20240205
const updatedMappingSensor = ({deviceId, controllerId, newMappingSensorId}: UpdateMappingSensorProps) => {
  const {setting, setSetting} = useSettingStore.getState();
  const deepCopySetting = cloneDeep(setting);
  
  const device = deepCopySetting.find(value => value.id === deviceId);
  if (device) {
    const controller = device.controllers?.find(value => value.id === controllerId);
    if (controller) {
      controller.mappingSensorId = newMappingSensorId;
    }
  }
  setSetting(deepCopySetting);
};

export default updatedMappingSensor;