
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
        throw new Error(
          "Login succeeded, but no active session was returned."
        );
      }

      localStorage.setItem(
        "access_token",
        data.session.access_token
      );

      const user = await refreshUser();

      if (!user) {
        throw new Error(
          "Unable to verify your account. Please try again."
        );
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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <div className="bg-blue-700 text-white p-2 rounded-xl">
            <MapPin size={25} />
          </div>
          <span className="text-2xl font-extrabold text-slate-900">
            FixMyStreet
          </span>
        </Link>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Welcome back
          </h1>

          <p className="text-slate-500 mb-8">
            Sign in to access your FixMyStreet account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={19} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-7">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-700 font-bold hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>

        <Link
          to="/"
          className="block text-center text-sm text-slate-500 hover:text-blue-700 mt-6"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
