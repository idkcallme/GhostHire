import { createBrowserRouter } from "react-router-dom";
import { Outlet } from "react-router-dom";

function TestLayout() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
        <h2>Test Layout Working</h2>
      </header>
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

function TestLanding() {
  return (
    <div>
      <h1>Test Landing Page</h1>
      <p>If you see this, the isolated router is working!</p>
    </div>
  );
}

export const testRouter = createBrowserRouter([
  {
    path: "/",
    element: <TestLayout />,
    children: [
      {
        index: true,
        element: <TestLanding />,
      },
    ],
  },
]);
