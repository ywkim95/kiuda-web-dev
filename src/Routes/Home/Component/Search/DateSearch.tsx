import React from 'react';
import ReactDatePicker from "react-datepicker";
import {SearchInterface} from "./interface/Search.interface";
import {ko} from "date-fns/esm/locale";
import 'react-datepicker/dist/react-datepicker.css';


const DateSearch = ({htmlId, onChange, selected}: SearchInterface) => {
  return (
    <ReactDatePicker
      id={htmlId}
      locale={ko}
      selected={selected}
      onChange={onChange}
      dateFormat="yyyy-MM-dd"
      className="monitoring-search__search--date"
    />
  );
};

export default DateSearch;
