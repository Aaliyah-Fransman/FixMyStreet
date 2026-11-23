import {MapPin,CalendarDays,AlertTriangle,Clock,CheckCircle2,LoaderCircle} from "lucide-react";
export default function ReportCard({report}){
 const styles={Pending:"status-pending","In Progress":"status-progress",Resolved:"status-resolved"};
 const icons={Pending:<Clock size={14}/>,"In Progress":<LoaderCircle size={14}/>,Resolved:<CheckCircle2 size={14}/>};
 return <article className="report-card">{report.images?.length>0&&<img src={report.images[0]} alt="Resident-submitted evidence" className="report-photo"/>}
 <div className="flex items-center justify-between gap-2 mb-5"><span className="category-tag">{report.category}</span><span className={"status-pill "+(styles[report.status]||"status-pending")}>{icons[report.status]}{report.status}</span></div>
 <h3 className="text-xl font-semibold tracking-tight text-[#20251f]">{report.title}</h3><p className="mt-2 text-sm leading-6 text-[#72786e]">{report.description}</p>
 <div className="report-meta"><span><MapPin size={14}/>{report.location}</span><span><CalendarDays size={14}/>{report.date}</span></div>
 <div className="mt-4 flex items-center justify-between border-t border-[#ecece4] pt-4"><span className="text-xs font-semibold uppercase tracking-wider text-[#8b8e83]"><AlertTriangle size={13} className="inline mr-1"/> {report.priority||"Medium"} priority</span><span className="text-xs text-[#9a9d91]">Report #{String(report.id).slice(-4)}</span></div></article>;
}