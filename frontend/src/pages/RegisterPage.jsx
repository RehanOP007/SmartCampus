import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CampusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
    <path d="M8 1L2 4.5V10l6 4.5 6-4.5V4.5L8 1zm0 1.8l4 2.5v4.4L8 12.2 4 10.2V5.7l4-2.5z"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.576c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.576 9 3.576z" fill="#EA4335"/>
  </svg>
);

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

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

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#505081]" />
            <span className="text-[#8686AC] text-xs">or</span>
            <div className="flex-1 h-px bg-[#505081]" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-2 border border-[#505081] hover:border-[#8686AC] hover:bg-[#505081]/30 text-white font-medium py-2.5 rounded-lg text-sm transition-all"
          >
            <GoogleIcon />
            Continue with Google
          </button>

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