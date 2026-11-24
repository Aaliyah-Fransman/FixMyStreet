
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  MapPin,
  ArrowUpRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const role = user?.role?.toLowerCase();
  const dashboardPath = role === "admin" ? "/admin" : "/dashboard";

  const fullName =
    user?.full_name ||
    user?.name ||
    user?.email ||
    "My Account";

  const email = user?.email || "";

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const closeMenus = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenus();
  };

  const links = [
    ["The mission", "/#about"],
    ["Explore reports", "/#area-search"],
  ];

  return (
    <header className="site-nav">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={closeMenus}>
          <span className="brand-mark">
            <MapPin size={19} />
          </span>
          <span>
            fixmy<span className="brand-accent">street.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              className="nav-link"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!loading && !user && (
            <>
              <Link to="/login" className="nav-login">
                Sign in
              </Link>

              <Link
                to="/register"
                className="button-primary nav-cta"
              >
                Join your neighbourhood
                <ArrowUpRight size={16} />
              </Link>
            </>
          )}

          {!loading && user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-full border border-[#e4e7dd] bg-white px-3 py-2 hover:border-[#c9f36a] transition"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c9f36a] text-sm font-bold text-[#263124]">
                  {initials || <UserCircle size={20} />}
                </span>

                <span className="text-left">
                  <span className="block text-sm font-bold text-[#263124]">
                    {fullName}
                  </span>
                  <span className="block text-xs text-[#7e8577] capitalize">
                    {role || "Member"}
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className="text-[#7e8577]"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-[#e5e8df] bg-white p-4 shadow-xl">
                  <div className="border-b border-[#edf0e8] pb-4">
                    <p className="font-bold text-[#263124]">
                      {fullName}
                    </p>

                    <p className="mt-1 text-sm text-[#7e8577]">
                      {email}
                    </p>

                    <span className="mt-3 inline-block rounded-full bg-[#edf5df] px-3 py-1 text-xs font-semibold capitalize text-[#526b30]">
                      {role || "Member"} account
                    </span>
                  </div>

                  <Link
                    to={dashboardPath}
                    onClick={closeMenus}
                    className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#263124] hover:bg-[#f4f6ef]"
                  >
                    <LayoutDashboard size={18} />
                    My Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="mobile-nav">
          {links.map(([label, path]) => (
            <Link
              key={path}
              to={path}
              onClick={closeMenus}
            >
              {label}
            </Link>
          ))}

          {!loading && !user && (
            <>
              <Link to="/login" onClick={closeMenus}>
                Sign in
              </Link>

              <Link
                to="/register"
                onClick={closeMenus}
                className="button-primary"
              >
                Join your neighbourhood
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <div className="border-t border-[#e5e8df] pt-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9f36a] font-bold text-[#263124]">
                    {initials || <UserCircle size={20} />}
                  </span>

                  <div>
                    <p className="font-bold text-[#263124]">
                      {fullName}
                    </p>
                    <p className="text-xs text-[#7e8577] capitalize">
                      {role || "Member"}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-sm text-[#7e8577]">
                  {email}
                </p>
              </div>

              <Link
                to={dashboardPath}
                onClick={closeMenus}
              >
                My Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-left font-semibold text-red-600"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
