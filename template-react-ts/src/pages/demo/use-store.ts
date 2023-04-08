import { useRequest } from "ahooks";
import { useNavigate } from "react-router-dom";

import useCounter from "@/hooks/use-counter";
import { getUserApi } from "@/services/api/api";
import { useState } from "react";

export const useStore = () => {
  const { count, increment } = useCounter(0);

  const [name, setName] = useState<string>();

  const navigate = useNavigate();

  const getUserRequest = useRequest(getUserApi, {
    manual: true,
    onSuccess: (result) => {
      setName(result.name);
    },
    onError: (error) => {
      console.warn(error.message);
    },
  });

  const onBack = () => navigate("/");

  const onWhoIAm = () => getUserRequest.run(1);

  return {
    name,
    count,
    onBack,
    onWhoIAm,
    increment,
  };
};
