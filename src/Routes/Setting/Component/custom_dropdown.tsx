import {ChangeEvent} from "react";
import updatedMappingSensor from "../Function/UpdateMappingSensor";
import {SensorDevice} from "../../../Common/Model/SensorDevice.model";
// props를 통해서 리스트를 전달 후 map으로 list의 길이만큼 dropdown 메뉴를 만든다.

type CustomDropdownProps = { defaultValue: string, list: SensorDevice[], deviceId: number, controllerId: number };

const CustomDropdown = ({defaultValue, list, deviceId, controllerId}: CustomDropdownProps) => {
  const onSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    updatedMappingSensor({deviceId, controllerId, newMappingSensorId: parseInt(e.target.value)});
  };
  return (
    <select className="sensor__reference--dropDown" defaultValue={defaultValue} onChange={onSelect}>
      {
        list.map((value, index) => {
          return (
            <option className="sensor__reference--value" value={value.id} key={value.id}>{value.name}</option>
          )
        })
      }
    </select>
  );
}
export default CustomDropdown;
