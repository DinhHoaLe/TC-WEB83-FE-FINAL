import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashSachLamViec from "./DanhSachLamViec/danhSachLamViec.jsx"; 
import DashSachViTriLamViec from "./DanhSachViTriLamViec/danhSachViTriLamViec.jsx";

// Cấu hình router
const adminRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Thành phần cha, có thể là App hoặc Layout component
    children: [
      {
        path: "danh-sach-lam-viec",
        element: <DashSachLamViec />,
      },
      {
        path: "danh-sach-vi-tri-lam-viec",
        element: <DashSachViTriLamViec />,
      },
    ],
  },
]);

// Tạo root và render với RouterProvider
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={adminRouter} />
  </React.StrictMode>
);

reportWebVitals();
