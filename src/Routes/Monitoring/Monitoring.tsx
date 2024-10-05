import React, {useCallback, useEffect, useRef, useState} from 'react';
import SelectBox from "./Component/SelectBox";
import TableBox from "./Component/TableBox";
import axios from "axios";
import moment from "moment";
import {useRoomIdStore} from "../../Common/Store/roomIdStore";
import useImageListStore from './Store/ImageListStore';
import removeBaseUrl from '../../Common/Function/removeBaseUrl';

const Monitoring = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [startDate, setStartDate] = useState<Date>(startOfDay);
  const [endDate, setEndDate] = useState<Date>(endOfDay);
  const roomId = useRoomIdStore(state => state.roomId);
  const {imageList, setImageList} = useImageListStore(state => state);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    // axios 요청
    fetchMonitoringDataList();
  }, [roomId]);
  
  const fetchMonitoringDataList = async (url?:string) => {
    const params = !url ?  {
      where__createdAt__more_than: moment(startDate).format('YYYY-MM-DD') + 'T00:00:00+09:00',
      where__createdAt__less_than: moment(endDate).format('YYYY-MM-DD') + 'T23:59:59+09:00',
    } : {};
    if (roomId) {
      const response = await axios.get(
        url ?? `/monitoring/${roomId}`, {
          params: params,
        },
      );
      if(!url) {
        setImageList(response.data.data);
      } else {
        setImageList([...imageList, ...response.data.data]);
      }
      const next = removeBaseUrl(response.data.next);
      setNextUrl(next);
    }
  };

  const lastImageCallback = useCallback((node: HTMLTableRowElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && nextUrl) {
        fetchMonitoringDataList(nextUrl);
      }
    });
    if (node) observer.current.observe(node);
  },[]);
  
  const onSearchClick = () => {
    fetchMonitoringDataList();
  };
  
  return (
    <div className="monitoring-screen">
      <SelectBox
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onClick={onSearchClick}
      />
      <TableBox callback={lastImageCallback}/>
    </div>
  );
};

export default Monitoring;