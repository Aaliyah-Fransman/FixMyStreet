
import { useState } from "react";
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

const emptyForm = {
  title: "",
  description: "",
  category: "Potholes",
  location: "",
  status: "Pending",
  priority: "Medium",
};

export default function AdminDashboard({ reports, setReports }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

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
    setShowForm(true);
  };

  const openEditForm = (report) => {
    setEditingId(report.id);
    setFormData({
      title: report.title,
      description: report.description,
      category: report.category,
      location: report.location,
      status: report.status,
      priority: report.priority,
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId !== null) {
      setReports((previousReports) =>
        previousReports.map((report) =>
          report.id === editingId
            ? { ...report, ...formData }
            : report
        )
      );
    } else {
      const newReport = {
        id: Date.now(),
        ...formData,
        date: new Date().toISOString().split("T")[0],
      };

      setReports((previousReports) => [
        newReport,
        ...previousReports,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const deleteReport = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (confirmed) {
      setReports((previousReports) =>
        previousReports.filter((report) => report.id !== id)
      );
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
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Potholes</option>
                    <option>Broken streetlights</option>
                    <option>Damaged roads</option>
                    <option>Illegal dumping</option>
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
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
                  >
                    <Save size={18} />
                    {editingId !== null ? "Save Changes" : "Create Report"}
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
                Demonstration data for the Phase 1 frontend.
              </p>
            </div>

            {reports.length === 0 ? (
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
