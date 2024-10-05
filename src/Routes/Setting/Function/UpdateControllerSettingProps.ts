import cloneDeep from "lodash/cloneDeep";
import { useSettingStore } from "../../../Common/Store/settingStore";

interface UpdateControllerSettingProps {
  deviceId: number;
  controllerId: number;
  useCustomValueId: number;
  newValue: number;
  settingType: "value" | "deviation";
}

//제어값/편차 업데이트 로직 - 20240205
const updateControllerSetting = ({
  deviceId,
  controllerId,
  useCustomValueId,
  newValue,
  settingType,
}: UpdateControllerSettingProps) => {
  const { setting, setSetting } = useSettingStore.getState();
  const newSetting = cloneDeep(setting);
  const device = newSetting.find((value) => value.id === deviceId);
  if (device) {
    const controller = device.controllers?.find(
      (value) => value.id === controllerId
    );
    if (controller) {
      const customValue = controller.userCustomValues?.find(
        (value) => value.id === useCustomValueId
      );
      if (customValue) {
        if (settingType === "value") {
          customValue.manualValue = newValue;
        } else {
          customValue.gab = newValue;
        }
      }
    }
  }
  setSetting(newSetting);
};

export default updateControllerSetting;
