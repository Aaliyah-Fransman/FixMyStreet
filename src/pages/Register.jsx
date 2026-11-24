import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    area_id: "",
    role: "resident",
    admin_invitation_code: "",
  });

  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await apiRequest("/areas");
        setAreas(data.areas || []);
      } catch (err) {
        setError("Unable to load municipalities. Please refresh the page.");
      } finally {
        setAreasLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (formData.password.length < 8) {
      setError("Your password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!formData.area_id) {
      setError("Please select your municipality.");
      return;
    }

    if (
      formData.role === "admin" &&
      !formData.admin_invitation_code.trim()
    ) {
      setError("Please enter the administrator invitation code.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          password: formData.password,
          area_id: formData.area_id,
          role: formData.role,
          admin_invitation_code: formData.admin_invitation_code,
        }),
      });

      // Automatically log in if Supabase returns an active session.
      if (data.session?.access_token) {
        localStorage.setItem(
          "access_token",
          data.session.access_token
        );

        if (data.session.refresh_token) {
          localStorage.setItem(
            "refresh_token",
            data.session.refresh_token
          );
        }

        const user = await refreshUser();

        if (!user) {
          throw new Error(
            "Your account was created, but we could not start your session. Please log in."
          );
        }

        navigate(user.role === "admin" ? "/admin" : "/dashboard", {
          replace: true,
        });

        return;
      }

      // Email verification is required before login.
      setMessage(
        data.message ||
          "Your account was created. Please verify your email before logging in."
      );
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-aside">
        <Link to="/" className="brand text-white">
          <span className="brand-mark">
            <MapPin />
          </span>
          fixmy<span className="text-[#c9f36a]">street.</span>
        </Link>

        <div>
          <p className="section-kicker light">
            BETTER STREETS START TOGETHER.
          </p>

          <h1 className="display-title text-white">
            Be part
            <br />
            of the <span className="hero-highlight">change.</span>
          </h1>

          <p className="text-[#b7c0b0] leading-7 max-w-sm">
            Join your neighbours in making local infrastructure issues
            visible and easier to follow.
          </p>
        </div>

        <p className="text-xs tracking-widest text-[#859080]">
          COMMUNITY INFRASTRUCTURE REPORTING / 2026
        </p>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <p className="section-kicker">JOIN THE COMMUNITY / 02</p>

          <h2 className="text-3xl font-extrabold tracking-tight mt-3">
            Create your account.
          </h2>

          <p className="text-sm text-[#7e8577] mt-2 mb-7">
            A few details and you're ready to take part.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="field-label">
              Full name

              <div className="field-icon">
                <User size={17} />

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="Your full name"
                />
              </div>
            </label>

            <label className="field-label">
              Email address

              <div className="field-icon">
                <Mail size={17} />

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="field-label">
              Municipality

              <select
                required
                value={formData.area_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    area_id: e.target.value,
                  })
                }
                disabled={areasLoading || areas.length === 0}
                className="w-full border border-[#d8dccf] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9f36a] disabled:bg-[#f0f1eb]"
              >
                <option value="">
                  {areasLoading
                    ? "Loading municipalities..."
                    : areas.length === 0
                    ? "No municipalities available"
                    : "Select your municipality"}
                </option>

                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.municipality}, {area.province}
                  </option>
                ))}
              </select>
            </label>

            {/* ACCOUNT TYPE */}
            <label className="field-label">
              Account type

              <select
                required
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                    admin_invitation_code: "",
                  })
                }
                className="w-full border border-[#d8dccf] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#c9f36a]"
              >
                <option value="resident">Resident</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            {/* ADMIN INVITATION CODE */}
            {formData.role === "admin" && (
              <label className="field-label">
                Administrator invitation code

                <div className="field-icon">
                  <ShieldCheck size={17} />

                  <input
                    type="password"
                    required
                    value={formData.admin_invitation_code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        admin_invitation_code: e.target.value,
                      })
                    }
                    placeholder="Enter your invitation code"
                  />
                </div>

                <span className="text-xs text-[#858b7e]">
                  An authorised invitation code is required to register
                  as an administrator.
                </span>
              </label>
            )}

            <label className="field-label">
              Password

              <div className="field-icon">
                <Lock size={17} />

                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  placeholder="At least 8 characters"
                />
              </div>
            </label>

            <label className="field-label">
              Confirm password

              <div className="field-icon">
                <Lock size={17} />

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
                  placeholder="Enter password again"
                />
              </div>
            </label>

            {error && (
              <p
                className="text-sm text-red-600 font-medium"
                role="alert"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                className="text-sm text-green-700 font-medium"
                role="status"
              >
                {message}
              </p>
            )}

            <button
              className="button-primary w-full mt-2"
              type="submit"
              disabled={loading || areasLoading || areas.length === 0}
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="text-sm text-center text-[#7c8376] mt-6">
            Already a member?{" "}
            <Link
              to="/login"
              className="font-bold text-[#627c38]"
            >
              Log in
            </Link>
          </p>

          <Link
            to="/"
            className="block text-center text-xs text-[#899081] mt-6"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}