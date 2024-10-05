import CustomDropdown from "./custom_dropdown";
import CustomSwitch from "./custom_switch";
import updateControllerSetting from "../Function/UpdateControllerSettingProps";
import {ChangeEvent, useEffect, useState} from "react";
import {ControllerDevice} from "../../../Common/Model/ControllerDevice.model";
import {Device} from "../../../Common/Model/Device.model";
import { set } from "lodash";
import { useSettingStore } from "../../../Common/Store/settingStore";

type ControllerProps = { deviceId: number, controllerDevice: ControllerDevice, sensorDevice: Device };

const Controller = ({deviceId, controllerDevice, sensorDevice}: ControllerProps) => {
  const setting = useSettingStore(state => state.setting);
  const [trigger, setTrigger] = useState(false);
  const sensorList = sensorDevice.sensors!;
  
  const setDefaultSensor = () => {
    return sensorList.find(value => value.id === controllerDevice.mappingSensorId)!.name
  };
  
  const onChange = (settingType: 'deviation' | 'value') => (e: ChangeEvent<HTMLInputElement>) => {
    
    updateControllerSetting({
      deviceId,
      controllerId: controllerDevice.id,
      useCustomValueId: controllerDevice.userCustomValues[0].id,
      newValue: parseInt(e.target.value),
      settingType: settingType,
    });
  };
  const onClick = (settingType: 'deviation' | 'value', calcType: 'add' | 'sub') => () => {
    const userCustomValue = controllerDevice.userCustomValues[0];
    const newValue = settingType === 'deviation' ? userCustomValue.gab : userCustomValue.manualValue;
    updateControllerSetting({
      deviceId,
      controllerId: controllerDevice.id,
      useCustomValueId: userCustomValue.id,
      newValue: calcType === 'add' ? newValue + 1 : newValue - 1,
      settingType: settingType,
    });
  }
  
  return (
    <div className="sensor__component">
      <div className="sersor__name">{controllerDevice.specification.name}</div>
      <div className="sensor__settings">
        <div className="sensor__reference">
          <span className="sensor__refernece--name">기준센서</span>
          {sensorList.length === 0 ? null : (
            <CustomDropdown
              list={sensorList}
              defaultValue={setDefaultSensor()}
              deviceId={deviceId}
              controllerId={controllerDevice.id}
            />
          )}
        </div>
        <div className="sensor__operation">
          <span className="sensor__operation--name">동작</span>
          <CustomSwitch deviceId={deviceId} controller={controllerDevice}/>
        </div>
        <div className="sensor__controlValue">
          <span className="sensor__controlValue--name">제어값</span>
          <div className="sensor__controlValue--value">
            <button
              className="sensor__controlValue--minus"
              onClick={onClick('value', 'sub')}
            >-
            </button>
            <div className="sensor__controlValue--resultBox">
              <input value={controllerDevice.userCustomValues[0].manualValue}
                     onChange={onChange('value')}/>
            </div>
            <button
              className="sensor__controlValue--plus"
              onClick={onClick('value', 'add')}
            >+
            </button>
          </div>
        </div>
        <div className="sensor__controlDeviation">
          <span className="sensor__controlDeviation--name">제어편차</span>
          <div className="sensor__controlDeviation--value">
            <button
              className="sensor__controlDeviation--minus"
              onClick={onClick('deviation', 'sub')}
            >
              -
            </button>
            <div className="sensor__controlDeviation--resultBox">
              <input value={controllerDevice.userCustomValues[0].gab}
                     onChange={onChange('deviation')}/>
            </div>
            <button
              className="sensor__controlDeviation--plus"
              onClick={onClick('deviation', 'add')}
            >+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controller;
