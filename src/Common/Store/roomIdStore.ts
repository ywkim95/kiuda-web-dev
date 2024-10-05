import {create} from "zustand";

interface RoomIdState {
  roomId: string | null;
  roomIdList: string[];
}

interface RoomIdAction {
  setRoomId: (roomId: string | null) => void;
  setRoomIdList: (roomIdList: string[]) => void;
  remove: () => void;
}

export const useRoomIdStore = create<RoomIdState & RoomIdAction> (
  (set) => ({
    roomId: null,
    roomIdList: [],
    setRoomId: (roomId: string | null) => {
      set({roomId: roomId});
    },
    setRoomIdList: (roomIdList: string[]) => {
      set({roomIdList: roomIdList});
    },
    remove: () => {
      set({roomId: null, roomIdList: []});
    }
  }),
);