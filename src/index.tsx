import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
// import AppRouter from "./routes/Router";
import { store } from "./redux/Store";
import { Provider } from "react-redux";
// it is use for dot env for future
// require("dotenv").config({ path: "../environment/.env.production" });
import "react-datepicker/dist/react-datepicker.css";
import "./style/Index.css";
import "./style/Custom.css";
import "./style/Style.css";
import "./style/Media.css";
import "./style/ThemeTypo.css";
import "./i18n";
import ErrorBoundary from "./core-component/error-boundary/ErrorBoundaryView";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>
);

// Use ReactDOM.render if you're not using Concurrent Mode
// ReactDOM.render(app, rootElement);

// Use ReactDOM.createRoot if you're using Concurrent Mode
// const root = ReactDOM.createRoot(rootElement);
// root.render(app);
