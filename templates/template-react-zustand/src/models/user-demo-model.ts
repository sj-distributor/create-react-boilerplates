import { isEmpty } from "ramda";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IUser {
  id: number;
  username: string;
}

type UserState = {
  user: IUser;
  login: (user: IUser) => void;
  logout: () => void;
};

export const defaultUser: IUser = {
  id: 0,
  username: "",
};

export const userState = create<UserState>()(
  persist(
    (set) => ({
      user: defaultUser,
      login: (user: IUser) => set({ user }),
      logout: () => set({ user: defaultUser }),
    }),
    { name: "USER_STATE" },
  ),
);

export const isLoginState = create<{ isLogin: boolean }>((set) => ({
  isLogin: !isEmpty(userState.getState().user.username),
  subscribeToUserState: userState.subscribe((userState) => {
    set({ isLogin: !isEmpty(userState.user.username) });
  }),
}));
