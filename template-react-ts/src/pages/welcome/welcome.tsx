import { FC } from "react";
import { useNavigate } from "react-router-dom";

import logo from "@/assets/logo.svg";
import { Header } from "@/components/header/header";

import styles from "./welcome.module.less";

export const Welcome: FC = () => {
  const navigate = useNavigate();

  const onContinue = () => navigate("/demo");

  return (
    <div className="text-center">
      <header className={styles.appHeader}>
        <img src={logo} className={styles.appLogo} alt="logo" />
        <Header>🚀 Vite + React Boilerplate</Header>
        <p>
          <button onClick={onContinue}>Continue</button>
        </p>
        <p>
          <a
            className={styles.appLink}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className={styles.appLink}
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
};
