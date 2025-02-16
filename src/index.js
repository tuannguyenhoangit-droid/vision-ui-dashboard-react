/*!

=========================================================

=========================================================







=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

*/

if (process.env.REACT_APP_ENV === "production") {
  console.log = () => {};
}

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { store } from "./app-redux/app";
import { Provider } from "react-redux";

import { VisionUIControllerProvider } from "context";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <VisionUIControllerProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </VisionUIControllerProvider>
  </BrowserRouter>
);
