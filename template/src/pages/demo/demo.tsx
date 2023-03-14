import { FC } from "react";

import { Header } from "@/components/header/header";

import styles from "./demo.module.less";
import { useStore } from "./use-store";

export const Demo: FC = () => {
  const { user, count, onBack, onLogin, isLogin, increment } = useStore();

  return (
    <div className="text-center">
      <div className={styles.demoHeader}>
        {user && <Header>My name is {user.username}</Header>}

        {!isLogin && (
          <p>
            <button onClick={onLogin}>Login</button>
          </p>
        )}

        <p>
          <button onClick={increment}>count is: {count}</button>
        </p>

        <p>
          <button onClick={onBack}>Back</button>
        </p>
      </div>
    </div>
  );
};
