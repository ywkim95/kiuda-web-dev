import { Irradiance } from "./irradiance.model";
import { TableAndGraph } from "./tableAndGraph.model";

export interface AccumulatedData {
  irradiance: Irradiance;
  tableAndGraph: TableAndGraph[];
}
