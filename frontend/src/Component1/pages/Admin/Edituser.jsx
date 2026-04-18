// pages/Admin Dashboard/EditUser.jsx
import React, { useState } from "react";
import { Save, Eye, EyeOff, ChevronDown, CheckCircle2 } from "lucide-react";

const validate = (f) => {
  const e = {};
  if (!f.name || f.name.trim().length < 2)      e.name     = "Name must be at least 2 characters.";
  if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (!f.username || f.username.length < 3)      e.username = "Username must be at least 3 characters.";
  if (/\s/.test(f.username))                      e.username = "Username cannot contain spaces.";
  if (f.password) {
    if (f.password.length < 8)                    e.password = "At least 8 characters required.";
    else if (!/[A-Z]/.test(f.password))           e.password = "Must contain one uppercase letter.";
    else if (!/[0-9]/.test(f.password))           e.password = "Must contain one number.";
  }
  if (!["USER","ADMIN","TECHNICIAN"].includes(f.role)) e.role = "Select a valid role.";
  return e;
};

const Field = ({ label, name, type = "text", value, onChange, error, placeholder, required }) => {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
        {label}{required && <span className="text-rose-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <input type={isPass ? (show ? "text" : "password") : type}
          name={name} value={value} onChange={onChange} placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl bg-white/[0.04] border text-white text-[13px] placeholder-white/15 outline-none transition-all ${isPass ? "pr-11" : ""} ${
            error ? "border-rose-500/40 focus:border-rose-500/60 bg-rose-500/5" : "border-white/[0.08] focus:border-indigo-500/50 focus:bg-white/[0.06]"
          }`} />
        {isPass && (
          <button type="button" onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {error && <p className="text-[12px] text-rose-400 font-medium">{error}</p>}
    </div>
  );
};

const checks = [
  { label: "At least 8 characters", test: (p) => p.length >= 8    },
  { label: "One uppercase letter",  test: (p) => /[A-Z]/.test(p)  },
  { label: "One number",            test: (p) => /[0-9]/.test(p)  },
];

const EditUser = ({ user, onBack, onSubmit }) => {
  const [form, setForm] = useState({
    name: user?.name ?? "", email: user?.email ?? "",
    username: user?.username ?? "", password: "", role: user?.role ?? "USER",
  });
  const [errors,     setErrors] = useState({});
  const [submitting, setSub]    = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    try {
      setSub(true);
      await onSubmit(user.id, payload);
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      if (msg.toLowerCase().includes("email"))         setErrors({ email: "Email already in use." });
      else if (msg.toLowerCase().includes("username")) setErrors({ username: "Username already taken." });
      else setErrors({ _global: msg || "Failed to update user." });
    } finally { setSub(false); }
  };

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/25 to-violet-500/25 ring-1 ring-white/10 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-white font-bold text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>Edit User</h2>
            <p className="text-white/25 text-[12px] mt-0.5">Editing account for <span className="text-white/50">{user?.name}</span></p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {errors._global && (
            <div className="bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl">{errors._global}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Full Name"     name="name"     value={form.name}     onChange={handleChange} error={errors.name}     required />
            <Field label="Email Address" name="email"    type="email" value={form.email}    onChange={handleChange} error={errors.email}    required />
            <Field label="Username"      name="username" value={form.username} onChange={handleChange} error={errors.username} required />

            <div>
              <Field label="New Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} placeholder="Leave blank to keep current" />
              {form.password && (
                <div className="mt-2 flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  {checks.map(({ label, test }) => {
                    const ok = test(form.password);
                    return (
                      <div key={label} className={`flex items-center gap-2 text-[12px] transition-colors ${ok ? "text-emerald-400" : "text-white/25"}`}>
                        <CheckCircle2 size={12} className={ok ? "text-emerald-400" : "text-white/15"} />
                        {label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">Role <span className="text-rose-400">*</span></label>
              <div className="relative">
                <select name="role" value={form.role} onChange={handleChange}
                  className="w-full px-4 py-3 pr-9 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
                  <option value="USER"       className="bg-[#12122e]">User</option>
                  <option value="ADMIN"      className="bg-[#12122e]">Admin</option>
                  <option value="TECHNICIAN" className="bg-[#12122e]">Technician</option>
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
              </div>
              {errors.role && <p className="text-[12px] text-rose-400">{errors.role}</p>}
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

export default EditUser;