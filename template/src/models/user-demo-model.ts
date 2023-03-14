import { isEmpty } from "ramda";
import { selector } from "recoil";

import { atomWithStorage } from "@/utils/recoil-utils";

interface IUser {
  id: number;
  username: string;
}

// 默认用户信息
const defaultUser: IUser = {
  id: 0,
  username: "",
};

export const userState = atomWithStorage<IUser>({
  key: "userState",
  storageKey: "USER_STATE",
  default: defaultUser,
});

export const isLoginState = selector({
  key: "isLoginState",
  get: ({ get }) => {
    const user = get(userState);

    return !isEmpty(user.id);
  },
});
