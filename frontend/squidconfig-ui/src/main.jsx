import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import LoginPage from "./routes/LoginPage.jsx";
import Home from "./routes/Home.jsx";
import AclsPage from "./routes/AclsPage.jsx";
import BandWidthRulesPage from "./routes/BandWidthRulesPage.jsx";
import CacheRulesPage from "./routes/CacheRulesPage.jsx";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "acls",
        element: <AclsPage />,
      },
      {
        path: "bandwidth-rules",
        element: <BandWidthRulesPage />,
      },
      {
        path: "cache-rules",
        element: <CacheRulesPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
