
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, User, Mail, Lock, ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    alert("Registration demo successful! Backend registration is not connected yet.");
    navigate("/login");
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
            Create account
          </h1>

          <p className="text-slate-500 mb-7">
            Join your community on FixMyStreet.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your full name"
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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
                  placeholder="At least 8 characters"
                  className="w-full border border-slate-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Enter your password again"
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
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              Create Account <ArrowRight size={19} />
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-700 font-bold hover:underline"
            >
              Sign in
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
