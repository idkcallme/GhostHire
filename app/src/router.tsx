import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./shell/RootLayout";
import { Landing } from "./pages/Landing";
import { Jobs } from "./pages/Jobs";
import { PostJob } from "./pages/PostJob";
import { JobDetail } from "./pages/JobDetail";
import { Applications } from "./pages/Applications";
import { Receipt } from "./pages/Receipt";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "jobs", element: <Jobs /> },
      { path: "jobs/:id", element: <JobDetail /> },
      { path: "post", element: <PostJob /> },
      { path: "applications", element: <Applications /> },
      { path: "receipt/:hash", element: <Receipt /> },
    ],
  },
]);
