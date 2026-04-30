import React, { useState } from "react";
import { PackagePlus, ArrowLeft, ChevronDown } from "lucide-react";
import resourceService from "../services/resourceService";

// ── Validation ────────────────────────────────────────────────────────────────
const validate = (f) => {
  const e = {};
  if (!f.name || f.name.trim().length < 3)   e.name     = "Name must be at least 3 characters.";
  if (f.name && f.name.trim().length > 50)    e.name     = "Name must be less than 50 characters.";
  if (!f.location || f.location.trim().length < 2) e.location = "Location must be at least 2 characters.";
  if (!f.capacity)                             e.capacity = "Capacity is required.";
  else if (Number(f.capacity) <= 0)            e.capacity = "Capacity must be greater than 0.";
  else if (Number(f.capacity) > 500)           e.capacity = "Capacity cannot exceed 500.";
  if (!["ROOM","LAB","EQUIPMENT"].includes(f.type)) e.type = "Select a valid type.";
  return e;
};

// ── Field Component ───────────────────────────────────────────────────────────
const Field = ({ label, name, type = "text", value, onChange, error, placeholder, required, min, max }) => (
  <div className="flex flex-col gap-1.5 text-left">
    <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
      {label}{required && <span className="text-rose-400 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      max={max}
      className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-[13px] placeholder-white/15 outline-none transition-all ${
        error
          ? "border-rose-500/40 focus:border-rose-500/60 bg-rose-500/5"
          : "border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.06]"
      }`}
    />
    {error && <p className="text-[12px] text-rose-400 font-medium">{error}</p>}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const INIT = { name: "", type: "ROOM", capacity: "", location: "", status: "ACTIVE" };

const AddResource = ({ onBack, onSuccess }) => {
  const [form,       setForm]       = useState(INIT);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setSubmitting(true);
      await resourceService.create({ ...form, capacity: parseInt(form.capacity, 10) });
      onSuccess("Resource created successfully.");
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      setErrors({ _global: msg || "Failed to create resource. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-10 px-4">
      <div className="flex flex-col gap-4 w-full max-w-lg">

        {/* Back button */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-white/40 hover:text-white transition-all w-fit py-1"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          <span className="text-[14px] font-medium">Back To All Resources</span>
        </button>

        {/* Card */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden shadow-2xl">

          {/* Card header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/25 flex items-center justify-center">
              <PackagePlus size={18} className="text-indigo-400" />
            </div>
            <div className="text-left">
              <h2 className="text-white font-bold text-[16px] tracking-tight">Add New Resource</h2>
              <p className="text-white/25 text-[12px]">Fill in the details to create a resource</p>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            {errors._global && (
              <div className="bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl">
                {errors._global}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <Field
                label="Resource Name" name="name" value={form.name}
                onChange={handleChange} error={errors.name}
                placeholder="e.g., Computer Laboratory A" required
              />

              {/* Type + Capacity row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
                    Type <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="type" value={form.type} onChange={handleChange}
                      className={`w-full px-4 py-3 pr-9 rounded-xl bg-white/[0.04] border text-white text-[13px] outline-none transition-all appearance-none cursor-pointer ${
                        errors.type ? "border-rose-500/40" : "border-white/[0.08] focus:border-indigo-500/50"
                      }`}
                    >
                      <option value="ROOM"      className="bg-[#12122e]">🏛️ Room</option>
                      <option value="LAB"       className="bg-[#12122e]">🔬 Laboratory</option>
                      <option value="EQUIPMENT" className="bg-[#12122e]">🖥️ Equipment</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  </div>
                  {errors.type && <p className="text-[12px] text-rose-400 font-medium">{errors.type}</p>}
                </div>

                {/* Capacity */}
                <Field
                  label="Capacity" name="capacity" type="number" value={form.capacity}
                  onChange={handleChange} error={errors.capacity}
                  placeholder="No. of people" required min="1" max="500"
                />
              </div>

              {/* Location */}
              <Field
                label="Location" name="location" value={form.location}
                onChange={handleChange} error={errors.location}
                placeholder="e.g., Block A, Floor 2, Room 201" required
              />

              {/* Status */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">Status</label>
                <div className="relative">
                  <select
                    name="status" value={form.status} onChange={handleChange}
                    className="w-full px-4 py-3 pr-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] outline-none transition-all appearance-none cursor-pointer focus:border-indigo-500/50"
                  >
                    <option value="ACTIVE"         className="bg-[#12122e]">✅ Active (Available for booking)</option>
                    <option value="OUT_OF_SERVICE"  className="bg-[#12122e]">❌ Out of Service (Not available)</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={onBack}
                  className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white/40 border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting}
                  className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95"
                >
                  {submitting
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><PackagePlus size={14} /> Create Resource</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddResource;


// Add this to display