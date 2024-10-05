import {create} from "zustand";
import {User} from "../Model/User.model";

interface UserState {
  user: User | null;
}

interface UserAction {
  setUser: (user: User | null) => void;
  remove: () => void;
}


export const useUserStore = create<UserState & UserAction>((set) => ({
  user: null,
  setUser: (user: User | null) => {
    set({user: user});
  },
  remove: () => {
    set({user: null});
  },
}));