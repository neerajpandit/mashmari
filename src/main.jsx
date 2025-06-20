import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Dashmain from "./pages/Dashmain.jsx";
import Projectlog from "./pages/Projectlog.jsx";
import  ViewLogs  from "./pages/ViewLogs.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx"; // ✅ import this

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ✅ Public Route */}
      <Route path="/" element={<Login />} />

      {/* ✅ Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashmain" element={<Dashmain />} />
        <Route path="/projectlog" element={<Projectlog />} />
        <Route path="/logs" element={<Dashboard />} />        
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
