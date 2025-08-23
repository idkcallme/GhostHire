import { createBrowserRouter } from "react-router-dom";
import { SimpleRootLayout } from "./shell/SimpleRootLayout-test";
import { Landing } from "./pages/Landing-simple";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SimpleRootLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
    ],
  },
]);
