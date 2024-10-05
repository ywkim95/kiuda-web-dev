import React from 'react';
import Sensor from "./Sensor";
import {Device} from "../../../Common/Model/Device.model";

const Sensors = ({value}: { value: Device }) => {
  return (
    <div className="rangeSlider">
      <div className="rangeSlider__title">알림범위 & 보정</div>
      <div className="rangeSlider__content">
        {
          value.sensors?.map((sensor, index) => {
            return (
              <Sensor
                deviceId={value.id}
                sensor={sensor}
                key={sensor.id}
              />
            
            )
          })
        }
      </div>
    </div>
  );
};

export default Sensors;
