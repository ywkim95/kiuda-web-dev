import React, {memo, useCallback, useMemo} from 'react';
import TimeSearch from "../../Component/Search/TimeSearch";
import {SearchProps} from "../../Component/Search/interface/SearchProps.interface";
import {onChangeEndTime, onChangeStartTime} from "../../Component/Search/onChangeTimes";
import moment from "moment";
import useTempTableGraphStore from "../../Store/tempTableGraphStore";
import {useDeviceStore} from "../../Store/deviceStore";
import {TableAndGraph} from "../../Model/tableAndGraph.model";
import {AccValue} from "../../Model/accValue.model";
import { TempTableAndGraph } from '../../Model/tempTableAndGraph.model';

const TempTable = ({
                 startDate,
                 endDate,
                 setStartDate,
                 setEndDate,
                 onClick,
               }: SearchProps) => {
  const accData = useTempTableGraphStore(state => state.accTempData);
  const device = useDeviceStore(state => state.device);
  
  const MemoizedSearch = memo(TimeSearch);

  const calcAvg = (key: string, tableAndGraph: TempTableAndGraph) => {
    let avg = 0;
    for (let i = 1; i <= 12; i++) {
      const sensorKey =`${key}_${i}`;
      const sensorData = tableAndGraph[sensorKey as keyof TempTableAndGraph];
      avg += sensorData as number;
    }
    return (avg/12).toFixed(1);
  };
  
  const fieldsToCheck = Array.from({length: 24}, (_, i) => {
    if(i < 12) return `kPa_Avg_${i + 1}` as (keyof TempTableAndGraph);
    return `SoilTemp_Avg_${i - 11}` as (keyof TempTableAndGraph);
  }) as (keyof TempTableAndGraph)[]
  const fieldsWithNonNullValue = fieldsToCheck.filter(field =>
    accData?.tableAndGraph.some(model => model[field] !== null)
  );
  
  // 해당하는 필드가 null인 경우 '-'로 대체
  const updatedModels = accData?.tableAndGraph.map(model => {
    let updatedModel = {...model};
    fieldsWithNonNullValue.forEach(field => {
      if (model[field] === null) {
        updatedModel = {...updatedModel, [field]: '-'};
      }
    });
    return updatedModel;
  });

  const reversedUpdatedModels = useMemo(() => {
    if (!updatedModels) return [];
    return updatedModels.reverse();
  },[updatedModels]);
  
  const isAccValue = (sensorData: string | AccValue): sensorData is AccValue => {
    // sensorData가 객체이고, average 속성을 가지고 있는지 확인
    return typeof sensorData === 'object' && sensorData !== null && 'average' in sensorData;
  };
  
  const data = useMemo(() => {
    if (!accData) return [];
    
    if (!reversedUpdatedModels) return [];
    
    return reversedUpdatedModels.map((tableAndGraph) => {
      const date = moment(tableAndGraph.createdAt).format('HH:mm');
      const result = [date];
      let kpaAvg = calcAvg('kPa_Avg', tableAndGraph);
      result.push(kpaAvg);
      let SoilTempAvg = calcAvg('SoilTemp_Avg', tableAndGraph);
      result.push(SoilTempAvg);
      return result;
    });
  }, [accData]);

  
  
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
    <div className="table">
      <div className="table__header">
        <div className="table__title">센서 표</div>
        <div className="table__search">
          <div className="table-search__search">
            <div className="table-search__search--wrap">
              <MemoizedSearch htmlId="startTimeForTable" onChange={onChangeStart} selected={startDate}/>
              {/*<input type="time" className="table-search__search--time" value="09:00" id="startTimeForTable"/>*/}
              <label htmlFor="startTimeForTable">
                <div className="table-search__search--iconBox">
                  <img src="/assets/icon/monitoring/ic_clock.png" className="timeIconBoxImg" alt="시계 이미지"/>
                </div>
              </label>
            </div>
            <span> ~ </span>
            <div className="table-search__search--wrap">
              <MemoizedSearch htmlId="endTimeForTable" onChange={onChangeEnd} selected={endDate}/>
              {/*<input type="time" className="table-search__search--time" value="21:00" id="endTimeForTable"/>*/}
              <label htmlFor="endTimeForTable">
                <div className="table-search__search--iconBox">
                  <img src="/assets/icon/monitoring/ic_clock.png" className="timeIconBoxImg" alt="시계 이미지"/>
                </div>
              </label>
            </div>
          </div>
          <button className="table__search-button" onClick={onClickSearch}>조회</button>
        </div>
      </div>
      <div className="table__main">
        <div className="table__info">
          <table className="table__table">
            <thead className="table__table-head">
            <tr className="table__head-line">
              <td className="table__head-time" key="time">측정시간</td>
              {
                Array.from({length: 2}).map((_,i) => {
                  if(i === 0) {
                    return (
                      <td className="table__head-item" key={`kPa_Avg_${i}`}>통합 토양수분장력(kPa)</td>
                    )
                  }
                   else {
                    return (
                      <td className="table__head-item" key={`SoilTemp_Avg_${i}`}>통합 토양온도(℃)</td>
                    )
                   }
                  // return (
                  //   <td className="table__head-item" key={sensor.spec?.id}>{sensor.spec?.name}</td>
                  // )
                })
              }
            </tr>
            </thead>
            <tbody className="table__table-body">
            {
              data.map((list) => {
                return (
                  <tr className="table__body-line" key={list[0].toString()}>
                    {list.map((value, index) => {
                      // console.log('value & index',value, index);
                      return (
                        <td key={value + index}
                            className={index === 0 ? 'table__body-time' : 'table__body-item-time'}>{value}</td>
                      )
                    })}
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TempTable;
