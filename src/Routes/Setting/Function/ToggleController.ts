import cloneDeep from "lodash/cloneDeep";
import {useSettingStore} from "../../../Common/Store/settingStore";


interface ToggleControllerProps {
  deviceId: number;
  controllerId: number;
  isActive: boolean;
}


//동작 여부 업데이트 로직 - 20240205
const toggleController = ({deviceId, controllerId, isActive}: ToggleControllerProps) => {
  const {setting, setSetting} = useSettingStore.getState();
  const newSetting = cloneDeep(setting);
  const device = newSetting.find(value => value.id === deviceId);
  if (device) {
    const controller = device.controllers?.find(value => value.id === controllerId);
    if (controller) {
      controller.useYn = isActive;
    }
  }
  setSetting(newSetting);
};

export default toggleController;