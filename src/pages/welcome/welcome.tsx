import "./welcome.css";

import { FC } from "react";
import { useNavigate } from "react-router-dom";

import logo from "@/assets/logo.svg";
import { Header } from "@/components/header/header";

export const Welcome: FC = () => {
  const navigate = useNavigate();

  const onContinue = () => navigate("/demo");

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Header>🚀 Vite + React Boilerplate</Header>
        <p>
          <button onClick={onContinue}>Continue</button>
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
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
