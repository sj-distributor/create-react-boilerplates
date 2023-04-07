import { Route, Routes } from "react-router-dom";

import { Demo } from "@/pages/demo/demo";
import { Welcome } from "@/pages/welcome/welcome";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/demo" element={<Demo />} />
    </Routes>
  );
};
