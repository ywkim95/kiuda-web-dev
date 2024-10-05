import {SensorSpec} from "./SensorSpec.model";

export interface SensorDevice {
  id: number,
  name: string,
  correctionValue: number,
  customStableStart: number,
  customStableEnd: number,
  spec: SensorSpec | null,
}