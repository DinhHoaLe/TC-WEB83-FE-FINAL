import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import DanhSachLamViec from "./DanhSachLamViec/danhSachLamViec.jsx";
import DanhSachViTriLamViec from "./DanhSachViTriLamViec/danhSachViTriLamViec.jsx";

const App = () => {
  return (
    <div className="h-screen flex w-full ">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="p-4 font-bold text-lg">Menu</div>
        <ul className="flex flex-col space-y-2 p-4">
          <li>
            <Link
              to="/danh-sach-lam-viec"
              className="block p-2 rounded hover:bg-blue-600 transition-colors"
            >
              Giáo Viên
            </Link>
          </li>
          <li>
            <Link
              to="/danh-sach-vi-tri-lam-viec"
              className="block p-2 rounded hover:bg-blue-600 transition-colors"
            >
              Vị Trí Công Tác
            </Link>
          </li>
        </ul>
      </aside>

      <main className="flex flex-col w-full overflow-hidden ">
        <Routes>
          <Route path="/danh-sach-lam-viec" element={<DanhSachLamViec />} />
          <Route
            path="/danh-sach-vi-tri-lam-viec"
            element={<DanhSachViTriLamViec />}
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
