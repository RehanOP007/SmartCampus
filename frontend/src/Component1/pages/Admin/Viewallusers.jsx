// pages/Admin Dashboard/ViewAllUsers.jsx
import React, { useState } from "react";
import { Pencil, Trash2, Eye, UserPlus, Search, ChevronDown, Users } from "lucide-react";

const ROLE_CFG = {
  ADMIN:      { label: "Admin",      cls: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30" },
  TECHNICIAN: { label: "Technician", cls: "bg-cyan-500/15   text-cyan-300   ring-1 ring-cyan-500/30"   },
  USER:       { label: "User",       cls: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30" },
};

const RoleBadge = ({ role }) => {
  const cfg = ROLE_CFG[role] ?? { label: role, cls: "bg-white/10 text-white/50" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
};

const Avatar = ({ name, size = "sm" }) => {
  const s = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 ring-1 ring-white/10 flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {name?.charAt(0)?.toUpperCase() ?? "?"}
    </div>
  );
};

const ViewAllUsers = ({ users, loading, error, onView, onEdit, onDelete, onAddUser }) => {
  const [roleFilter, setRoleFilter] = useState("");
  const [search,     setSearch]     = useState("");
  const [pending,    setPending]    = useState(null);

  const filtered = users.filter((u) => {
    const matchRole   = roleFilter ? u.role === roleFilter : true;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || [u.name, u.email, u.username].some((f) => f?.toLowerCase().includes(q));
    return matchRole && matchSearch;
  });

  // Stats
  const counts = { ADMIN: 0, TECHNICIAN: 0, USER: 0 };
  users.forEach((u) => { if (counts[u.role] !== undefined) counts[u.role]++; });

  return (
    <div className="flex flex-col gap-6">

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total Users",   value: users.length,      accent: "from-indigo-500/20 to-violet-500/20", dot: "bg-indigo-400" },
          { label: "Admins",        value: counts.ADMIN,       accent: "from-violet-500/15 to-purple-500/15", dot: "bg-violet-400" },
          { label: "Technicians",   value: counts.TECHNICIAN,  accent: "from-cyan-500/15   to-sky-500/15",    dot: "bg-cyan-400"   },
          { label: "Users",         value: counts.USER,        accent: "from-emerald-500/15 to-teal-500/15",  dot: "bg-emerald-400"},
        ].map(({ label, value, accent, dot }) => (
          <div key={label} className={`flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r ${accent} border border-white/[0.06] backdrop-blur-sm`}>
            <div className={`w-2 h-2 rounded-full ${dot} shadow-lg`} style={{ boxShadow: `0 0 6px currentColor` }} />
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
            <Users size={16} className="text-indigo-400" />
            <h2 className="text-white font-semibold text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>All Users</h2>
            <span className="ml-1 text-xs text-white/25 font-medium">{filtered.length} shown</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-white/[0.05]">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input type="text" placeholder="Search name, email, username…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all" />
          </div>
          <div className="relative w-full sm:w-40">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2.5 pr-8 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
              <option value="" className="bg-[#12122e]">All Roles</option>
              <option value="ADMIN"       className="bg-[#12122e]">Admin</option>
              <option value="TECHNICIAN"  className="bg-[#12122e]">Technician</option>
              <option value="USER"        className="bg-[#12122e]">User</option>
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-4 bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl">{error}</div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {[
                  { label: "ID",       cls: "" },
                  { label: "User",     cls: "" },
                  { label: "Username", cls: "hidden sm:table-cell" },
                  { label: "Email",    cls: "hidden md:table-cell" },
                  { label: "Role",     cls: "" },
                  { label: "Actions",  cls: "text-right" },
                ].map(({ label, cls }) => (
                  <th key={label} className={`px-6 py-3.5 text-left text-[11px] text-white/25 font-semibold uppercase tracking-widest ${cls}`}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-16 text-white/25">
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-4 h-4 border-2 border-indigo-500/40 border-t-indigo-400 rounded-full animate-spin" />
                    <span className="text-sm">Loading users…</span>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-white/25 text-sm">No users found.</td></tr>
              ) : filtered.map((user) => (
                <tr key={user.id}
                  onClick={() => onView(user.id)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                  <td className="px-6 py-4 text-white/25 font-mono text-xs">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} />
                      <span className="text-white text-[13px] font-medium group-hover:text-indigo-200 transition-colors">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/35 text-[13px] hidden sm:table-cell">@{user.username}</td>
                  <td className="px-6 py-4 text-white/35 text-[13px] hidden md:table-cell">{user.email}</td>
                  <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => onView(user.id)}
                        className="p-2 rounded-lg text-white/25 hover:text-white hover:bg-white/8 transition-all" title="View">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => onEdit(user)}
                        className="p-2 rounded-lg text-white/25 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all" title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setPending(user)}
                        className="p-2 rounded-lg text-white/25 hover:text-rose-400 hover:bg-rose-500/10 transition-all" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm modal */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setPending(null)} />
          <div className="relative z-10 w-full max-w-sm bg-[#0f0f2e] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center">
                <Trash2 size={18} className="text-rose-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>Delete User</h3>
                <p className="text-white/35 text-xs">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-medium">"{pending.name}"</span>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setPending(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/50 border border-white/10 hover:bg-white/5 hover:text-white transition-all">
                Cancel
              </button>
              <button onClick={() => { onDelete(pending.id); setPending(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllUsers;