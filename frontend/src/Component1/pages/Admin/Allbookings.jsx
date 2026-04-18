// pages/Admin Dashboard/AllBookings.jsx
import React, { useState } from "react";
import {
  Plus, Search, ChevronDown, CheckCircle2, XCircle,
  Ban, Eye, Pencil, CalendarDays, Filter
} from "lucide-react";

// ── Shared status config ─────────────────────────────────────────────────────
export const STATUS_CFG = {
  PENDING:   { label: "Pending",   cls: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",   dot: "bg-amber-400"   },
  APPROVED:  { label: "Approved",  cls: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30", dot: "bg-emerald-400" },
  REJECTED:  { label: "Rejected",  cls: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30",       dot: "bg-rose-400"    },
  CANCELLED: { label: "Cancelled", cls: "bg-white/10 text-white/35 ring-1 ring-white/15",             dot: "bg-white/30"    },
};

export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const AllBookings = ({ bookings, loading, error, onView, onEdit, onApprove, onReject, onCancel, onAddBooking }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [search,       setSearch]       = useState("");
  const [pendingAction, setPending]     = useState(null); // { type, booking }

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter ? b.status === statusFilter : true;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || [
      String(b.id), String(b.userId), String(b.resourceId), b.purpose, b.date
    ].some((f) => f?.toLowerCase().includes(q));
    return matchStatus && matchSearch;
  });

  // Stat counts
  const counts = { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 };
  bookings.forEach((b) => { if (counts[b.status] !== undefined) counts[b.status]++; });

  const confirmAction = () => {
    if (!pendingAction) return;
    const { type, booking } = pendingAction;
    if (type === "approve") onApprove(booking.id);
    if (type === "reject")  onReject(booking.id);
    if (type === "cancel")  onCancel(booking.id);
    setPending(null);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total",     value: bookings.length,     dot: "bg-indigo-400",   from: "from-indigo-500/15", to: "to-violet-500/15"  },
          { label: "Pending",   value: counts.PENDING,      dot: "bg-amber-400",    from: "from-amber-500/10",  to: "to-orange-500/10"  },
          { label: "Approved",  value: counts.APPROVED,     dot: "bg-emerald-400",  from: "from-emerald-500/10",to: "to-teal-500/10"    },
          { label: "Rejected",  value: counts.REJECTED,     dot: "bg-rose-400",     from: "from-rose-500/10",   to: "to-red-500/10"     },
          { label: "Cancelled", value: counts.CANCELLED,    dot: "bg-white/30",     from: "from-white/5",       to: "to-white/5"        },
        ].map(({ label, value, dot, from, to }) => (
          <div key={label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${from} ${to} border border-white/[0.06]`}>
            <div className={`w-2 h-2 rounded-full ${dot}`} />
            <div>
              <p className="text-white font-bold text-lg leading-none">{value}</p>
              <p className="text-white/40 text-[11px] mt-0.5 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">

        {/* Card header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <CalendarDays size={16} className="text-indigo-400" />
            <h2 className="text-white font-semibold text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>All Bookings</h2>
            <span className="ml-1 text-xs text-white/25 font-medium">{filtered.length} shown</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-white/[0.05]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search by ID, resource, purpose, date…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all" />
          </div>
          <div className="relative w-full sm:w-44">
            <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
              <option value="" className="bg-[#12122e]">All Statuses</option>
              <option value="PENDING"   className="bg-[#12122e]">Pending</option>
              <option value="APPROVED"  className="bg-[#12122e]">Approved</option>
              <option value="REJECTED"  className="bg-[#12122e]">Rejected</option>
              <option value="CANCELLED" className="bg-[#12122e]">Cancelled</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          </div>
        </div>

        {error && <div className="mx-6 mt-4 bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl">{error}</div>}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {[
                  { h: "ID",         c: "" },
                  { h: "Resource",   c: "" },
                  { h: "Date",       c: "hidden sm:table-cell" },
                  { h: "Time",       c: "hidden md:table-cell" },
                  { h: "Purpose",    c: "hidden lg:table-cell" },
                  { h: "Status",     c: "" },
                  { h: "Actions",    c: "text-right" },
                ].map(({ h, c }) => (
                  <th key={h} className={`px-6 py-3.5 text-left text-[11px] text-white/25 font-semibold uppercase tracking-widest ${c}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-16 text-white/25">
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-4 h-4 border-2 border-indigo-500/40 border-t-indigo-400 rounded-full animate-spin" />
                    <span className="text-sm">Loading bookings…</span>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-white/25 text-sm">No bookings found.</td></tr>
              ) : filtered.map((b) => (
                <tr key={b.id} onClick={() => onView(b)} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                  <td className="px-6 py-4 text-white/25 font-mono text-xs">#{b.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/15 ring-1 ring-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <CalendarDays size={13} className="text-indigo-400" />
                      </div>
                      <span className="text-white text-[13px] font-medium group-hover:text-indigo-200 transition-colors">
                        Resource {b.resourceId}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/40 text-[13px] hidden sm:table-cell">{b.date}</td>
                  <td className="px-6 py-4 text-white/40 text-[13px] hidden md:table-cell whitespace-nowrap">{b.startTime} – {b.endTime}</td>
                  <td className="px-6 py-4 text-white/40 text-[13px] hidden lg:table-cell max-w-[140px] truncate">{b.purpose}</td>
                  <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onView(b)} title="View"
                        className="p-2 rounded-lg text-white/25 hover:text-white hover:bg-white/8 transition-all"><Eye size={14} /></button>
                      <button onClick={() => onEdit(b)} title="Edit"
                        className="p-2 rounded-lg text-white/25 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"><Pencil size={14} /></button>
                      {b.status === "PENDING" && (
                        <>
                          <button onClick={() => setPending({ type: "approve", booking: b })} title="Approve"
                            className="p-2 rounded-lg text-white/25 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><CheckCircle2 size={14} /></button>
                          <button onClick={() => setPending({ type: "reject", booking: b })} title="Reject"
                            className="p-2 rounded-lg text-white/25 hover:text-rose-400 hover:bg-rose-500/10 transition-all"><XCircle size={14} /></button>
                        </>
                      )}
                      {(b.status === "PENDING" || b.status === "APPROVED") && (
                        <button onClick={() => setPending({ type: "cancel", booking: b })} title="Cancel"
                          className="p-2 rounded-lg text-white/25 hover:text-amber-400 hover:bg-amber-500/10 transition-all"><Ban size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm modal */}
      {pendingAction && (() => {
        const cfg = {
          approve: { title: "Approve Booking", msg: "Are you sure you want to approve this booking?",  icon: CheckCircle2, iconCls: "text-emerald-400", iconBg: "bg-emerald-500/15", btnCls: "bg-emerald-600 hover:bg-emerald-500", btnLabel: "Approve" },
          reject:  { title: "Reject Booking",  msg: "Are you sure you want to reject this booking?",   icon: XCircle,      iconCls: "text-rose-400",    iconBg: "bg-rose-500/15",    btnCls: "bg-rose-600 hover:bg-rose-500",       btnLabel: "Reject"  },
          cancel:  { title: "Cancel Booking",  msg: "Are you sure you want to cancel this booking?",   icon: Ban,          iconCls: "text-amber-400",   iconBg: "bg-amber-500/15",   btnCls: "bg-amber-600 hover:bg-amber-500",     btnLabel: "Cancel"  },
        }[pendingAction.type];
        const Icon = cfg.icon;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setPending(null)} />
            <div className="relative z-10 w-full max-w-sm bg-[#0f0f2e] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center`}>
                  <Icon size={18} className={cfg.iconCls} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>{cfg.title}</h3>
                  <p className="text-white/35 text-xs">Booking #{pendingAction.booking.id}</p>
                </div>
              </div>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">{cfg.msg}</p>
              <div className="flex gap-3">
                <button onClick={() => setPending(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 border border-white/10 hover:bg-white/5 hover:text-white transition-all">Cancel</button>
                <button onClick={confirmAction}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg ${cfg.btnCls}`}>{cfg.btnLabel}</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AllBookings;