
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ClipboardList,
  Clock,
  CheckCircle2,
  X,
  Save,
} from "lucide-react";

import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

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

  // Load reports and categories
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
  }, [setReports]);

  const pending = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const inProgress = reports.filter(
    (report) => report.status === "In Progress"
  ).length;

  const resolved = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  const openEditForm = (report) => {
    setEditingId(report.id);

    setFormData({
      title: report.title || "",
      description: report.description || "",
      category_id: report.category_id || "",
      location: report.location || "",
      status: report.status || "Pending",
      priority: report.priority || "Medium",
    });

    setError("");
    setSuccessMessage("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        // Update report details
        await apiRequest(`/reports/${editingId}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(reportDetails),
        });

        // Update report status separately
        await apiRequest(`/reports/${editingId}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            status: formData.status,
          }),
        });

        setSuccessMessage("Report updated successfully!");
      } else {
        // Create a new report
        const result = await apiRequest("/reports", {
          method: "POST",
          headers,
          body: JSON.stringify(reportDetails),
        });

        // Apply selected status if it isn't the default
        if (formData.status !== "Pending" && result.report?.id) {
          await apiRequest(`/reports/${result.report.id}/status`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({
              status: formData.status,
            }),
          });
        }

        setSuccessMessage("Report created successfully!");
      }

      // Refresh reports from the database
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
  };

  const deleteReport = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    setError("");
    setSuccessMessage("");

    try {
      await apiRequest(`/reports/${id}`, {
        method: "DELETE",
        headers,
      });

      setReports((previousReports) =>
        previousReports.filter((report) => report.id !== id)
      );

      setSuccessMessage("Report deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete this report.");
    }
  };

  const stats = [
    {
      label: "Total Reports",
      value: reports.length,
      icon: ClipboardList,
      color: "text-blue-700",
      background: "bg-blue-50",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock,
      color: "text-amber-700",
      background: "bg-amber-50",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "text-indigo-700",
      background: "bg-indigo-50",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: CheckCircle2,
      color: "text-green-700",
      background: "bg-green-50",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-10">

          <div className="flex flex-wrap justify-between items-center gap-5 mb-9">
            <div>
              <span className="text-blue-700 text-sm font-bold uppercase tracking-widest">
                Administration portal
              </span>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">
                Admin Dashboard
              </h1>

              <p className="text-slate-600 mt-3">
                Manage and monitor community infrastructure reports.
              </p>
            </div>

            <button
              onClick={openAddForm}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold transition"
            >
              <Plus size={20} />
              Add New Report
            </button>
          </div>

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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-slate-500 text-sm font-medium">
                      {stat.label}
                    </span>

                    <div className={`${stat.background} ${stat.color} p-3 rounded-xl`}>
                      <Icon size={22} />
                    </div>
                  </div>

                  <p className="text-3xl font-extrabold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {showForm && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId !== null ? "Edit Report" : "Add New Report"}
                </h2>

                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-500 hover:text-red-600"
                  aria-label="Close form"
                >
                  <X size={23} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Report title
                  </label>

                  <input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter report title"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Location
                  </label>

                  <input
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Enter location"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Category
                  </label>

                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Status
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Priority
                  </label>

                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Description
                  </label>

                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe the infrastructure issue"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-60"
                  >
                    <Save size={18} />
                    {submitting
                      ? "Saving..."
                      : editingId !== null
                        ? "Save Changes"
                        : "Create Report"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                Manage Reports
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage reports submitted by the community.
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500">
                Loading reports...
              </div>
            ) : reports.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No reports have been added yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-bold text-slate-900">
                          {report.title}
                        </span>

                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          {report.category}
                        </span>

                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                          {report.status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-500">
                        {report.location} · {report.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEditForm(report)}
                        className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteReport(report.id)}
                        className="flex items-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-semibold"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
