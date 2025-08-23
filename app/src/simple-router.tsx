import { createBrowserRouter } from "react-router-dom";

function SimpleLanding() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Simple Landing Page</h1>
      <p>This is a test landing page to isolate router issues.</p>
    </div>
  );
}

function SimpleLayout() {
  return (
    <div>
      <nav style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
        <a href="/">Home</a>
      </nav>
      <main>
        <SimpleLanding />
      </main>
    </div>
  );
}

export const simpleRouter = createBrowserRouter([
  {
    path: "/",
    element: <SimpleLayout />,
  },
]);
