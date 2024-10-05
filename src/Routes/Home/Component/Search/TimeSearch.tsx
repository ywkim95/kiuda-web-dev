import React from 'react';
import {ko} from "date-fns/esm/locale";
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from "react-datepicker";
import {SearchInterface} from "./interface/Search.interface";

const TimeSearch = ({htmlId, onChange, selected}: SearchInterface) => {
  return (
    <ReactDatePicker
      locale={ko}
      selected={selected}
      onChange={onChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      timeCaption="Time"
      dateFormat="aa h:mm"
      className="table-search__search--time"
      id={htmlId}
    />
  );
};

export default TimeSearch;
