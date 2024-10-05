import {CustomSettingRange} from "../../Routes/Setting/Model/CustomSettingRange.model";
import {ControllerSpecification} from "./ControllerSpecification.model";
import {UserCustomValue} from "../../Routes/Setting/Model/UserCustomValue.model";

export interface ControllerDevice {
  id: number,
  name: string,
  location: string,
  varName: string,
  mappingSensorId: number,
  connectedDeviceId: number,
  useYn: boolean,
  customSettingRanges: CustomSettingRange[],
  specification: ControllerSpecification,
  userCustomValues: UserCustomValue[],
}