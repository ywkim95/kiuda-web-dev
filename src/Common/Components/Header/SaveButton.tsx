import React from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import useSelectedNavStore from "./Store/SelectedNavStore";
import {ROOM_ID} from "../../Const/data.const";
import {useSettingStore} from "../../Store/settingStore";

const SaveButton = () => {
  const navigate = useNavigate();
  const setting = useSettingStore(state => state.setting);
  const roomId = localStorage.getItem(ROOM_ID);
  const setSelectedNav = useSelectedNavStore(state => state.setSelectedNav);
  const onClick = async () => {
    const response = await axios.patch(`/settings/${roomId}`, setting);
    navigate("/home");
    setSelectedNav(0);
  }
  return (
    <button onClick={onClick} className="refresh">
      <div className="refresh__iconBox">
        <img src="/assets/icon/monitoring/ic_save.png" alt="저장 아이콘" className="refresh__icon"/>
      </div>
      <span className="refresh__text">저장</span>
    </button>
  );
};

export default SaveButton;