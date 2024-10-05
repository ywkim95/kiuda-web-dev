import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosResponse } from "axios";
import moment from "moment";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import useChangeDevice from "./Function/useChangeDevice";
import { useNavigate } from "react-router-dom";
import Camera from "./Fragment/CameraArea/Camera";
import RealTimeData from "./Fragment/DataArea/RealTimeData";
import TempGraph from "./Fragment/GraphArea/TempGraph";
import Notification from "./Fragment/NotificationArea/Notification";
import TempTable from "./Fragment/TableArea/TempTable";
import Loading from "../../Loading";
import { useUserStore } from "../../Common/Store/userStore";
import { useTempDataStore } from "../../Common/Store/tempDataStore";
import { useRoomIdStore } from "../../Common/Store/roomIdStore";
import { useSensorDeviceListStore } from "../../Common/Store/sensorDeviceListStore";
import { useDeviceListStore } from "./Store/deviceListStore";
import { useDeviceStore } from "./Store/deviceStore";
import useTempTableGraphStore from "./Store/tempTableGraphStore";
import { TimeUnitEnum } from "./Const/TimeUnit.enum";
import { DEVICE_ID } from "../../Common/Const/data.const";
import { Device } from "../../Common/Model/Device.model";
import { ClassifyEnum } from "../Setting/Const/Classify.enum";
import useTableGraphStore from "./Store/tableGraphStore";
import { useDataStore } from "../../Common/Store/dataStore";
import Table from "./Fragment/TableArea/Table";
import Graph from "./Fragment/GraphArea/Graph";
import { useGatewayStore } from "../../Common/Store/gatewayStore";

