import {Link, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import Weather from "./Weather";
import React, {useEffect} from "react";
import DateTimes from "./dateTimes";
import UserInformation from "./userInformation";
import useSelectedNavStore from "./Store/SelectedNavStore";
import {useUserStore} from "../../Store/userStore";
import {useRoomIdStore} from "../../Store/roomIdStore";
import {useTempDataStore} from "../../Store/tempDataStore";
import {useGatewayStore} from "../../Store/gatewayStore";
import {AUTO_LOGIN, REFRESH_TOKEN} from "../../Const/data.const";

export const Header = ({onLogout}: { onLogout: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRemove = useUserStore(state => state.remove);
  const socketRemove = useRoomIdStore(state => state.remove);
  const user = useUserStore(state => state.user);
  const dataRemove = useTempDataStore(state => state.remove);
  const gateway = useGatewayStore(state => state.gateway);
  const locationArray = gateway?.location?.split(' ');
  const lastWord = locationArray && locationArray[locationArray.length - 1];
  const {selectedNav, setSelectedNav} = useSelectedNavStore(state => state);
  
  const onLogOutClick = () => {
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(AUTO_LOGIN);
    axios.defaults.headers.common['authorization'] = null;
    userRemove();
    socketRemove();
    dataRemove();
    onLogout();
    // socketDisconnection();
    navigate('/login')
  };
  useEffect(() => {
    if (location.pathname === '/home') setSelectedNav(0);
    if (location.pathname === '/monitorings') setSelectedNav(1);
    if (location.pathname === '/setting') setSelectedNav(2);
  }, [user]);
  const onNavClick = (index: number) => {
    setSelectedNav(index);
  }
  return (
    <>
      <header className="header">
        <div className="header__title">스마트 온실 생육 모니터링 시스템</div>
        <nav className="nav">
          <ul className="nav__list">
            <li className={`nav__btn ${selectedNav === 0 ? 'nav__btn--focused' : ''}`}>
              <Link to='/home' onClick={() => onNavClick(0)}>메인</Link>{' '}
            </li>
            <li className={`nav__btn ${selectedNav === 1 ? 'nav__btn--focused' : ''}`}>
              <Link to='/monitorings' onClick={() => onNavClick(1)}>생육 모니터링</Link>{'   '}
            </li>
            <li className={`nav__btn ${selectedNav === 2 ? 'nav__btn--focused' : ''}`}>
              <Link to='/setting' onClick={() => onNavClick(2)}>환경설정</Link>{'   '}
            </li>
          </ul>
        </nav>
        <div className="topSideArea">
          <div className="topSideArea__dateTime"><DateTimes/></div>
          <div className="topSideArea__location">{lastWord}</div>
          <div className="topSideArea__temperature"><Weather/></div>
          <div className="topSideArea__userName">{user?.name} 님</div>
          <button className="logout" onClick={onLogOutClick}>로그아웃</button>
        </div>
      </header>
      <UserInformation/>
    </>
  );
}