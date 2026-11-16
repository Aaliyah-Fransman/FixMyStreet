
import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResidentDashboard from "./pages/ResidentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import { initialReports } from "./data/reports";

function App() {
  const [reports, setReports] = useState(initialReports);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ResidentDashboard
              reports={reports}
              setReports={setReports}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminDashboard
              reports={reports}
              setReports={setReports}
            />
          }
        />

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-slate-900">
                  404
                </h1>
                <p className="mt-3 text-slate-500">
                  Page not found.
                </p>
                <a
                  href="/"
                  className="mt-5 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
                >
                  Return Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
