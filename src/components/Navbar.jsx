import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MapPin, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    ["The mission", "/#about"],
    ["Explore reports", "/#area-search"],
  ];

  return (
    <header className="site-nav">
      <div className="nav-inner">

        <Link to="/" className="brand">
          <span className="brand-mark">
            <MapPin size={19} />
          </span>

          <span>
            fixmy<span className="brand-accent">street.</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map(([label, path]) => (
            <a key={path} href={path} className="nav-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="nav-login">
            Log in
          </Link>

          <Link to="/register" className="button-primary nav-cta">
            Join Your Neighbourhood
            <ArrowUpRight size={16} />
          </Link>
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
            <a
              key={path}
              href={path}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}

          <Link to="/login" onClick={() => setOpen(false)}>
            Log in
          </Link>

          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="button-primary"
          >
            Join Your Neighbourhood
          </Link>
        </div>
      )}
    </header>
  );
}