import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  ClipboardList,
  Clock,
  CheckCircle2,
  X,
  Save,
  MapPin,
  Mail,
  ShieldCheck,
  Phone,
  LogOut,
  ImageOff,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  description: "",
  category_id: "",
  location: "",
  status: "Pending",
  priority: "Medium",
};

function normaliseReport(report) {
  const category = Array.isArray(report.categories)
    ? report.categories[0]
    : report.categories;

  return {
    ...report,
    category: category?.name || "Uncategorised",
    location: report.location || report.suburb || "Location not provided",
    date: report.created_at
      ? new Date(report.created_at).toLocaleDateString("en-ZA")
      : "Date unavailable",
  };
}

export default function AdminDashboard({ reports, setReports }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("access_token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    async function loadDashboard() {
      if (!token) {
        setError("Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const [reportData, categoryData] = await Promise.all([
          apiRequest("/reports", { headers }),
          apiRequest("/categories", { headers }),
        ]);

        setReports((reportData.reports || []).map(normaliseReport));
        setCategories(categoryData.categories || []);
      } catch (err) {
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [setReports, token]);

  const pending = reports.filter(r => r.status === "Pending").length;
  const inProgress = reports.filter(r => r.status === "In Progress").length;
  const resolved = reports.filter(r => r.status === "Resolved").length;

  const stats = [
    ["Total reports", reports.length, ClipboardList],
    ["Pending", pending, Clock],
    ["In progress", inProgress, Clock],
    ["Resolved", resolved, CheckCircle2],
  ];

  function openForm(report) {
    setEditingId(report?.id ?? null);

    setFormData(
      report
        ? {
            title: report.title || "",
            description: report.description || "",
            category_id: report.category_id || "",
            location: report.location || "",
            status: report.status || "Pending",
            priority: report.priority || "Medium",
          }
        : emptyForm
    );

    setError("");
    setSuccessMessage("");
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setSubmitting(true);

    try {
      const reportDetails = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: formData.category_id,
        location: formData.location.trim(),
        priority: formData.priority,
      };

      if (editingId !== null) {
        await apiRequest(`/reports/${editingId}`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(reportDetails),
        });

        await apiRequest(`/reports/${editingId}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: formData.status }),
        });

        setSuccessMessage("Report updated successfully!");
      } else {
        const result = await apiRequest("/reports", {
          method: "POST",
          headers,
          body: JSON.stringify(reportDetails),
        });

        if (formData.status !== "Pending" && result.report?.id) {
          await apiRequest(`/reports/${result.report.id}/status`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ status: formData.status }),
          });
        }

        setSuccessMessage("Report created successfully!");
      }

      const reportData = await apiRequest("/reports", { headers });
      setReports((reportData.reports || []).map(normaliseReport));

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message || "Unable to save the report.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteReport(id) {
    if (!window.confirm("Are you sure you want to delete this report?")) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      await apiRequest(`/reports/${id}`, {
        method: "DELETE",
        headers,
      });

      setReports(previous => previous.filter(report => report.id !== id));
      setSuccessMessage("Report deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete the report.");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f4ee] px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-wrap justify-between items-end gap-5 mb-9">
            <div>
              <p className="section-kicker">ADMINISTRATION / CONTROL ROOM</p>

              <h1 className="text-4xl font-extrabold tracking-tight mt-3 text-[#202820]">
                Report <em className="font-serif font-medium text-[#80964d]">management.</em>
              </h1>

              <p className="text-sm text-[#777e70] mt-3">
                Review incoming community reports and keep their status up to date.
              </p>
            </div>

            <button onClick={() => openForm()} className="button-primary">
              <Plus size={18} /> Add a report
            </button>
          </div>

          {/* ADMIN PROFILE */}

          <section className="bg-white border border-[#e1e3d9] rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#eaf0dc] flex items-center justify-center text-[#526b32]">
                  <ShieldCheck size={27} />
                </div>

                <div>
                  <p className="section-kicker">ADMINISTRATOR PROFILE</p>

                  <h2 className="text-xl font-bold text-[#202820] mt-1">
                    {user?.full_name || user?.name || "Administrator"}
                  </h2>

                  <p className="text-xs text-[#71805d] mt-1 flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Logged in · Administrator
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#202820] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#3b4b35] hover:shadow-md"
              >
                <LogOut size={17} />
                <span>Log out</span>
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#eceee6]">
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-[#80964d]" />
                <div>
                  <p className="text-xs text-[#929889]">Email address</p>
                  <p className="text-sm font-medium text-[#303b2c]">
                    {user?.email || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={17} className="text-[#80964d]" />
                <div>
                  <p className="text-xs text-[#929889]">Assigned area</p>
                  <p className="text-sm font-medium text-[#303b2c]">
                    {user?.suburb || "Area not specified"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SUPPORT CONTACTS */}

          <section className="bg-[#202820] text-white rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={18} className="text-[#c9f36a]" />
              <h2 className="font-bold">FixMyStreet support contacts</h2>
            </div>

            <p className="text-sm text-[#c8cec0] mb-5">
              Contact the FixMyStreet team if you need assistance with the platform.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <a
                href="mailto:fixmystreet@gmail.com"
                className="flex items-center gap-3 text-sm hover:text-[#c9f36a] transition"
              >
                <Mail size={17} className="text-[#c9f36a]" />
                fixmystreet@gmail.com
              </a>

              <a
                href="tel:+27811477813"
                className="flex items-center gap-3 text-sm hover:text-[#c9f36a] transition"
              >
                <Phone size={17} className="text-[#c9f36a]" />
                +27 81 147 7813
              </a>
            </div>

            <p className="text-xs text-[#aeb8a5] mt-5">
              These are platform support contacts, not emergency services.
              For immediate danger, contact the appropriate emergency services.
            </p>
          </section>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* REPORT STATISTICS */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {stats.map(([label, value, Icon]) => (
              <div key={label} className="bg-white border border-[#e2e4da] rounded-lg p-5">
                <div className="flex justify-between items-center text-xs text-[#858b7d]">
                  <span>{label}</span>
                  <Icon size={17} className="text-[#80964d]" />
                </div>

                <p className="text-3xl font-bold mt-4 text-[#202820]">{value}</p>
              </div>
            ))}
          </div>

          {/* REPORT FORM */}

          {showForm && (
            <section className="bg-white border border-[#dfe2d6] rounded-lg p-6 mb-8">
              <div className="flex justify-between mb-6">
                <div>
                  <p className="section-kicker">REPORT EDITOR</p>

                  <h2 className="text-2xl font-bold mt-2">
                    {editingId !== null ? "Update report" : "Create report"}
                  </h2>
                </div>

                <button onClick={() => setShowForm(false)} aria-label="Close form">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                <label className="field-label">
                  Title
                  <input
                    className="field-input"
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </label>

                <label className="field-label">
                  Location
                  <input
                    className="field-input"
                    required
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </label>

                <label className="field-label">
                  Category
                  <select
                    className="field-input"
                    required
                    value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="">Select a category</option>

                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-label">
                  Status
                  <select
                    className="field-input"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    {["Pending", "In Progress", "Resolved"].map(v => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>

                <label className="field-label">
                  Priority
                  <select
                    className="field-input"
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  >
                    {["Low", "Medium", "High"].map(v => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </label>

                <label className="field-label md:col-span-2">
                  Description
                  <textarea
                    className="field-input"
                    rows="3"
                    required
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </label>

                <div className="md:col-span-2 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="button-ghost text-[#526047] border-[#d8ddce]"
                  >
                    Cancel
                  </button>

                  <button type="submit" disabled={submitting} className="button-primary">
                    <Save size={16} />
                    {submitting ? "Saving..." : "Save report"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ALL REPORTS */}

          <section className="bg-white border border-[#e1e3d9] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#eceee6]">
              <p className="section-kicker">INCOMING & EXISTING</p>
              <h2 className="text-xl font-bold mt-2">All community reports</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-[#7b8274]">
                Loading reports...
              </div>
            ) : !reports.length ? (
              <div className="p-12 text-center text-[#7b8274]">
                No reports have been added yet.
              </div>
            ) : (
              <div className="divide-y divide-[#eceee6]">
                {reports.map(report => (
                  <article
                    key={report.id}
                    className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-5"
                  >
                    <div className="min-w-0 flex-1">

                      {/* REPORT IMAGE */}

                      {report.image_url ? (
                        <img
                          src={report.image_url}
                          alt={`Photographic evidence for ${report.title}`}
                          className="w-full max-w-md h-52 object-cover rounded-lg mb-4 border border-[#e1e3d9]"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full max-w-md h-24 rounded-lg bg-[#f2f3ed] flex items-center justify-center gap-2 mb-4 text-[#a0a596]">
                          <ImageOff size={20} />
                          <span className="text-xs">
                            No photograph attached
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <strong className="text-[#202820]">{report.title}</strong>

                        <span className="category-tag">{report.category}</span>

                        <span className="status-pill status-pending">
                          {report.status}
                        </span>
                      </div>

                      <p className="text-xs text-[#858b7d] flex items-center gap-1">
                        <MapPin size={13} />
                        {report.location} · {report.date}
                      </p>

                      <p className="text-sm text-[#747b6e] mt-2">
                        {report.description}
                      </p>

                      <p className="text-xs text-[#8b8e83] mt-3">
                        {report.priority || "Medium"} priority
                      </p>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openForm(report)} className="button-primary">
                        <Pencil size={15} /> Edit
                      </button>

                      <button
                        onClick={() => deleteReport(report.id)}
                        className="border border-[#ead7d1] text-[#a14f3e] rounded-md px-4 py-2 text-xs font-bold flex items-center gap-2 hover:bg-[#fbefeb]"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <p className="text-center text-xs text-[#a0a596] mt-9">
            FixMyStreet administration portal.
          </p>
        </div>
      </main>
    </>
  );
}