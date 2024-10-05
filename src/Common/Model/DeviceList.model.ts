import { Sensor } from "../../Routes/Home/Model/Sensor.model";
import { Controller } from "../../Routes/Home/Model/Controller.model";

export interface DeviceList {
  deviceList: (Sensor | Controller)[] | null;
  status: boolean;
}
