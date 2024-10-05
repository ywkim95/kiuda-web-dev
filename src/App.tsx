import axios from "axios";
import {Header} from "./Common/Components/Header/Header";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Login from "./Routes/Login/Login";
import Home from "./Routes/Home/Home";
import Monitoring from "./Routes/Monitoring/Monitoring";
import Setting from "./Routes/Setting/Setting";
import {useEffect, useState} from "react";
import {useAuthStore} from "./Auth/Store/authStore";
import NoMatch from "./NoMatch";
import Loading from "./Loading";
import {UNAUTHORIZED} from "./Common/Const/httpCode.const";
import {useUserStore} from "./Common/Store/userStore";
import {useRoomIdStore} from "./Common/Store/roomIdStore";
import {useGatewayListStore} from "./Common/Store/gatewayListStore";
import {useGatewayStore} from "./Common/Store/gatewayStore";
import {Gateway} from "./Common/Model/Gateway.model";
import {User} from "./Common/Model/User.model";
import { AUTO_LOGIN, DEVICE_ID, IS_LOGGED_IN, REFRESH_TOKEN, ROOM_ID } from "./Common/Const/data.const";

axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === UNAUTHORIZED) {
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
          return Promise.reject(error);
        }
        const response = await axios.post('/auth/token/access',
          {},
          {
            headers: {
              'authorization': `Bearer ${refreshToken}`
            },
          });
        
        const newAccessToken = response.data['accessToken'];
        axios.defaults.headers.common['authorization'] = `Bearer ${newAccessToken}`;
        error.config.headers['authorization'] = `Bearer ${newAccessToken}`;
        
        return axios(error.config);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useUserStore((state) => state.setUser);
  const {roomIdList, setRoomId, setRoomIdList} = useRoomIdStore((state) => state);
  const {isLoggedIn, setIsLoggedIn} = useAuthStore((state) => state);
  const setGatewayList = useGatewayListStore((state) => state.setGatewayList);
  const setGateway = useGatewayStore((state) => state.setGateway);
  const [loading, setLoading] = useState<boolean>(false);
  
  /**
   * 홈페이지를 접속했을때의 시나리오
   * 1. 처음 접속한 경우
   *     1. 사용자가 홈페이지에 접속한다.
   *     2. 로그인을 시도한다.
   * 2. 다시 접속한 경우
   *     1. 사용자가 홈페이지에 접속한다.
   *     2. 페이지에서 javascirpt를 통하여 로컬스토리지에 접근하고, 해당 로컬스토리지에 자동로그인 및 token이 있는지 확인한다.
   *     3. 자동로그인 플래그 및 token이 있는경우
   *         1. 로그인이 된 상태를 유지하기 위한 정보들을 서버로부터 받아온다.
   *         2. 정보의 종류는 사용자 정보 및 게이트웨이 정보이다.
   *     4. 자동로그인 플래그 및 token이 없는경우
   *         1. 로그인된 상태를 유자하면 안되기때문에 정보를 불러오지않고 바로 로그인페이지로 리다이렉트한다.
   */
  // 자동로그인 체크 useEffect (최초 1회) -> 자동로그인이 아닌경우 로그인페이지로 리다이렉트
  useEffect(() => {
    // requestPermission();
    const loggedIn = sessionStorage.getItem(IS_LOGGED_IN);
    if (loggedIn) {
      setIsLoggedIn(true);
    } else {
      onCheckAutoLogin();
    }
    
  }, []);
  
  const onCheckAutoLogin = () => {
    const isAutoLogin = localStorage.getItem(AUTO_LOGIN);
    if (!isAutoLogin || isAutoLogin === 'false') {
      if (location.pathname !== '/login') {
        navigate('/login', {state: {from: location}});
      }
      setLoading(true);
    } else {
      setIsLoggedIn(true);
      sessionStorage.setItem(IS_LOGGED_IN, 'true');
    }
  };
  
  
  // 로그인 여부 체크 useEffect
  useEffect(() => {
    if (isLoggedIn) {
      onCallUser().then(r => r);
    }
  }, [isLoggedIn]);
  
  const onCallUser = async () => {
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN) ?? localStorage.getItem(REFRESH_TOKEN);
    if (refreshToken) {
      // setIsLoggedIn(true);
      await axios.get('/users/me').then(
        r => {
          setUser(r.data);
          setGatewayToRoomId(r.data);
          const redirectTo = location.state?.from.pathname ?? location.pathname ?? '/home';
          if (redirectTo !== '/login') {
            navigate(redirectTo);
          } else {
            navigate('/home');
          }
          
        }
      ).catch(
        (e) => {
          window.alert('자동로그인에 실패하였습니다.');
          if (location.pathname !== '/login') {
            navigate('/login', {state: {from: location}});
          }
          setIsLoggedIn(false);
        }
      ).finally(() => {
        setLoading(true);
      });
    } else {
      if (location.pathname !== '/login') {
        navigate('/login', {state: {from: location}});
      }
      setIsLoggedIn(false);
    }
  };
  
  
  const onLogout = () => {
    setUser(null);
    setRoomId(null);
    setRoomIdList([]);
    setIsLoggedIn(false);
    sessionStorage.removeItem(IS_LOGGED_IN);
    sessionStorage.removeItem(REFRESH_TOKEN);
    localStorage.clear();
    navigate('/login');
  };
  
  const setGatewayToRoomId = (resp: User) => {
    let gateways: string[] = [];
    resp.gateways.forEach((gateway: Gateway) => {
      const socketNumber = `${gateway.countryId}${gateway.areaId}${gateway.gatewayId}`;
      gateways.push(socketNumber);
    });
    setGatewayList(resp.gateways);
    
    
    if (gateways.length === 0) {
      window.alert('게이트웨이가 없습니다.');
      return;
    }
    
    
    setRoomIdList([...gateways]);
    
    let ROOMID = localStorage.getItem(ROOM_ID);
    
    const isInRoomId = roomIdList.includes(ROOMID!);
    
    if (ROOMID === null || !isInRoomId) {
      localStorage.setItem(ROOM_ID, gateways[0]);
      setRoomId(gateways[0]);
      setGateway(resp.gateways[0]);
    } else {
      const newGateway = resp.gateways.filter(gateway => gateway.gatewayId === ROOMID);
      setGateway(newGateway[0]);
      setRoomId(ROOMID);
    }
    
  };
  
  if (loading) {
    return (
      <>
        {(location.pathname === '/home' || location.pathname === '/monitorings' || location.pathname === '/setting') &&
          <Header onLogout={onLogout}/>}
        <Routes>
          <Route path="/login" element={
            <Login/>
          }/>
          
          <Route path="/home" element={
            <Home/>
          }/>
          <Route path="/monitorings" element={
            <Monitoring/>
          }/>
          <Route path="/setting" element={
            <Setting/>
          }/>
          <Route path="/" element={
            <Navigate to="/home" replace/>
          }/>
          <Route path="*" element={
            <NoMatch/>
          }/>
        </Routes>
      </>
    );
  } else {
    return (
      <Loading/>
    );
  }
}