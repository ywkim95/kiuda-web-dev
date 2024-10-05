import React, {ChangeEvent, useEffect, useState} from 'react';
import {Gateway} from "../../Model/Gateway.model";
import useChangeGateway from "./Function/useChangeGateway";
import { useRoomIdStore } from '../../Store/roomIdStore';

const SortingBox = ({gatewayList}: { gatewayList: Gateway[] }) => {
  const [selected, setSelected] = useState(gatewayList[0].name);
  const changeGateway = useChangeGateway();
  const {roomId, setRoomId} = useRoomIdStore(state => state);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {  // 드롭다운 선택
    setSelected(e.target.value);
  };

  useEffect(() => {
    const value = gatewayList.find((value) => value.name === selected);
    if(!value) return;
    changeGateway(`${value.countryId}${value.areaId}${value.gatewayId}`);
    setRoomId(`${value.countryId}${value.areaId}${value.gatewayId}`);

  }, [selected])
  
  
  
  return (
    <>
      <select className="user-information__dropDown" value={selected!} onChange={handleChange}>
        {gatewayList.map((value) => {
          return (
            <option key={value.id} value={value.name!} className="user-information__dropDownValue"
                    >{value.name}</option>
          );
        })}
      </select>
    </>
  );
};

export default SortingBox;