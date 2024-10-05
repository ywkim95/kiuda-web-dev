import {SensorData} from "./SensorData.model";

export interface Sensor {
  id: number,
  sensorData: SensorData | null,
  type: string,
}