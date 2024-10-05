import React, {useEffect, useState} from 'react';
import 'moment/locale/ko';
import moment from "moment";


const DateTimes = () => {
  const [times, setTimes] = useState(moment().format('YYYY-MM-DD (dd) HH:mm:ss'));
  
  useEffect(() => {
    let date = moment().format('YYYY-MM-DD (dd) HH:mm:ss');
    setTimes(date);
    const getDates = setInterval(() => {
      date = moment().format('YYYY-MM-DD (dd) HH:mm:ss');
      setTimes(date);
    });
    return () => {
      clearInterval(getDates);
    }
  }, []);
  
  return (
    <span>{times} </span>
  );
};

export default DateTimes;
