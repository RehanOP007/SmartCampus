// pages/Admin Dashboard/AllTickets.jsx
import React, { useState } from "react";
import {
  Plus, Search, ChevronDown, Trash2, Eye,
  Pencil, UserCheck, Ticket, Filter, Tag
} from "lucide-react";

// ── Shared status & type config (exported for reuse) ─────────────────────────
export const STATUS_CFG = {
  OPEN:        { label: "Open",        cls: "bg-sky-500/15     text-sky-300     ring-1 ring-sky-500/30",     dot: "bg-sky-400"     },
  IN_PROGRESS: { label: "In Progress", cls: "bg-amber-500/15   text-amber-300   ring-1 ring-amber-500/30",   dot: "bg-amber-400"   },
  RESOLVED:    { label: "Resolved",    cls: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30", dot: "bg-emerald-400" },
  CLOSED:      { label: "Closed",      cls: "bg-white/10       text-white/35    ring-1 ring-white/15",       dot: "bg-white/30"    },
};

export const TYPE_CFG = {
  TECHNICAL: { label: "Technical", cls: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30" },
  FACILITY:  { label: "Facility",  cls: "bg-cyan-500/15   text-cyan-300   ring-1 ring-cyan-500/30"   },
  OTHER:     { label: "Other",     cls: "bg-white/10      text-white/35   ring-1 ring-white/15"      },
};

export const StatusBadge = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

export const TypeBadge = ({ type }) => {
  const cfg = TYPE_CFG[type] ?? TYPE_CFG.OTHER;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

// ── Confirm modal (reusable inline) ─────────────────────────────────────────
const ConfirmModal = ({ action, onConfirm, onCancel }) => {
  if (!action) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-[#0f0f2e] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
            <Trash2 size={18} className="text-rose-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>Delete Ticket</h3>
            <p className="text-white/35 text-xs">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-white/50 text-sm mb-6 leading-relaxed">
          Are you sure you want to delete ticket <span className="text-white font-medium">"{action.ticket.title}"</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 border border-white/10 hover:bg-white/5 hover:text-white transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20">Delete</button>
        </div>
      </div>
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const AllTickets = ({ tickets, loading, error, onView, onEdit, onDelete, onAssign, onAddTicket }) => {
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter,   setTypeFilter]   = useState("");
  const [search,       setSearch]       = useState("");
  const [pending,      setPending]      = useState(null);

  const filtered = tickets.filter((t) => {
    const matchStatus = statusFilter ? t.status === statusFilter : true;
    const matchType   = typeFilter   ? t.type   === typeFilter   : true;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || [String(t.id), t.title, t.type, t.status, String(t.createdBy)].some((f) => f?.toLowerCase().includes(q));
    return matchStatus && matchType && matchSearch;
  });

  const counts = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
  tickets.forEach((t) => { if (counts[t.status] !== undefined) counts[t.status]++; });

  return (
    <div className="flex flex-col gap-6">

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total",       value: tickets.length,    dot: "bg-indigo-400",  from: "from-indigo-500/15", to: "to-violet-500/15"  },
          { label: "Open",        value: counts.OPEN,       dot: "bg-sky-400",     from: "from-sky-500/10",    to: "to-cyan-500/10"    },
          { label: "In Progress", value: counts.IN_PROGRESS,dot: "bg-amber-400",   from: "from-amber-500/10",  to: "to-orange-500/10"  },
          { label: "Resolved",    value: counts.RESOLVED,   dot: "bg-emerald-400", from: "from-emerald-500/10",to: "to-teal-500/10"    },
          { label: "Closed",      value: counts.CLOSED,     dot: "bg-white/30",    from: "from-white/5",       to: "to-white/5"        },
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
            <Ticket size={16} className="text-indigo-400" />
            <h2 className="text-white font-semibold text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>All Tickets</h2>
            <span className="ml-1 text-xs text-white/25 font-medium">{filtered.length} shown</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-white/[0.05]">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search by ID, title, type, status…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all" />
          </div>
          {/* Status filter */}
          <div className="relative w-full sm:w-40">
            <Filter size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
              <option value="" className="bg-[#12122e]">All Statuses</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k} className="bg-[#12122e]">{v.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          </div>
          {/* Type filter */}
          <div className="relative w-full sm:w-36">
            <Tag size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
              <option value="" className="bg-[#12122e]">All Types</option>
              {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k} className="bg-[#12122e]">{v.label}</option>)}
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
                  { h: "ID",          c: "" },
                  { h: "Title",       c: "" },
                  { h: "Type",        c: "hidden sm:table-cell" },
                  { h: "Status",      c: "" },
                  { h: "Created By",  c: "hidden md:table-cell" },
                  { h: "Assigned To", c: "hidden lg:table-cell" },
                  { h: "Actions",     c: "text-right" },
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
                    <span className="text-sm">Loading tickets…</span>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-white/25 text-sm">No tickets found.</td></tr>
              ) : filtered.map((t) => (
                <tr key={t.id} onClick={() => onView(t)} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                  <td className="px-6 py-4 text-white/25 font-mono text-xs">#{t.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/15 ring-1 ring-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Ticket size={12} className="text-indigo-400" />
                      </div>
                      <span className="text-white text-[13px] font-medium group-hover:text-indigo-200 transition-colors max-w-[180px] truncate">{t.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell"><TypeBadge type={t.type} /></td>
                  <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                  <td className="px-6 py-4 text-white/35 text-[13px] hidden md:table-cell">User #{t.createdBy}</td>
                  <td className="px-6 py-4 text-white/35 text-[13px] hidden lg:table-cell">
                    {t.assignedTo ? `Tech #${t.assignedTo}` : <span className="text-white/20 italic">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onView(t)} title="View"
                        className="p-2 rounded-lg text-white/25 hover:text-white hover:bg-white/8 transition-all"><Eye size={14} /></button>
                      <button onClick={() => onEdit(t)} title="Edit"
                        className="p-2 rounded-lg text-white/25 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"><Pencil size={14} /></button>
                      <button onClick={() => onAssign(t)} title="Assign Technician"
                        className="p-2 rounded-lg text-white/25 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"><UserCheck size={14} /></button>
                      <button onClick={() => setPending({ ticket: t })} title="Delete"
                        className="p-2 rounded-lg text-white/25 hover:text-rose-400 hover:bg-rose-500/10 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        action={pending}
        onConfirm={() => { onDelete(pending.ticket.id); setPending(null); }}
        onCancel={() => setPending(null)}
      />
    </div>
  );
};

export default AllTickets;