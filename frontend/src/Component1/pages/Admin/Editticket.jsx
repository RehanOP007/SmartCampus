// pages/Admin Dashboard/EditTicket.jsx
import React, { useState } from "react";
import { ArrowLeft, Save, ChevronDown } from "lucide-react";
import { STATUS_CFG } from "./AllTickets";

const validate = (f) => {
  const e = {};
  if (!f.title || f.title.trim().length < 3)   e.title       = "Title must be at least 3 characters.";
  if (!f.title || f.title.trim().length > 100)  e.title       = "Title must not exceed 100 characters.";
  if (!["TECHNICAL","FACILITY","OTHER"].includes(f.type)) e.type = "Select a valid type.";
  if ((f.type === "TECHNICAL" || f.type === "FACILITY") && (!f.resourceId || isNaN(Number(f.resourceId)) || Number(f.resourceId) <= 0))
    e.resourceId = `Resource ID required for ${f.type} tickets.`;
  if (!f.description || f.description.trim().length < 5) e.description = "Description must be at least 5 characters.";
  if (!Object.keys(STATUS_CFG).includes(f.status)) e.status = "Select a valid status.";
  return e;
};

const Field = ({ label, name, type = "text", value, onChange, error, placeholder, required, min }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
      {label}{required && <span className="text-rose-400 ml-1">*</span>}
    </label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} min={min}
      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-[13px] placeholder-white/15 outline-none transition-all ${
        error ? "border-rose-500/40 bg-rose-500/5" : "border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.06]"
      }`} />
    {error && <p className="text-[12px] text-rose-400 font-medium">{error}</p>}
  </div>
);

const Select = ({ label, name, value, onChange, error, required, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
      {label}{required && <span className="text-rose-400 ml-1">*</span>}
    </label>
    <div className="relative">
      <select name={name} value={value} onChange={onChange}
        className={`w-full px-4 py-3 pr-9 rounded-xl bg-white/[0.04] border text-white text-[13px] outline-none transition-all appearance-none cursor-pointer ${
          error ? "border-rose-500/40" : "border-white/[0.08] focus:border-indigo-500/50"
        }`}>
        {options.map(({ value: v, label: l }) => <option key={v} value={v} className="bg-[#12122e]">{l}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
    </div>
    {error && <p className="text-[12px] text-rose-400 font-medium">{error}</p>}
  </div>
);

const EditTicket = ({ ticket: t, onBack, onSubmit }) => {
  const [form, setForm] = useState({
    title:       t?.title       ?? "",
    type:        t?.type        ?? "OTHER",
    resourceId:  t?.resourceId  ?? "",
    description: t?.description ?? "",
    status:      t?.status      ?? "OPEN",
  });
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
    const payload = {
      title:       form.title.trim(),
      type:        form.type,
      description: form.description.trim(),
      status:      form.status,
    };
    if (form.resourceId) payload.resourceId = Number(form.resourceId);
    try {
      setSub(true);
      await onSubmit(t.id, payload);
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      setErrors({ _global: msg || "Failed to update ticket." });
    } finally { setSub(false); }
  };

  const needsResource = form.type === "TECHNICAL" || form.type === "FACILITY";

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white transition-colors w-fit">
        <ArrowLeft size={14} /> Back to all tickets
      </button>

      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/20 flex items-center justify-center font-bold text-indigo-300 text-sm">
            #{t?.id}
          </div>
          <div>
            <h2 className="text-white font-bold text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>Edit Ticket</h2>
            <p className="text-white/25 text-[12px] mt-0.5 truncate max-w-[240px]">Editing: {t?.title}</p>
          </div>
        </div>

        <div className="p-6">
          {errors._global && (
            <div className="bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl mb-4">{errors._global}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Title" name="title" value={form.title} onChange={handleChange} error={errors.title} required />

            <div className="grid grid-cols-2 gap-4">
              <Select label="Type" name="type" value={form.type} onChange={handleChange} error={errors.type} required
                options={[
                  { value: "TECHNICAL", label: "Technical" },
                  { value: "FACILITY",  label: "Facility"  },
                  { value: "OTHER",     label: "Other"     },
                ]}
              />
              <Select label="Status" name="status" value={form.status} onChange={handleChange} error={errors.status} required
                options={Object.entries(STATUS_CFG).map(([k, v]) => ({ value: k, label: v.label }))}
              />
            </div>

            {needsResource && (
              <Field label="Resource ID" name="resourceId" type="number" value={form.resourceId} onChange={handleChange}
                error={errors.resourceId} placeholder="e.g. 5" required={needsResource} min="1" />
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
                Description <span className="text-rose-400">*</span>
              </label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-[13px] placeholder-white/15 outline-none transition-all resize-none ${
                  errors.description ? "border-rose-500/40 bg-rose-500/5" : "border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.06]"
                }`} />
              {errors.description && <p className="text-[12px] text-rose-400 font-medium">{errors.description}</p>}
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

export default EditTicket;