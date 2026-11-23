import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResidentDashboard from "./pages/ResidentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { initialReports } from "./data/reports";
export default function App() {
 const [reports,setReports]=useState(initialReports);
 return <BrowserRouter><Routes>
 <Route path="/" element={<Home reports={reports}/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
 <Route path="/dashboard" element={<ResidentDashboard reports={reports} setReports={setReports}/>}/><Route path="/admin" element={<AdminDashboard reports={reports} setReports={setReports}/>}/>
 <Route path="*" element={<main className="min-h-screen grid place-items-center bg-[#f5f4ee]"><div className="text-center"><p className="eyebrow">404 / Not found</p><h1 className="display-title text-6xl">Wrong turn.</h1><a className="button-primary mt-6 inline-flex" href="/">Back home</a></div></main>}/>
 </Routes></BrowserRouter>;
}