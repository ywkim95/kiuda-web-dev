import React, { useEffect, useRef, useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TempSensorComponent from "./TempSensorComponent";
import ControllerComponent from "./ControllerComponent";
import { useDeviceStore } from "../../Store/deviceStore";
import { useContDeviceStore } from "../../Store/contDeviceStore";
import { useTempDataStore } from "../../../../Common/Store/tempDataStore";
import { DataList } from "../../../../Common/Model/DataList.model";
import useSelectedSensorStore from "../../Store/selectedSensorStore";
import { TempTableAndGraph } from "../../Model/tempTableAndGraph.model";
import { SensorData } from "../../Model/SensorData.model";
import { ControllerData } from "../../Model/ControllerData.model";
import { useSensorDeviceListStore } from "../../../../Common/Store/sensorDeviceListStore";
import { DeviceList } from "../../../../Common/Model/DeviceList.model";
import SensorComponent from "./SensorComponent";
import { useDataStore } from "../../../../Common/Store/dataStore";

const RealTimeData = ({
  isTemp,
  setIsTemp,
}: {
  isTemp: boolean;
  setIsTemp: (isTemp: boolean) => void;
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const device = useDeviceStore((state) => state.device);
  const contDevice = useContDeviceStore((state) => state.contDevice);
  const tempData = useTempDataStore((state) => state.tempData);
  const tempSensorData = useRef<TempTableAndGraph | null>();
  const data = useDataStore((state) => state.data);
  const sensorData = useRef<SensorData | null>();
  const controllerData = useRef<ControllerData | null>();
  const [sensorValueList, setSensorValue] = useState<(number | null)[]>([]);
  const [tempSensorValueList, setTempSensorValueList] = useState<
    (number | null)[]
  >([]);
  const sensorList = useSensorDeviceListStore((state) => state.sensorList);
  const menuArr = [
    { name: "센서현황", id: 0 },
    { name: "제어기현황", id: 1 },
    { name: "텐시오미터", id: 2 },
  ];
  const tempScrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { selectedSensor, setSelectedSensor } = useSelectedSensorStore(
    (state) => state
  );
  const [convertKeys, setConvertKeys] = useState<string[]>([]);

  // 센서, 제어기에 대한 실시간 데이터를 받는다.
  useEffect(() => {
    if (tempData) {
      const keys = Object.keys(tempData.data)
        .map((key, index) => {
          if (key.startsWith("kPa_Avg")) {
            return `토양수분장력_${index - 2}(kPa)`;
          } else if (key.startsWith("SoilTemp_Avg")) {
            return `토양온도_${index - 14}(℃)`;
          } else {
            return undefined;
          }
        })
        .filter((key) => key !== undefined) as string[];
      setConvertKeys(keys);
      mappingTempValues(tempData);
    }
  }, [tempData]);

  useEffect(() => {
    if (isTemp && convertKeys.length > 0) {
      const name = convertKeys[0];
      setSelectedSensor({
        name,
        index: 0,
      });
    }
  }, [convertKeys]);
  useEffect(() => {
    if (data) {
      mappingValues(data);
    }
  }, [data]);
  useEffect(() => {
    if (device) {
      setSelectedSensor({
        name: `${device?.sensors![0].name}(${device?.sensors![0].spec?.unit})`,
        index: 0,
      });
    }
  }, [device]);

  const onScrollLeft = () => {
    if (tempScrollAreaRef.current) {
      tempScrollAreaRef.current.scrollBy({ left: -605, behavior: "smooth" });
    }

    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollBy({ left: -605, behavior: "smooth" });
    }
  };

  const onScrollRight = () => {
    if (tempScrollAreaRef.current) {
      tempScrollAreaRef.current.scrollBy({ left: 605, behavior: "smooth" });
    }

    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollBy({ left: 605, behavior: "smooth" });
    }
  };

  const mappingTempValues = (data: DataList) => {
    for (let i = 0; i < 24; i++) {
      if (i < 12) {
        tempSensorValueList.push(
          data.data[`kPa_Avg_${i + 1}` as keyof TempTableAndGraph] as number
        );
      } else if (i >= 12) {
        tempSensorValueList.push(
          data.data[
            `SoilTemp_Avg_${i - 11}` as keyof TempTableAndGraph
          ] as number
        );
      }
    }
    tempSensorData.current = data.data;
    const values = getData(data.data);
    setTempSensorValueList(values);
  };

  const mappingValues = (data: DeviceList) => {
    const senList: number[] = [];
    const contList: (ControllerData | null)[] = [];
    data.deviceList?.map((device) => {
      if ("sensorData" in device) {
        sensorData.current = device.sensorData;
        const values = getSensorValues(device.sensorData!);
        senList.push(...values);
        return device;
      } else {
        controllerData.current = device.controllerData;
        contList.push(device.controllerData);
        return device;
      }
    });
    setSensorValue(senList);
  };

  const getSensorValues = (sensorData: SensorData): number[] => {
    return (
      Array.from(
        { length: 20 },
        (_, i) => sensorData[`s${i + 1}` as keyof SensorData]
      ) as (number | null)[]
    ).filter((value) => value !== null) as number[];
  };

  const getData = (data: TempTableAndGraph): number[] => {
    return Array.from({ length: 24 }, (_, i) => {
      if (i < 12) {
        return data[`kPa_Avg_${i + 1}` as keyof TempTableAndGraph];
      } else {
        return data[`SoilTemp_Avg_${i - 11}` as keyof TempTableAndGraph];
      }
    }) as number[];
  };

  const onClickSensor = (index: number, name: string) => {
    // 그래프 제목 및 데이터 변경 로직 추가 필요
    setSelectedSensor({
      name,
      index,
    });
  };
  const setTab = (index: number) => {
    setCurrentTab(index);

    if (index === 0) {
      setIsTemp(false);
    } else if (index === 2) {
      setIsTemp(true);
    }
  };

  useEffect(() => {
    if (currentTab === 0) {
      if (sensorList) {
        onClickSensor(
          0,
          `${device?.sensors![0].name!}(${device?.sensors![0].spec?.unit})`
        );
      }
    } else if (currentTab === 2) {
      onClickSensor(0, convertKeys[0]);
    }
  }, [currentTab]);

  return (
    <div className="status">
      <div className="status-colorFild">
        <ul className="status__tabnav">
          {menuArr.map((menu, index) => {
            return (
              <li
                key={index}
                className={`tab-link status__tabnav-item ${
                  currentTab === index ? "current" : ""
                }`}
                onClick={() => setTab(index)}
              >
                {menu.name}
              </li>
            );
          })}
        </ul>

        <div className="status__tabcontent current">
          <div onClick={onScrollLeft}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="arrow__icon mr-5 pointer"
            />
          </div>
          <div className="w-95p">
            <div className="status__scroll-area">
              {currentTab === 2 ? (
                <div
                  className="status__tabitem"
                  key="텐시오미터"
                  ref={tempScrollAreaRef}
                >
                  {convertKeys?.map((name, index) => {
                    return (
                      <div
                        key={name + index}
                        className={`status__cardItem-box pointer ${
                          selectedSensor?.index === index ? "selected" : ""
                        }`}
                        onClick={() => onClickSensor(index, name)}
                      >
                        <TempSensorComponent
                          key={name + index}
                          sensorNumber={index + 1}
                          value={`${tempSensorValueList[index]} ${
                            index > 11 ? "℃" : "kPa"
                          }`}
                          name={name}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : currentTab === 0 ? (
                <div className="status__tabitem" key="센서" ref={scrollAreaRef}>
                  {sensorList &&
                    sensorList?.map((device, i) => {
                      return device?.sensors?.map((sensor, index) => {
                        const selectedIndex = 4 * i + index;
                        return (
                          <div
                            key={sensor.id}
                            className={`status__cardItem-box pointer ${
                              selectedSensor?.index === selectedIndex
                                ? "selected"
                                : ""
                            }`}
                            onClick={() =>
                              onClickSensor(
                                selectedIndex,
                                `${sensor.name}(${sensor.spec?.unit})`
                              )
                            }
                          >
                            <SensorComponent
                              key={sensor.id}
                              sensorNumber={index + 1}
                              value={`${sensorValueList[selectedIndex]}${sensor.spec?.unit}`}
                              name={sensor.name}
                            />
                          </div>
                        );
                      });
                    })}
                </div>
              ) : (
                <div className="status__tabitem" key="컨트롤러">
                  {contDevice?.controllers?.map((controllerInfo, index) => {
                    return (
                      <ControllerComponent
                        key={controllerInfo.id}
                        contNumber={index + 1}
                        value={`${controllerInfo.useYn ? "ON" : "OFF"}`}
                        name={controllerInfo.specification.name}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div onClick={onScrollRight}>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="arrow__icon ml-5 pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeData;
