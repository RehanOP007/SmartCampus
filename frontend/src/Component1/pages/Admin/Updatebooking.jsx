// pages/Admin Dashboard/UpdateBooking.jsx
import React, { useState } from "react";
import { ArrowLeft, Save, ChevronDown } from "lucide-react";
import { STATUS_CFG } from "./Allbookings";

// ── Validation ──────────────────────────────────────────────────────────────
const validate = (f) => {
  const e = {};
  if (!f.status || !["PENDING","APPROVED","REJECTED","CANCELLED"].includes(f.status))
    e.status = "Please select a valid status.";
  return e;
};

// ── Main ─────────────────────────────────────────────────────────────────────
const UpdateBooking = ({ booking: b, onBack, onSubmit }) => {
  const [form, setForm]      = useState({ status: b?.status ?? "PENDING" });
  const [errors, setErrors]  = useState({});
  const [submitting, setSub] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setSub(true);
      await onSubmit(b.id, form);
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      setErrors({ _global: msg || "Failed to update booking." });
    } finally { setSub(false); }
  };

  if (!b) return null;

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white transition-colors w-fit">
        <ArrowLeft size={14} /> Back to all bookings
      </button>

      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/20 flex items-center justify-center font-bold text-indigo-300 text-sm">
            #{b.id}
          </div>
          <div>
            <h2 className="text-white font-bold text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>Update Booking</h2>
            <p className="text-white/25 text-[12px] mt-0.5">
              {b.purpose} &bull; {b.date} &bull; {b.startTime}–{b.endTime}
            </p>
          </div>
        </div>

        <div className="p-6">
          {/* Read-only summary */}
          <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {[
              { label: "User ID",     value: `#${b.userId}`    },
              { label: "Resource ID", value: `#${b.resourceId}`},
              { label: "Date",        value: b.date             },
              { label: "Attendees",   value: b.attendees        },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white/25 text-[11px] font-semibold uppercase tracking-wider">{label}</p>
                <p className="text-white/70 text-[13px] font-medium mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {errors._global && (
            <div className="bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl mb-4">{errors._global}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
                Status <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <select name="status" value={form.status} onChange={handleChange}
                  className={`w-full px-4 py-3 pr-9 rounded-xl bg-white/[0.04] border text-white text-[13px] outline-none transition-all appearance-none cursor-pointer ${
                    errors.status ? "border-rose-500/40" : "border-white/[0.08] focus:border-indigo-500/50"
                  }`}>
                  {["PENDING","APPROVED","REJECTED","CANCELLED"].map((s) => (
                    <option key={s} value={s} className="bg-[#12122e]">{STATUS_CFG[s].label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
              </div>
              {errors.status && <p className="text-[12px] text-rose-400 font-medium">{errors.status}</p>}

              {/* Status preview */}
              {form.status && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/25 text-[12px]">Will be set to:</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${STATUS_CFG[form.status].cls}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CFG[form.status].dot}`} />
                    {STATUS_CFG[form.status].label}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onBack}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white/40 border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95">
                {submitting
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><Save size={14} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBooking;