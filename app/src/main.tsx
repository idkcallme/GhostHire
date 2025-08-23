import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SimpleThemeProvider } from "./components/SimpleThemeProvider";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SimpleThemeProvider>
      <RouterProvider router={router} />
    </SimpleThemeProvider>
  </React.StrictMode>
);
