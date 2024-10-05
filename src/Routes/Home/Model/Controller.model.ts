import {ControllerData} from "./ControllerData.model";

export interface Controller {
  id: number,
  controllerData: ControllerData | null,
  type: string,
}