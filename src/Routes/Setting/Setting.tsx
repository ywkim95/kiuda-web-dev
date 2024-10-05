import React, {useEffect, useState} from 'react';
import axios from "axios";
import Sensors from "./Component/Sensors";
import Controllers from "./Component/Controllers";
import {useUserStore} from "../../Common/Store/userStore";
import {useSettingStore} from "../../Common/Store/settingStore";
import {ClassifyEnum} from "./Const/Classify.enum";
import {Device} from "../../Common/Model/Device.model";
import { useRoomIdStore } from '../../Common/Store/roomIdStore';
import Loading from '../../Loading';

const Setting = () => {
  const roomId = useRoomIdStore(state => state.roomId);
  const user = useUserStore(state => state.user);
  const {setting, setSetting} = useSettingStore(state => state);
  const [reverseSetting, setReverseSetting] = useState<Device[]>([]);
  useEffect(() => {
    if (user && roomId) {
      initSetting(roomId);
    }
    return () => {
    };
  }, [user, roomId]);
  
  const initSetting = async (roomId: string) => {
    try {
      const resp = await axios.get(`/settings/${roomId}`);
      setSetting(resp.data);
      setReverseSetting([...resp.data].reverse());
    } catch (e) {
      console.log(e);
    }
  }
  
  return (
    <>
      {
        setting.length === 0 && reverseSetting.length === 0 ?
          (<Loading />) :
          (
            <div className="settings-screen">
              {
                reverseSetting.map((value, index) => {
                  if (value.classify === ClassifyEnum.CONTROLLER) {
                    return (
                      <Controllers value={value} key={value.id}/>
                    )
                  } else if (value.classify === ClassifyEnum.SENSOR) {
                    return (
                      <Sensors key={value.id} value={value}/>
                    )
                  } else {
                    return null;
                  }
                })
              }
              {/*<Sensors/>*/}
            </div>
          )
      }
    </>
  );
};

export default Setting;