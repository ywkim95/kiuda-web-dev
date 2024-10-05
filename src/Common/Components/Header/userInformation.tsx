import React from "react";
import SortingBox from "./SortingBox";
import SaveButton from "./SaveButton";
import RefreshButton from "./RefreshButton";
import { useLocation } from "react-router-dom";
import { useGatewayListStore } from "../../Store/gatewayListStore";
import { useUserStore } from "../../Store/userStore";
import useSelectedSensorStore from "../../../Routes/Home/Store/selectedSensorStore";
import { useSensorDeviceListStore } from "../../Store/sensorDeviceListStore";
import SensorSortingBox from "./SensorSortingBox";

const UserInformation = () => {
  const location = useLocation();
  const gatewayList = useGatewayListStore((state) => state.gatewayList);
  const sensorList = useSensorDeviceListStore((state) => state.sensorList);
  const user = useUserStore((state) => state.user);

  return (
    <div className="user-information">
      <div className="user-information__title">
        <span className="user-information__name">{user?.name}</span>
        <span className="user-information__nameTitle">님</span>

        {gatewayList !== null && <SortingBox gatewayList={gatewayList!} />}
        {sensorList !== null && <SensorSortingBox sensorList={sensorList!} />}
      </div>
      {location.pathname === "/setting" ? (
        <SaveButton />
      ) : (
        <RefreshButton Refresh={() => {}} />
      )}
    </div>
  );
};

export default UserInformation;
