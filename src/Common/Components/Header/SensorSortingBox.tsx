import React, { ChangeEvent, useEffect, useState } from "react";
import { Device } from "../../Model/Device.model";
import useChangeDevice from "./Function/useChangeDevice";
import { useGatewayStore } from "../../Store/gatewayStore";

const SensorSortingBox = ({ sensorList }: { sensorList: Device[] }) => {
  const [selected, setSelected] = useState(sensorList[0].name);
  const changeDevice = useChangeDevice();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // 드롭다운 선택
    setSelected(e.target.value);
  };

  useEffect(() => {
    const value = sensorList.find((value) => value.name === selected);
    if (!value) return;
    changeDevice(value.id);
  }, [selected]);

  return (
    <>
      <select
        className="user-information__dropDown__device"
        value={selected!}
        onChange={handleChange}
      >
        {sensorList.map((value) => {
          return (
            <option
              key={value.id}
              value={value.name!}
              className="user-information__dropDownValue"
            >
              {value.name}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default SensorSortingBox;
