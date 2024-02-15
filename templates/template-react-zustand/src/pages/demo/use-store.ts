import { useRequest } from "ahooks";
import { useNavigate } from "react-router-dom";

import useCounter from "@/hooks/use-counter";
import { isLoginState, userState } from "@/models";
import { getUserApi } from "@/services/api/api";

export const useStore = () => {
  const navigate = useNavigate();

  const { count, increment } = useCounter(0);

  const { isLogin } = isLoginState();

  const { user, login, logout } = userState();

  const getUserRequest = useRequest(getUserApi, {
    manual: true,
    onSuccess: (result) => {
      login({
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

  const onLogout = () => logout();

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
