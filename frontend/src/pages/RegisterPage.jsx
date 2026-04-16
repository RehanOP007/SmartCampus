import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CampusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
    <path d="M8 1L2 4.5V10l6 4.5 6-4.5V4.5L8 1zm0 1.8l4 2.5v4.4L8 12.2 4 10.2V5.7l4-2.5z"/>
  </svg>
);

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registration successful");
      window.location.href = "/smartcampus/dashboard";
    } catch (err) {
      alert(err);
    }
  };

  const fields = [
    { name: "name",     label: "Full name", type: "text",     placeholder: "Jane Smith" },
    { name: "email",    label: "Email",     type: "email",    placeholder: "jane@university.edu" },
    { name: "username", label: "Username",  type: "text",     placeholder: "janesmith" },
    { name: "password", label: "Password",  type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0E47] px-4">
      <div className="w-full max-w-md">

        <div className="bg-[#272757] border border-[#505081] rounded-2xl p-10">

          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#505081] rounded-lg flex items-center justify-center">
              <CampusIcon />
            </div>
            <span className="text-white font-medium tracking-wide">SmartCampus</span>
          </div>

          <h2 className="text-xl font-medium text-white text-center mb-1">Create an account</h2>
          <p className="text-[#8686AC] text-sm text-center mb-7">Join SmartCampus to get started</p>

          <form onSubmit={handleSubmit}>
            {fields.map(({ name, label, type, placeholder }) => (
              <div key={name} className="mb-4">
                <label className="block text-[#8686AC] text-xs font-medium uppercase tracking-widest mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  className="w-full bg-[#0F0E47]/50 border border-[#505081] text-white placeholder-[#505081] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#8686AC] transition-colors"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#505081] hover:bg-[#8686AC] text-white font-medium py-2.5 rounded-lg text-sm transition-all mt-2 disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-[#8686AC] text-sm text-center mt-5">
            Already have an account?{" "}
            <a href="/smartcampus/login" className="text-white font-medium hover:text-[#8686AC] transition-colors">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};