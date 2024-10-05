import { Sensor } from "../../Routes/Home/Model/Sensor.model";
import { Controller } from "../../Routes/Home/Model/Controller.model";
import { TempTableAndGraph } from "../../Routes/Home/Model/tempTableAndGraph.model";

export interface DataList {
  data: TempTableAndGraph;
  status: boolean;
}
