import "./app.css";

import logo from "@/assets/logo.svg";
import { Button } from "@/components/button";
import useCounter from "@/hooks/use-counter";

function App() {
  const { count, increment } = useCounter(0);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="App-body">🚀 Vite + React Boilerplate</p>
        <p>
          <Button type="button" onClick={increment}>
            count is: {count}
          </Button>
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
}

export default App;
