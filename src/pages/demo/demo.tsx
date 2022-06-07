import { useRequest } from "ahooks";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "@/components/header/header";
import useCounter from "@/hooks/use-counter";
import { getUserApi } from "@/services/api/api";

import styles from "./demo.module.less";

export const Demo: FC = () => {
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

  return (
    <div className="text-center">
      <header className={styles.demoHeader}>
        <Header>Demo</Header>
        <p>
          <button onClick={increment}>count is: {count}</button>
        </p>
        <p>
          <button onClick={onWhoIAm}>who i am {name && `: ${name}`}</button>
        </p>
        <p>
          <button onClick={onBack}>back</button>
        </p>
      </header>
    </div>
  );
};
