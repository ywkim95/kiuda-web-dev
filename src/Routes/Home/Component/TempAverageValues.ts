import { TableAndGraph } from "../Model/tableAndGraph.model";
import { AccValue } from "../Model/accValue.model";
import { TempTableAndGraph } from "../Model/tempTableAndGraph.model";

const getTempAverageValues = (tableAndGraph: TempTableAndGraph): number[] => {
  return Array.from({ length: 24 }, (_, i) => {
    let averageData = tableAndGraph[
      `kPa_Avg_${i + 1}` as keyof TempTableAndGraph
    ] as number;
    if (i >= 13) {
      averageData = tableAndGraph[
        `SoilTemp_Avg_${i - 11}` as keyof TempTableAndGraph
      ] as number;
    }

    return averageData === undefined ? 0 : averageData;
  }) as number[];
};

export default getTempAverageValues;
