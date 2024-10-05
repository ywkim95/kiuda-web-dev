import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import updateSensorThreshold from "../Function/UpdateSensorThresholdProps";
import {debounce} from "lodash";
import {SensorDevice} from "../../../Common/Model/SensorDevice.model";

type SensorProps = {
  deviceId: number,
  sensor: SensorDevice
};
const Sensor = ({
                  deviceId,
                  sensor
                }: SensorProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [minValue, setMinValue] = useState<number>(sensor.customStableStart);
  const [maxValue, setMaxValue] = useState<number>(sensor.customStableEnd);
  const [gapValue, setGapValue] = useState<number>(sensor.correctionValue);
  
  const min = sensor.spec!.minValue;
  const max = sensor.spec!.maxValue;
  const step = sensor.spec!.maxValue > 1000 ? 10 : 1;
  const priceCap = sensor.spec!.maxValue > 1000 ? 10 : 1;
  
  
  const debounceUpdateThreshold = useRef(debounce((args) => {
    updateSensorThreshold(args);
    
  }, 500)).current;
  
  
  const handleMinValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (newValue <= maxValue - priceCap && newValue >= min) {
      setMinValue(newValue);
    }
  };
  
  useEffect(() => {
    debounceUpdateThreshold({
      deviceId,
      sensorId: sensor.id,
      thresholdType: 'min',
      newValue: minValue,
    });
  }, [minValue]);
  
  const handleMaxValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (newValue >= minValue + priceCap && newValue <= max) {
      setMaxValue(newValue);
    }
  };
  
  useEffect(() => {
    debounceUpdateThreshold({
      deviceId,
      sensorId: sensor.id,
      thresholdType: 'max',
      newValue: maxValue,
    });
  }, [maxValue]);
  
  useEffect(() => {
    // 스타일 업데이트 로직 최적화
    
    if (progressRef.current) {
      const adjustedMinValue = Math.max(minValue, min);
      const adjustedMaxValue = Math.min(maxValue, max);
      
      const minValuePercentage = ((adjustedMinValue - min) / (max - min)) * 100;
      const maxValuePercentage = ((adjustedMaxValue - min) / (max - min)) * 100;
      progressRef.current.style.left = `${minValuePercentage}%`;
      progressRef.current.style.right = `${100 - maxValuePercentage}%`;
    }
  }, [minValue, maxValue, max]);
  
  return (
    <div className="rangeSlider__component">
      <span className="rangeSlider__component--name">{`${sensor.spec!.name}(${sensor.spec!.unit})`}</span>
      <div className="rangeSlider__slider">
        <div className="rangeSlider__box">
          <div className="rangeSlider__content--text">
            <span>최소</span>
            <span>최대</span>
          </div>
          <div className="rangeSliderBar">
            <div className="full-range">
              <div className="incl-range" ref={progressRef}>
              </div>
            </div>
            <div>
              <input
                onChange={handleMinValueChange}
                type="range"
                value={minValue.toString() === "" ? 0 : minValue}
                min={min}
                step={step}
                max={max}
                className="rangeSlider__thumb rangeSlider__thumb--left"
              />
              <input
                onChange={handleMaxValueChange}
                type="range"
                value={maxValue}
                min={min}
                step={step}
                max={max}
                className="rangeSlider__thumb rangeSlider__thumb--right"
              />
            </div>
          </div>
          <div className="rangeSlider__content--countBox">
            <input
              className="rangeSlider__barContent--minCountBox"
              type="number"
              value={minValue}
              step={step}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value > maxValue) return;
                setMinValue(value);
                debounceUpdateThreshold({
                  deviceId,
                  sensorId: sensor.id,
                  thresholdType: 'min',
                  newValue: minValue,
                });
              }}
            />
            <input
              className="rangeSlider__barContent--maxCountBox"
              type="number"
              value={maxValue}
              step={step}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < min) return;
                setMaxValue(value);
                debounceUpdateThreshold({
                  deviceId,
                  sensorId: sensor.id,
                  thresholdType: 'max',
                  newValue: maxValue,
                });
              }}
            />
          </div>
        </div>
        <div className="rangeSlider__correction">
          <div className="rangeSlider__correction--text">보정</div>
          <input
            className="rangeSlider__correction--countBox"
            value={gapValue}
            type="number"
            onChange={(e) => {
              const value = Number(e.target.value);
              setGapValue(value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Sensor;
