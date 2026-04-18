// pages/Admin Dashboard/ViewBooking.jsx
import React from "react";
import {
  ArrowLeft, Pencil, Ban, CheckCircle2, XCircle,
  CalendarDays, Clock, Users, FileText, Hash, User
} from "lucide-react";
import { StatusBadge } from "./Allbookings";

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-3.5 border-b border-white/[0.05] last:border-0">
    <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
      <Icon size={14} className="text-white/30" />
    </div>
    <div className="min-w-0">
      <p className="text-white/30 text-[11px] font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-white text-[13px] font-medium mt-0.5 truncate">{value ?? "—"}</p>
    </div>
  </div>
);

const ViewBooking = ({ booking: b, onBack, onEdit, onApprove, onReject, onCancel }) => {
  if (!b) return null;

  const canApproveReject = b.status === "PENDING";
  const canCancel        = b.status === "PENDING" || b.status === "APPROVED";

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white transition-colors w-fit">
        <ArrowLeft size={14} /> Back To All Bookings
      </button>

      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">
        {/* Banner */}
        <div className="h-20 bg-gradient-to-r from-indigo-600/20 via-violet-600/10 to-transparent relative">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)" }} />
        </div>

        <div className="px-6 pb-6 -mt-8">
          {/* Icon badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 ring-4 ring-[#0d0d28] mb-4">
            <CalendarDays size={22} className="text-white" />
          </div>

          <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
            <div>
              <h2 className="text-white text-xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
                Booking #{b.id}
              </h2>
              <p className="text-white/30 text-sm mt-0.5">{b.purpose}</p>
            </div>
            <StatusBadge status={b.status} />
          </div>

          {/* Info rows */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-2 mb-5">
            <InfoRow icon={Hash}         label="Booking ID"   value={`#${b.id}`}                     />
            <InfoRow icon={User}         label="User ID"      value={`#${b.userId}`}                 />
            <InfoRow icon={CalendarDays} label="Resource"     value={`Resource #${b.resourceId}`}    />
            <InfoRow icon={CalendarDays} label="Date"         value={b.date}                         />
            <InfoRow icon={Clock}        label="Time"         value={`${b.startTime} – ${b.endTime}`}/>
            <InfoRow icon={FileText}     label="Purpose"      value={b.purpose}                      />
            <InfoRow icon={Users}        label="Attendees"    value={b.attendees}                    />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onEdit(b)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              <Pencil size={13} /> Edit
            </button>

            {canApproveReject && (
              <>
                <button onClick={() => onApprove(b.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-300 text-[13px] font-semibold ring-1 ring-emerald-500/25 transition-all active:scale-95">
                  <CheckCircle2 size={13} /> Approve
                </button>
                <button onClick={() => onReject(b.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-[13px] font-semibold ring-1 ring-rose-500/25 transition-all active:scale-95">
                  <XCircle size={13} /> Reject
                </button>
              </>
            )}

            {canCancel && (
              <button onClick={() => onCancel(b.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[13px] font-semibold ring-1 ring-amber-500/20 transition-all active:scale-95">
                <Ban size={13} /> Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBooking;