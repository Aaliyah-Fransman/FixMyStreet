
import {
  MapPin,
  CalendarDays,
  AlertTriangle,
  Clock,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

export default function ReportCard({ report }) {
  const statusStyles = {
    Pending: "bg-amber-100 text-amber-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Resolved: "bg-green-100 text-green-800",
  };

  const priorityStyles = {
    High: "text-red-600",
    Medium: "text-amber-600",
    Low: "text-green-600",
  };

  const statusIcons = {
    Pending: <Clock size={16} />,
    "In Progress": <LoaderCircle size={16} />,
    Resolved: <CheckCircle2 size={16} />,
  };

  return (
    <article className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <span className="text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full">
          {report.category}
        </span>

        <span
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
            statusStyles[report.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {statusIcons[report.status]}
          {report.status}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {report.title}
      </h3>

      <p className="text-slate-600 text-sm leading-6 mb-5">
        {report.description}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {report.location}
          </span>

          <span className="flex items-center gap-1">
            <CalendarDays size={14} />
            {report.date}
          </span>
        </div>

        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            priorityStyles[report.priority] || "text-slate-600"
          }`}
        >
          <AlertTriangle size={14} />
          {report.priority} priority
        </span>
      </div>
    </article>
  );
}
