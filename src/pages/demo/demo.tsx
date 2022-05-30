import "./demo.css";

import { useRequest } from "ahooks";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "@/components/header/header";
import useCounter from "@/hooks/use-counter";
import { getUserApi } from "@/services/api/api";

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

  const onBack = () => navigate("/welcome");

  const onWhoIAm = () => getUserRequest.run(1);

  return (
    <div className="Demo">
      <header className="Demo-header">
        <Header>Demo</Header>
        <p>
          <button type="button" onClick={increment}>
            count is: {count}
          </button>
        </p>
        <p>
          <button type="button" onClick={onWhoIAm}>
            who i am {name && `: ${name}`}
          </button>
        </p>
        <p>
          <button type="button" onClick={onBack}>
            back
          </button>
        </p>
      </header>
    </div>
  );
};
