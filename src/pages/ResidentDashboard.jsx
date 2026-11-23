
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Send,
} from "lucide-react";

import Navbar from "../components/Navbar";
import ReportCard from "../components/ReportCard";
import { apiRequest } from "../api";

function normaliseReport(report) {
  const category = Array.isArray(report.categories)
    ? report.categories[0]
    : report.categories;

  return {
    ...report,
    category: category?.name || "Uncategorised",
    location:
      report.location || report.suburb || "Location not provided",
    date: report.created_at
      ? new Date(report.created_at).toLocaleDateString("en-ZA")
      : "Date unavailable",
  };
}

export default function ResidentDashboard({ reports, setReports }) {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    location: "",
    priority: "Medium",
  });

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setError("Please log in again to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [reportData, categoryData] = await Promise.all([
          apiRequest("/reports", { headers }),
          apiRequest("/categories", { headers }),
        ]);

        setReports(
          (reportData.reports || []).map(normaliseReport)
        );

        setCategories(categoryData.categories || []);
      } catch (err) {
        setError(err.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [setReports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchMatch =
        (report.title || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (report.description || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (report.location || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const categoryMatch =
        categoryFilter === "All" ||
        report.category === categoryFilter;

      const statusMatch =
        statusFilter === "All" ||
        report.status === statusFilter;

      return searchMatch && categoryMatch && statusMatch;
    });
  }, [reports, search, categoryFilter, statusFilter]);

  const counts = [
    {
      label: "All reports",
      value: reports.length,
      Icon: ClipboardList,
    },
    {
      label: "Pending",
      value: reports.filter((r) => r.status === "Pending").length,
      Icon: AlertCircle,
    },
    {
      label: "In progress",
      value: reports.filter((r) => r.status === "In Progress").length,
      Icon: Clock,
    },
    {
      label: "Resolved",
      value: reports.filter((r) => r.status === "Resolved").length,
      Icon: CheckCircle,
    },
  ];

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      setFormError("Your session has expired. Please log in again.");
      return;
    }

    if (!formData.category_id) {
      setFormError("Please select a report category.");
      return;
    }

    setSubmitting(true);

    try {
      await apiRequest("/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category_id: formData.category_id,
          location: formData.location.trim(),
          priority: formData.priority,
        }),
      });

      const reportData = await apiRequest("/reports", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(
        (reportData.reports || []).map(normaliseReport)
      );

      setFormData({
        title: "",
        description: "",
        category_id: "",
        location: "",
        priority: "Medium",
      });

      setShowForm(false);
      setSearch("");
      setCategoryFilter("All");
      setStatusFilter("All");

      setSuccessMessage(
        "Your report was submitted successfully!"
      );
    } catch (err) {
      setFormError(
        err.message || "Unable to submit your report."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f5f4ee] px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
            <div>
              <p className="section-kicker">
                RESIDENT SPACE / 01
              </p>

              <h1 className="text-4xl font-extrabold tracking-tight text-[#202820] mt-3">
                Community{" "}
                <em className="font-serif font-medium text-[#80964d]">
                  board.
                </em>
              </h1>

              <p className="text-sm text-[#777e70] mt-3">
                See what's happening nearby. Add what needs attention.
              </p>
            </div>

            <button
              onClick={() => {
                setShowForm(true);
                setFormError("");
              }}
              className="button-primary"
            >
              <Plus size={18} />
              Submit a report
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {counts.map(({ label, value, Icon }) => (
              <div
                key={label}
                className="bg-white border border-[#e2e4da] rounded-lg p-5"
              >
                <div className="flex justify-between items-center text-xs text-[#858b7d]">
                  <span>{label}</span>
                  <Icon size={17} className="text-[#80964d]" />
                </div>

                <p className="text-3xl font-bold tracking-tight mt-4 text-[#202820]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {showForm && (
            <section className="bg-white border border-[#dfe2d6] rounded-lg p-5 sm:p-8 mb-8">
              <div className="flex justify-between items-start mb-7">
                <div>
                  <p className="section-kicker">
                    NEW COMMUNITY REPORT
                  </p>

                  <h2 className="text-2xl font-bold mt-2">
                    Make it visible.
                  </h2>

                  <p className="text-sm text-[#7b8274] mt-2">
                    Give your neighbours enough detail to understand the issue.
                  </p>
                </div>

                <button
                  onClick={() => setShowForm(false)}
                  aria-label="Close form"
                  className="p-2"
                >
                  <X />
                </button>
              </div>

              {formError && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-5"
              >
                <label className="field-label">
                  Report title
                  <input
                    className="field-input"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Deep pothole outside the park"
                    required
                  />
                </label>

                <label className="field-label">
                  Location / suburb
                  <input
                    className="field-input"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Northcliff, Johannesburg"
                    required
                  />
                </label>

                <label className="field-label">
                  Issue category
                  <select
                    className="field-input"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field-label">
                  Priority
                  <select
                    className="field-input"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </label>

                <label className="field-label md:col-span-2">
                  Description
                  <textarea
                    className="field-input min-h-28"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="What happened? Where exactly? How does it affect the community?"
                    required
                    rows={4}
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap justify-end gap-3 border-t border-[#eceee6] pt-5">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="button-ghost text-[#4f5b48] border-[#d8ddce]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="button-primary disabled:opacity-60"
                  >
                    <Send size={16} />
                    {submitting ? "Submitting..." : "Submit report"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="bg-white border border-[#e1e3d9] rounded-lg p-5 mb-7">
            <div className="flex items-center gap-2 mb-4">
              <Search size={18} className="text-[#7e8d60]" />
              <h2 className="font-bold">
                Find a community report
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-3">
              <input
                className="field-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, description or area..."
              />

              <select
                className="field-input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All categories</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                className="field-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </section>

          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-kicker">
                THE LOCAL PICTURE
              </p>
              <h2 className="text-2xl font-bold mt-2">
                Community reports
              </h2>
            </div>

            <span className="text-xs text-[#858b7d]">
              {filteredReports.length} result
              {filteredReports.length === 1 ? "" : "s"}
            </span>
          </div>

          {loading ? (
            <div className="empty-panel">
              Loading community reports...
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="empty-panel">
              No reports match those filters. Try another search or clear your filters.
            </div>
          )}

        </div>
      </main>
    </>
  );
}