const Home = () => {
  // const getRoundedMinutes = (date: Date) => {
  //   const minutes = date.getMinutes();
  //   return Math.round(minutes / 30) * 30;
  // }
  // 유저 데이터
  const user = useUserStore((state) => state.user);
  // 소켓 연결 부분
  const socketIORef: React.MutableRefObject<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null> = useRef(null);
  // navigate
  const navigate = useNavigate();
  //Socket<DefaultEventsMap, DefaultEventsMap>
  // 실시간 데이터를 세팅하는 함수
  const setTempData = useTempDataStore((state) => state.setTempData);
  const setData = useDataStore((state) => state.setData);
  // 실시간 데이터 변환
  // const [values, setValues] = useState<(number | null)[]>([]);
  // 로컬스토리지에서 roomId를 가져온다.
  const roomId = useRoomIdStore((state) => state.roomId);
  // 디바이스 리스트
  const setDeviceList = useDeviceListStore((state) => state.setDeviceList);
  // 드롭박스나 다른 UI에서 활용하기 위한 센서리스트
  const { sensorList, setSensorList } = useSensorDeviceListStore(
    (state) => state
  );
  // 현재 선택된 디바이스
  const device = useDeviceStore((state) => state.device);
  // 그래프/테이블 타이머
  const timerId = useRef<NodeJS.Timeout | null>(null);
  // 그래프/테이블 데이터
  const setTempAccData = useTempTableGraphStore(
    (state) => state.setTempAccData
  );
  const setAccData = useTableGraphStore((state) => state.setAccData);
  // 그래프/테이블 데이터를 가져오기 위한 날짜
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  // const roundedMinutes = getRoundedMinutes(now);
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  const [startDate, setStartDate] = useState<Date>(startOfToday);
  const [endDate, setEndDate] = useState<Date>(endOfToday);

  const [tempStartDate, setTempStartDate] = useState<Date>(startOfToday);
  const [tempEndDate, setTempEndDate] = useState<Date>(endOfToday);

  const [timeUnit, setTimeUnit] = useState<TimeUnitEnum>(TimeUnitEnum.MINUTE);
  const [tempTimeUnit, setTempTimeUnit] = useState<"hour" | "day">("hour");
  const changeDevice = useChangeDevice();

  const [loading, setloading] = useState(false);

  const [isTemp, setIsTemp] = useState(false);

  const gateway = useGatewayStore((state) => state.gateway);

  useEffect(() => {
    if (user !== null) {
      onRoomIdChange().then();
    } else {
      navigate("/login");
    }
    return () => {
      onDisconnect();
    };
  }, [user, roomId]);

  useEffect(() => {
    if (sensorList) {
      changeDevice(sensorList[0].id);
      if (sensorList.length > 0 && device) {
        // setStartDate(new Date());
        // setEndDate(new Date());
        onTempTableAndGraphClick();
        onTableAndGraphClick();
      }
    }
    return () => {
      if (timerId.current) clearInterval(timerId.current);
    };
  }, [sensorList, device]);

  const onTempTableAndGraphClick = () => {
    fetchTempGraphAndTableData();
  };

  const onTableAndGraphClick = () => {
    fetchGraphAndTableData();
    if (timerId.current) clearInterval(timerId.current);
    timerId.current = setInterval(fetchGraphAndTableData, 1000 * 60 * 60);
  };

  const onRoomIdChange = async () => {
    await axios
      .get(`/devices/roomId/${roomId}`, { withCredentials: true })
      .then(initialSensorDataList)
      .then(initialDevice)
      .then(getRealTimeData)
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setloading(true);
      });
  };

  const initialSensorDataList = (r: AxiosResponse<any, any>) => {
    setDeviceList(r.data);

    const updatedSensorList: Device[] = r.data.filter(
      (value: Device) => value.classify === ClassifyEnum.SENSOR
    );
    setSensorList(updatedSensorList);
    // 해당 디바이스 리스트를 논리적으로 (센서/제어) 하나로 묶어야한다. -> 하나로 묶어야 UI를 만들 수 있다. -> UI를 만들어야 실시간 데이터를 끼울 수 있다.
    // 센서디바이스의 아이디를 기반으로 서로가 연동되도록 만들어 놓았기때문에 해당하는 아이디를 기준으로 드롭다운박스를 만든다.
    // 드롭다운박스의 셀렉터는 useState를 통하여 관리한다.
    // 선택된 디바이스를 기반으로 실시간 데이터 및 그래프/테이블 데이터를 가져와야한다.
    return updatedSensorList;
  };

  const initialDevice = async (updatedSensorList: Device[]) => {
    const deviceId = localStorage.getItem(DEVICE_ID);

    if (deviceId) {
      changeDevice(parseInt(deviceId));
    } else if (updatedSensorList.length > 0) {
      changeDevice(updatedSensorList[0].id);
      localStorage.setItem(DEVICE_ID, updatedSensorList[0].id.toString());
    } else {
      console.log("센서가 없습니다.");
    }

    return true;
  };

  const getRealTimeData = (success: boolean) => {
    if (success) {
      connectWebSocket();
    }
    return success;
  };

  const connectWebSocket = () => {
    const token = axios.defaults.headers.common["authorization"]?.toString();
    if (!socketIORef.current) {
      socketIORef.current = io("/real-time", {
        withCredentials: true,
        extraHeaders: { authorization: token! },
      });
      changeRoom(roomId!);
      changeTempRoom(roomId!);
      socketIORef.current.on("receive_data", (realtime_data: any) => {
        setData(realtime_data);
      });
      socketIORef.current.on("receive_temp_data", (realtime_data: any) => {
        setTempData(realtime_data);
      });
    }
  };

  const changeRoom = (newRoomId: string) => {
    if (socketIORef.current) {
      socketIORef.current.emit("joinRoom", { roomId: newRoomId });
    }
  };

  const changeTempRoom = (newRoomId: string) => {
    if (socketIORef.current) {
      socketIORef.current.emit("tempJoinRoom", { roomId: newRoomId });
    }
  };

  const onDisconnect = () => {
    if (socketIORef.current) {
      socketIORef.current.disconnect();
      socketIORef.current = null;
    }
  };

  const fetchGraphAndTableData = async () => {
    if (device) {
      const sDate =
        moment(startDate).format("yyyy-MM-DDTHH:mm") + ":00+09:00" ??
        moment().format("yyyy-MM-DD") + "T00:00:00+09:00";
      const eDate =
        moment(endDate).format("yyyy-MM-DDTHH:mm") + ":00+09:00" ??
        moment().format("yyyy-MM-DD") + "T23:59:59+09:00";
      try {
        const resp = await axios.get(
          `/tableAndGraph/${device.id}/${timeUnit.toString()}`,
          {
            params: {
              startDate: sDate,
              endDate: eDate,
            },
          }
        );
        setAccData(resp.data);
      } catch (e) {
        console.error("데이터 조회 중 오류 발생:", e);
      }
    }
  };

  const fetchTempGraphAndTableData = async () => {
    if (device) {
      const sDate =
        moment(tempStartDate).format("yyyy-MM-DDTHH:mm") + ":00+09:00" ??
        moment().format("yyyy-MM-DD") + "T00:00:00+09:00";
      const eDate =
        moment(tempEndDate).format("yyyy-MM-DDTHH:mm") + ":00+09:00" ??
        moment().format("yyyy-MM-DD") + "T23:00:00+09:00";
      try {
        const resp = await axios.get(
          `/tableAndGraph/temp/${device.id}/${tempTimeUnit.toString()}`,
          {
            params: {
              startDate: sDate,
              endDate: eDate,
            },
          }
        );
        console.log(resp.data);
        setTempAccData(resp.data);
      } catch (e) {
        console.error("데이터 조회 중 오류 발생:", e);
      }
    }
  };

  if (loading) {
    if (user !== null && sensorList !== null) {
      return (
        <>
          <div className="main-screen">
            <div className="status">
              <RealTimeData setIsTemp={setIsTemp} isTemp={isTemp} />
            </div>
            <div className="camera">
              <Camera />
            </div>
            <div className="graph">
              {isTemp ? (
                <TempGraph
                  startDate={tempStartDate}
                  endDate={tempEndDate}
                  setStartDate={setTempStartDate}
                  setEndDate={setTempEndDate}
                  onClick={onTempTableAndGraphClick}
                />
              ) : (
                <Graph
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  onClick={onTableAndGraphClick}
                />
              )}
            </div>
            <div className="notification">
              <Notification />
            </div>
            <div className="table">
              {isTemp ? (
                <TempTable
                  startDate={tempStartDate}
                  endDate={tempEndDate}
                  setStartDate={setTempStartDate}
                  setEndDate={setTempEndDate}
                  onClick={onTempTableAndGraphClick}
                />
              ) : (
                <Table
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  onClick={onTableAndGraphClick}
                />
              )}
            </div>
          </div>
        </>
      );
    } else {
      return <Loading />;
    }
  } else {
    return <Loading />;
  }
  // return null;
};

export default Home;
