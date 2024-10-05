import { useCallback } from "react";
import { useGatewayListStore } from "../../../Store/gatewayListStore";
import { useGatewayStore } from "../../../Store/gatewayStore";
import { Gateway } from "../../../Model/Gateway.model";

const useChangeGateway = () => {
  const gatewayList = useGatewayListStore((state) => state.gatewayList);
  const setGateway = useGatewayStore((state) => state.setGateway);
  const changeGateway = useCallback(
    (roomId: string) => {
      if (gatewayList) {
        const gateway = gatewayList.find(
          (value: Gateway) =>
            roomId === `${value.countryId}${value.areaId}${value.gatewayId}`
        );
        if (gateway) {
          setGateway(gateway);
        } else {
          console.log("해당하는 게이트웨이가 없습니다.");
        }
      }
    },
    [gatewayList, setGateway]
  );

  return changeGateway;
};

export default useChangeGateway;
