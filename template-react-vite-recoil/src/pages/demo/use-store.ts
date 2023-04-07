import { useRequest } from "ahooks";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import useCounter from "@/hooks/use-counter";
import { defaultUser, isLoginState, userState } from "@/models";
import { getUserApi } from "@/services/api/api";
export const useStore = () => {
  const navigate = useNavigate();

  const { count, increment } = useCounter(0);

  const isLogin = useRecoilValue(isLoginState);

  const [user, setUser] = useRecoilState(userState);

  const getUserRequest = useRequest(getUserApi, {
    manual: true,
    onSuccess: (result) => {
      setUser({
        id: result.id,
        username: result.name,
      });
    },
    onError: (error) => {
      console.warn(error.message);
    },
  });

  const onBack = () => navigate("/");

  const onLogin = () => getUserRequest.run(1);

  const onLogout = () => setUser(defaultUser);

  return {
    user,
    count,
    onBack,
    onLogin,
    isLogin,
    onLogout,
    increment,
  };
};
