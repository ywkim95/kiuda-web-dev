import { TableAndGraph } from "../Model/tableAndGraph.model";
import { AccValue } from "../Model/accValue.model";

const getAverageValues = (tableAndGraph: TableAndGraph): number[] => {
  return Array.from({ length: 20 }, (_, i) => {
    const averageData = tableAndGraph[
      `s${i + 1}` as keyof TableAndGraph
    ] as AccValue;
    return averageData ? averageData.average : 0;
  }) as number[];
};

export default getAverageValues;
