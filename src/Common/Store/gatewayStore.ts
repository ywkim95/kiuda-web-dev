import {Gateway} from "../Model/Gateway.model";
import {create} from "zustand";

interface GatewayStore {
  gateway: Gateway | null,
  setGateway: (gateway: Gateway | null) => void,
}

export const useGatewayStore = create<GatewayStore>((set) => ({
  gateway: null,
  setGateway: (gateway) => {
    set({gateway})
  },
}));