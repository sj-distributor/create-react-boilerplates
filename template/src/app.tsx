import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import * as models from "./models";
import { Router } from "./routes";
import {
  IAtomInitState,
  setupStoreageState,
  withInitializeState,
} from "./utils/recoil-utils";

function App() {
  const [initState, setInitState] = useState<IAtomInitState[] | undefined>(
    undefined
  );

  useEffect(() => {
    setupStoreageState(models)
      .then(setInitState)
      .catch(() => null);
  }, []);

  if (!initState) return null;

  return (
    <RecoilRoot initializeState={withInitializeState(initState)}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
