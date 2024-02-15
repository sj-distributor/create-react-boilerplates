import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { Router } from "./routes";

export const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};
