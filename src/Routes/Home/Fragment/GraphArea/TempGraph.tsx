import React, {useCallback, useMemo} from 'react';
import {Line} from "react-chartjs-2";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement
} from "chart.js";
import moment from "moment";
import 'react-datepicker/dist/react-datepicker.css';
import {SearchProps} from "../../Component/Search/interface/SearchProps.interface";
import {onChangeEndTime, onChangeStartTime} from "../../Component/Search/onChangeTimes";
import TimeSearch from "../../Component/Search/TimeSearch";
import getTempAverageValues from "../../Component/TempAverageValues";
import useTempTableGraphStore from "../../Store/tempTableGraphStore";
import useSelectedSensorStore from "../../Store/selectedSensorStore";

Chart.register(
  BarElement,
  BarController,
  LinearScale,
  CategoryScale,
  PointElement,
  LineController,
  LineElement,
  Filler
);


const TempGraph = ({
                 startDate,
                 endDate,
                 setStartDate,
                 setEndDate,
                 onClick,
               }: SearchProps) => {
  const accData = useTempTableGraphStore(state => state.accTempData);
  const selectedSensor = useSelectedSensorStore(state => state.selectedSensor);
  
  const [label, calcData] = useMemo(() => {
    if (accData === null || selectedSensor?.index === null || selectedSensor === null) {
      return [[], []];
    }
    
    const labelArr: string[] = [];
    const dataArr: number[] = [];
    accData.tableAndGraph.forEach((data) => {
      const averages = getTempAverageValues(data);
      if (averages && selectedSensor.index !== undefined && averages[selectedSensor.index] !== undefined) {
        dataArr.push(averages[selectedSensor.index]);
        const date = moment(data.createdAt).format('HH:mm');
        labelArr.push(date.toString());
      }
    });
    return [labelArr, dataArr];
  }, [accData, selectedSensor]);
  
  
  const data: ChartData<"line", number[], string> = {
    labels: label,
    datasets: [
      {
        type: "line",
        label: "Dataset 1",
        borderColor: "#749D5F",
        borderWidth: 1,
        showLine: false,
        pointStyle: false,
        data: calcData,
        fill: true,
        backgroundColor: 'rgba(116,157,95,0.6)',
        tension: 0.1
      }
    ]
  };
  const options: ChartOptions<'line'> = {
    animation: false,
    responsive: true,
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        axis: "x",
        beginAtZero: true,
        // drawOnChartArea: false,
        
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 13,
        },
      },
      y: {
        axis: "y",
        beginAtZero: true,
        afterDataLimits: (scale) => {
          scale.max = scale.max * 1.1;
        },
      },
    },
  }
  const onChangeStart = useCallback((date: Date) => {
    onChangeStartTime(date, setStartDate);
  }, [setStartDate]);
  
  const onChangeEnd = useCallback((date: Date) => {
    onChangeEndTime(date, setEndDate);
  }, [setEndDate]);
  
  const onClickSearch = useCallback(() => {
    onClick();
  }, [onClick]);
  
  return (
    <div className="graph">
      <div className="graph__header">
        <div className="graph__title">{selectedSensor?.name}</div>
        <div className="graph__search">
          <div className="graph-search__search">
            <div className="graph-search__search--wrap">
              <TimeSearch htmlId="startTimeForGraph" onChange={onChangeStart} selected={startDate}/>
              {/*<input type="time" className="table-search__search--time" value="09:00" id="startTimeForGraph"/>*/}
              <label htmlFor="startTimeForGraph">
                <div className="table-search__search--iconBox">
                  <img src="/assets/icon/monitoring/ic_clock.png" className="timeIconBoxImg" alt="시계 이미지"/>
                </div>
              </label>
            </div>
            <span> ~ </span>
            <div className="graph-search__search--wrap">
              <TimeSearch htmlId="endTimeForGraph" onChange={onChangeEnd} selected={endDate}/>
              <label htmlFor="endTimeForGraph">
                <div className="table-search__search--iconBox">
                  <img src="/assets/icon/monitoring/ic_clock.png" className="timeIconBoxImg" alt="시계 이미지"/>
                </div>
              </label>
            </div>
          </div>
          <button className="graph__search-button" onClick={onClickSearch}>조회</button>
        </div>
      </div>
      <div className="graph__body">
        {
          accData?.tableAndGraph.length !== 0 || accData === null ?
            <div className="w-full">
              <Line data={data} options={options} height={95}/>
            </div> :
            <div className="graph__chart">
              <div className="graph__chart--empty">
                <div className="graph__chart--empty-text">데이터가 없습니다.</div>
              </div>
            </div>
        }
      </div>
    </div>
  );
};

export default TempGraph;
