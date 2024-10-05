import React from 'react';
import {SearchProps} from "../../Home/Component/Search/interface/SearchProps.interface";
import DateSearch from "../../Home/Component/Search/DateSearch";

const SelectBox = ({
                     startDate,
                     endDate,
                     setStartDate,
                     setEndDate,
                     onClick,
                   }: SearchProps) => {
  const onSearchClick = () => {
    onClick();
  };
  
  return (
    <div className="monitoring-select">
      <div className="monitoring-select__title">
        {/* <div className="monitoring-select__name">카메라 이름</div>
        <select className="monitoring-select__dropDown">
          {
            [1, 2].map((value) => {
              return (
                <option key={value} value="monitoring-select__dropDown--value">Example {value}</option>
              )
            })
          }
        </select> */}
      </div>
      <div className="monitoring-search">
        <div className="monitoring-search__title">조회기간</div>
        <div className="monitoring-search__search">
          <div className="monitoring-search__search--wrap">
            <DateSearch htmlId="monitoringStartDate" onChange={setStartDate} selected={startDate}/>
            <label htmlFor="monitoringStartDate">
              <div className="monitoring-search__search--iconBox dateIconBox"></div>
            </label>
          </div>
          <span> ~ </span>
          <div className="monitoring-search__search--wrap">
            <DateSearch htmlId="monitoringEndDate" onChange={setEndDate} selected={endDate}/>
            <label htmlFor="monitoringEndDate">
              <div className="monitoring-search__search--iconBox dateIconBox"></div>
            </label>
          </div>
        </div>
        <button className="monitoring-search__button" onClick={onSearchClick}>조회</button>
      </div>
    </div>
  );
};

export default SelectBox;
