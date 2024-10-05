import {Device} from "../../../Common/Model/Device.model";

export interface ControllerData {
  id: number,
  gpio1: string | null,
  gpio2: string | null,
  rssi: number,
  sqn: number,
  device: Device | null,
}