import {ControllerDevice} from "./ControllerDevice.model";
import {SensorDevice} from "./SensorDevice.model";
import {Gateway} from "./Gateway.model";
import {ClassifyEnum} from "../../Routes/Setting/Const/Classify.enum";

export interface Device {
  id: number,
  classify: ClassifyEnum,
  clientId: string,
  description: string,
  location: string,
  name: string,
  statusCode: number,
  useYn: boolean,
  controllers: ControllerDevice[] | [] | null,
  sensors: SensorDevice[] | [] | null,
  gateway: Gateway,
}