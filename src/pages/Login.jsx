
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Mail, Lock, ArrowRight } from "lucide-react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!data.session?.access_token) {
        throw new Error("Login succeeded, but no active session was returned.");
      }

      localStorage.setItem("access_token", data.session.access_token);

      const user = await refreshUser();

      if (!user) {
        throw new Error("Unable to verify your account. Please try again.");
      }

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (user.role === "resident") {
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Your account has an unrecognised role.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-aside">
        <Link to="/" className="brand text-white">
          <span className="brand-mark"><MapPin /></span>
          fixmy<span className="text-[#c9f36a]">street.</span>
        </Link>

        <div>
          <p className="section-kicker light">
            YOUR VOICE. YOUR NEIGHBOURHOOD.
          </p>

          <h1 className="display-title text-white">
            Good to<br />
            <span className="hero-highlight">see you.</span>
          </h1>

          <p className="text-[#b7c0b0] leading-7 max-w-sm">
            Sign in to follow local reports, share what needs attention
            and keep your community in the loop.
          </p>
        </div>

        <p className="text-xs tracking-widest text-[#859080]">
          COMMUNITY INFRASTRUCTURE REPORTING / 2026
        </p>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <p className="section-kicker">MEMBER ACCESS / 01</p>

          <h2 className="text-3xl font-extrabold tracking-tight mt-3">
            Welcome back.
          </h2>

          <p className="text-sm text-[#7e8577] mt-2 mb-8">
            Enter your details to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="field-label">
              Email address

              <div className="field-icon">
                <Mail size={17} />

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="field-label">
              Password

              <div className="field-icon">
                <Lock size={17} />

                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                />
              </div>
            </label>

            {error && (
              <p className="text-sm text-red-600 font-medium" role="alert">
                {error}
              </p>
            )}

            <button
              className="button-primary w-full mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="text-sm text-center text-[#7c8376] mt-7">
            New to the neighbourhood?{" "}
            <Link to="/register" className="font-bold text-[#627c38]">
              Create an account
            </Link>
          </p>

          <Link
            to="/"
            className="block text-center text-xs text-[#899081] mt-7"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
