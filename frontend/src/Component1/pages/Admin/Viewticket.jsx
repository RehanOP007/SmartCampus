// pages/Admin Dashboard/ViewTicket.jsx
import React from "react";
import {
  ArrowLeft, Pencil, Trash2, UserCheck,
  Ticket, Hash, User, Tag, AlignLeft, Users
} from "lucide-react";
import { StatusBadge, TypeBadge, STATUS_CFG } from "./AllTickets";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-white/[0.05] last:border-0">
    <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
      <Icon size={14} className="text-white/30" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-white/30 text-[11px] font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-white text-[13px] font-medium mt-0.5">{value ?? <span className="text-white/20 italic">Not set</span>}</p>
    </div>
  </div>
);

const ViewTicket = ({ ticket: t, onBack, onEdit, onDelete, onAssign, onStatusChange }) => {
  if (!t) return null;

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white transition-colors w-fit">
        <ArrowLeft size={14} /> Back to all tickets
      </button>

      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">
        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-indigo-600/20 via-violet-600/10 to-transparent relative">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)" }} />
        </div>

        <div className="px-6 pb-6 -mt-8">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 ring-4 ring-[#0d0d28] mb-4">
            <Ticket size={22} className="text-white" />
          </div>

          <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-xl font-bold truncate" style={{ fontFamily: "'Sora', sans-serif" }}>{t.title}</h2>
              <p className="text-white/30 text-sm mt-0.5">Ticket #{t.id}</p>
            </div>
            <StatusBadge status={t.status} />
          </div>

          {/* Type badge */}
          <div className="mb-5">
            <TypeBadge type={t.type} />
          </div>

          {/* Info rows */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-2 mb-4">
            <InfoRow icon={Hash}      label="Ticket ID"    value={`#${t.id}`}                                       />
            <InfoRow icon={Tag}       label="Type"         value={t.type}                                           />
            <InfoRow icon={User}      label="Created By"   value={`User #${t.createdBy}`}                           />
            <InfoRow icon={Users}     label="Assigned To"  value={t.assignedTo ? `Technician #${t.assignedTo}` : null} />
            <InfoRow icon={AlignLeft} label="Description"  value={t.description}                                    />
          </div>

          {/* Change Status */}
          <div className="mb-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <p className="text-white/30 text-[11px] font-semibold uppercase tracking-wider mb-2.5">Change Status</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <button key={key}
                  onClick={() => onStatusChange(t.id, key)}
                  disabled={t.status === key}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                    t.status === key
                      ? `${cfg.cls} cursor-default`
                      : "bg-white/[0.04] text-white/35 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                  }`}>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onEdit(t)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              <Pencil size={13} /> Edit
            </button>
            <button onClick={() => onAssign(t)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[13px] font-semibold ring-1 ring-emerald-500/25 transition-all active:scale-95">
              <UserCheck size={13} /> Assign Tech
            </button>
            <button onClick={() => onDelete(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[13px] font-semibold ring-1 ring-rose-500/20 transition-all active:scale-95">
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTicket;