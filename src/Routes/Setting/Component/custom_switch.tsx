import React from "react";
import toggleController from "../Function/ToggleController";
import {ControllerDevice} from "../../../Common/Model/ControllerDevice.model";

type CustomSwitchProps = { deviceId: number, controller: ControllerDevice };

const CustomSwitch = ({deviceId, controller}: CustomSwitchProps) => {
  const onChangeValue = () => {
    toggleController({deviceId, controllerId: controller.id, isActive: controller.useYn});
  };
  return (
    <div className="switch__wrapper">
      <input type="checkbox" id="switch" value={controller.useYn.toString()} onChange={onChangeValue}/>
      <label htmlFor="switch" className="switch__label">
        <span className="onf_btn"></span>
        <span className="switch__text on-text">On</span>
        <span className="switch__text off-text">Off</span>
      </label>
    </div>
  );
}

export default CustomSwitch;