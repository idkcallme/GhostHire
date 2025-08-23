import { createBrowserRouter } from "react-router-dom";
import { SimpleRootLayout } from "./shell/SimpleRootLayout";
import { SimpleLanding } from "./pages/SimpleLanding";
import { SimplePostJobPage } from "./pages/SimplePostJobPage";
import { SimpleJobDetailPage } from "./pages/SimpleJobDetailPage";
import { SimpleApplicationsPage } from "./pages/SimpleApplicationsPage";
import { Receipt } from "./pages/Receipt";
import { SimpleJobListPage } from "./pages/SimpleJobListPage";
import { SimpleApplyPage } from "./pages/SimpleApplyPage";
import { ConnectWalletPage } from "./pages/ConnectWalletPage";
import { HomePage } from "./pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SimpleRootLayout />,
    children: [
      {
        index: true,
        element: <SimpleLanding />,
      },
      { path: "home", element: <HomePage /> },
      { path: "jobs", element: <SimpleJobListPage /> },
      { path: "jobs/:id", element: <SimpleJobDetailPage /> },
      { path: "jobs/:jobId/apply", element: <SimpleApplyPage /> },
      { path: "post", element: <SimplePostJobPage /> },
      { path: "applications", element: <SimpleApplicationsPage /> },
      { path: "connect", element: <ConnectWalletPage /> },
      { path: "receipt/:hash", element: <Receipt /> },
    ],
  },
]);
