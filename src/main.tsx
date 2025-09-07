
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { ThemeProvider } from "./components/ThemeProvider";
  import { createBrowserRouter, RouterProvider } from "react-router-dom";

  const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/collection", element: <App /> },
    { path: "/collection/*", element: <App /> },
    { path: "/statistics", element: <App /> },
    { path: "/statistics/*", element: <App /> },
    { path: "/devices", element: <App /> },
    { path: "/devices/scan", element: <App /> },
    { path: "/devices/records", element: <App /> },
    { path: "/profile", element: <App /> },
    { path: "/profile/:section", element: <App /> },
    { path: "/profile/:section/*", element: <App /> },
    { path: "*", element: <App /> },
  ]);

  createRoot(document.getElementById("root")!).render(
    <ThemeProvider defaultTheme="dark">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
  
