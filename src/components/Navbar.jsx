
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Reports", path: "/dashboard" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-700 text-white p-2 rounded-xl">
            <MapPin size={22} />
          </div>
          <span className="text-xl font-bold text-slate-900">
            FixMyStreet
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium ${
                location.pathname === link.path
                  ? "text-blue-700"
                  : "text-slate-600 hover:text-blue-700"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/login"
            className="font-medium text-slate-600 hover:text-blue-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden text-slate-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-6 pb-5 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className="text-slate-700 font-medium"
            >
              {link.name}
            </Link>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="bg-blue-700 text-white text-center py-3 rounded-xl"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
