// pages/Admin Dashboard/AssignTechnician.jsx
import React, { useState } from "react";
import { ArrowLeft, UserCheck } from "lucide-react";
import { TypeBadge, StatusBadge } from "./AllTickets";

const validate = (f) => {
  const e = {};
  if (!f.technicianId || isNaN(Number(f.technicianId)) || Number(f.technicianId) <= 0)
    e.technicianId = "Valid technician ID is required.";
  return e;
};

const AssignTechnician = ({ ticket: t, onBack, onSubmit }) => {
  const [form, setForm]      = useState({ technicianId: t?.assignedTo ?? "" });
  const [errors, setErrors]  = useState({});
  const [submitting, setSub] = useState(false);

  if (!t) return null;

  const handleChange = (e) => {
    setForm({ technicianId: e.target.value });
    if (errors.technicianId) setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setSub(true);
      await onSubmit(t.id, Number(form.technicianId));
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      setErrors({ _global: msg || "Failed to assign technician." });
    } finally { setSub(false); }
  };

  return (
    <div className="flex flex-col gap-5 max-w-md">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white transition-colors w-fit">
        <ArrowLeft size={14} /> Back to all tickets
      </button>

      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25 flex items-center justify-center">
            <UserCheck size={16} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>Assign Technician</h2>
            <p className="text-white/25 text-[12px] mt-0.5">Assign a technician to handle this ticket</p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Ticket summary */}
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col gap-3">
            <p className="text-white/25 text-[11px] font-semibold uppercase tracking-wider">Ticket Summary</p>
            <p className="text-white font-semibold text-[14px] leading-snug">{t.title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={t.type} />
              <StatusBadge status={t.status} />
            </div>
            <p className="text-white/25 text-xs">
              Currently assigned to: <span className="text-white/50 font-medium">
                {t.assignedTo ? `Technician #${t.assignedTo}` : "Nobody"}
              </span>
            </p>
          </div>

          {errors._global && (
            <div className="bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl">{errors._global}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
                Technician ID <span className="text-rose-400">*</span>
              </label>
              <input type="number" name="technicianId" value={form.technicianId} onChange={handleChange}
                placeholder="Enter technician user ID (e.g. 3)" min="1"
                className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-[13px] placeholder-white/15 outline-none transition-all ${
                  errors.technicianId ? "border-rose-500/40 bg-rose-500/5" : "border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.06]"
                }`} />
              {errors.technicianId && <p className="text-[12px] text-rose-400 font-medium">{errors.technicianId}</p>}
              <p className="text-[12px] text-white/20">Enter the user ID of a technician-role user.</p>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onBack}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white/40 border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95">
                {submitting
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><UserCheck size={14} /> Assign Technician</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnician;