import React, {useEffect, useState} from 'react';
import moment from "moment";
import axios from "axios";
import {getWeather} from "../../../Auth/RequestLogin";
import findLocation from "./Function/findLocation";
import {useUserStore} from "../../Store/userStore";
import {ROOM_ID, WEATHER_API_KEY} from "../../Const/data.const";

interface WeatherReqType {
  serviceKey: string,
  pageNo: string,
  numOfRows: string,
  dataType: string,
  base_date: string,
  base_time: string,
  nx: number,
  ny: number,
}

interface WeatherResType {
  t1h: string,
  reh: string,
}


const Weather = () => {
  const [weather, setWeather] = useState('');
  const user = useUserStore(state => state.user);
  
  useEffect(() => {
    if (user) {
      fetchWeather();
      const interval = setInterval(fetchWeather, 1000 * 60 * 60);
      
      return () => {
        clearInterval(interval);
      }
    }
  }, [user]);
  
  
  const fetchWeather = async () => {
    const roomId = localStorage.getItem(ROOM_ID);
    let nowDate = moment();
    const gateway = findLocation(roomId!, user);
    try {
      const {gridX, gridY}: { gridX: string, gridY: string } = await getWeather(gateway?.location!);
      const params: WeatherReqType = {
        serviceKey: WEATHER_API_KEY,
        pageNo: '1',
        numOfRows: '60',
        dataType: 'JSON',
        base_date: `${nowDate.format('YYYYMMDD')}`,
        base_time: `${nowDate.clone().subtract(1, "hour").format('HH')}00`,
        nx: parseInt(gridX),
        ny: parseInt(gridY),
      }
      
      const response = await axios.get('/weatherApi', {
        params,
        withCredentials: false,
      });
      
      const itemList = response.data.response.body.items.item;
      let data: WeatherResType = {
        t1h: '',
        reh: '',
      };
      for (const respElement of itemList) {
        if (respElement.fcstTime === `${nowDate.format('HH')}00`) {
          if (respElement.category === 'T1H') {
            data.t1h = respElement.fcstValue;
          }
          if (respElement.category === 'REH') {
            data.reh = respElement.fcstValue;
          }
        }
      }
      setWeather(`${data.t1h}℃ / ${data.reh}%`);
    } catch (e) {
      setWeather('날씨 정보 오류');
    }
  };
  return (
    <span>
      {weather}
    </span>
  );
};

export default Weather;