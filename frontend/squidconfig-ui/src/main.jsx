import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import LoginPage from "./routes/LoginPage.jsx";
import HomePage from "./routes/HomePage.jsx";
import AclsPage from "./routes/AclsPage.jsx";
import BandWidthRulesPage from "./routes/BandWidthRulesPage.jsx";
import CacheRulesPage from "./routes/CacheRulesPage.jsx";
import ServerPage from "./routes/ServerPage.jsx";
import UsersPage from "./routes/UsersPage.jsx";

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
        element: <HomePage />,
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
      {
        path: "server",
        element: <ServerPage />,
      },
      {
        path: "network-users",
        element: <UsersPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
