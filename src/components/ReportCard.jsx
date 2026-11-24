import {
  MapPin,
  CalendarDays,
  AlertTriangle,
  Clock,
  CheckCircle2,
  LoaderCircle,
  ImageOff,
} from "lucide-react";

export default function ReportCard({ report }) {
  const styles = {
    Pending: "status-pending",
    "In Progress": "status-progress",
    Resolved: "status-resolved",
  };

  const icons = {
    Pending: <Clock size={14} />,
    "In Progress": <LoaderCircle size={14} />,
    Resolved: <CheckCircle2 size={14} />,
  };

  return (
    <article className="report-card">

      {/* REPORT IMAGE */}

      {report.image_url ? (
        <img
          src={report.image_url}
          alt={`Photographic evidence for ${report.title}`}
          className="report-photo w-full h-48 object-cover rounded-lg mb-5"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-32 rounded-lg bg-[#f2f3ed] flex flex-col items-center justify-center gap-2 mb-5 text-[#a0a596]">
          <ImageOff size={25} />
          <span className="text-xs">
            No photograph attached
          </span>
        </div>
      )}

      {/* CATEGORY AND STATUS */}

      <div className="flex items-center justify-between gap-2 mb-5">

        <span className="category-tag">
          {report.category}
        </span>

        <span
          className={
            "status-pill " +
            (styles[report.status] || "status-pending")
          }
        >
          {icons[report.status]}
          {report.status}
        </span>

      </div>

      {/* REPORT DETAILS */}

      <h3 className="text-xl font-semibold tracking-tight text-[#20251f]">
        {report.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#72786e]">
        {report.description}
      </p>

      {/* LOCATION AND DATE */}

      <div className="report-meta">

        <span>
          <MapPin size={14} />
          {report.location}
        </span>

        <span>
          <CalendarDays size={14} />
          {report.date}
        </span>

      </div>

      {/* PRIORITY AND REPORT NUMBER */}

      <div className="mt-4 flex items-center justify-between border-t border-[#ecece4] pt-4">

        <span className="text-xs font-semibold uppercase tracking-wider text-[#8b8e83]">
          <AlertTriangle size={13} className="inline mr-1" />
          {report.priority || "Medium"} priority
        </span>

        <span className="text-xs text-[#9a9d91]">
          Report #{String(report.id).slice(-4)}
        </span>

      </div>

    </article>
  );
}