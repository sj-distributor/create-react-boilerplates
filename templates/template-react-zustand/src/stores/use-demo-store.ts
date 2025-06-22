import { isEmpty } from 'ramda';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IUser {
  id: number;
  username: string;
}

interface IUserState {
  user: IUser;
  login: (user: IUser) => void;
  logout: () => void;
}

export const defaultUser: IUser = {
  id: 0,
  username: '',
};

export const useDemoState = create<IUserState>()(
  persist(
    set => ({
      user: defaultUser,
      login: (user: IUser) => set({ user }),
      logout: () => set({ user: defaultUser }),
    }),
    { name: 'USER_STATE' },
  ),
);

export const isLoginState = create<{ isLogin: boolean }>(set => ({
  isLogin: !isEmpty(useDemoState.getState().user.username),
  subscribeToUserState: useDemoState.subscribe(userState => {
    set({ isLogin: !isEmpty(userState.user.username) });
  }),
}));
