import { FC } from "react";

import { Header } from "@/components/header/header";

import styles from "./demo.module.less";
import { useStore } from "./use-store";

export const Demo: FC = () => {
  const { name, count, onBack, onWhoIAm, increment } = useStore();

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
