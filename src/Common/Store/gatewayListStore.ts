import {Gateway} from "../Model/Gateway.model";
import {create} from "zustand";

interface GatewayListStore {
  gatewayList: Gateway[] | null,
  setGatewayList: (gatewayList: (Gateway[] | null)) => void,
}

export const useGatewayListStore = create<GatewayListStore>((set) => ({
  gatewayList: null,
  setGatewayList: (gatewayList) => {
    set({gatewayList})
  },
}));