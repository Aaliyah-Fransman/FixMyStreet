
import { useState } from "react";
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

function ResidentDashboard({ reports, setReports }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Potholes",
    location: "",
    priority: "Medium",
  });

  const categories = [
    "Potholes",
    "Broken streetlights",
    "Damaged roads",
    "Illegal dumping",
  ];

  const filteredReports = reports.filter((report) => {
    const searchMatch =
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      report.description.toLowerCase().includes(search.toLowerCase()) ||
      report.location.toLowerCase().includes(search.toLowerCase());

    const categoryMatch =
      categoryFilter === "All" || report.category === categoryFilter;

    const statusMatch =
      statusFilter === "All" || report.status === statusFilter;

    return searchMatch && categoryMatch && statusMatch;
  });

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const inProgressReports = reports.filter(
    (report) => report.status === "In Progress"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newReport = {
      id: Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      location: formData.location.trim(),
      status: "Pending",
      priority: formData.priority,
      date: new Date().toISOString().split("T")[0],
    };

    setReports((previousReports) => [
      newReport,
      ...previousReports,
    ]);

    setFormData({
      title: "",
      description: "",
      category: "Potholes",
      location: "",
      priority: "Medium",
    });

    setShowForm(false);
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");

    alert("Your report has been submitted successfully!");
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">

          {/* Heading */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                Resident Portal
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                My Dashboard
              </h1>

              <p className="mt-2 text-slate-500">
                View community issues and keep track of your reports.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus size={20} />
              Submit a Report
            </button>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Reports"
              value={totalReports}
              icon={<ClipboardList size={22} />}
            />

            <StatCard
              title="Pending"
              value={pendingReports}
              icon={<AlertCircle size={22} />}
            />

            <StatCard
              title="In Progress"
              value={inProgressReports}
              icon={<Clock size={22} />}
            />

            <StatCard
              title="Resolved"
              value={resolvedReports}
              icon={<CheckCircle size={22} />}
            />
          </div>

          {/* Report submission form */}
          {showForm && (
            <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Submit a Community Report
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Provide details about the problem you have noticed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close report form"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Report Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Example: Large pothole near the intersection"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Issue Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Priority
                    </label>

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Example: Northcliff, Johannesburg"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the issue and how it affects the community..."
                    required
                    rows="4"
                    className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    <Send size={18} />
                    Submit Report
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Search and filters */}
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              Find Community Reports
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search reports..."
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </section>

          {/* Community reports */}
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Community Reports
              </h2>

              <span className="text-sm text-slate-500">
                {filteredReports.length} found
              </span>
            </div>

            {filteredReports.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <ClipboardList
                  size={40}
                  className="mx-auto mb-4 text-slate-400"
                />

                <h3 className="text-lg font-bold text-slate-800">
                  No reports found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filter options.
                </p>
              </div>
            )}
          </section>

          <p className="mt-8 text-center text-xs text-slate-400">
            Demonstration data for the Phase 1 frontend. Reports are not yet
            saved to a database.
          </p>
        </div>
      </main>
    </>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <span className="rounded-xl bg-blue-50 p-3 text-blue-600">
          {icon}
        </span>
      </div>

      <p className="text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default ResidentDashboard;
