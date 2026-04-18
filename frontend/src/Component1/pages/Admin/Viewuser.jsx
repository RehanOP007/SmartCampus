// pages/Admin Dashboard/ViewUser.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Mail, AtSign, Shield, Server } from "lucide-react";
import { userAPI } from "../../utils/c1.api";

const ROLE_CFG = {
  ADMIN:      { cls: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30" },
  TECHNICIAN: { cls: "bg-cyan-500/15   text-cyan-300   ring-1 ring-cyan-500/30"   },
  USER:       { cls: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30" },
};

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-white/[0.05] last:border-0">
    <div className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
      <Icon size={14} className="text-white/30" />
    </div>
    <div className="min-w-0">
      <p className="text-white/30 text-[11px] font-semibold uppercase tracking-wider">{label}</p>
      <p className="text-white text-[13px] font-medium mt-0.5 truncate">{value ?? "—"}</p>
    </div>
  </div>
);

const ViewUser = ({ userId, onBack, onEdit, onDelete }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true); setError(null);
    userAPI.getById(userId)
      .then((r) => setUser(r.data))
      .catch(() => setError("User not found."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center py-24 gap-3 text-white/25">
      <div className="w-5 h-5 border-2 border-indigo-500/40 border-t-indigo-400 rounded-full animate-spin" />
      <span className="text-sm">Loading user…</span>
    </div>
  );

  if (error || !user) return (
    <div className="flex flex-col items-center gap-4 py-24">
      <p className="text-rose-400 text-sm">{error || "User not found."}</p>
      <button onClick={onBack} className="text-white/30 hover:text-white text-sm transition-colors">← Back</button>
    </div>
  );

  const roleCfg = ROLE_CFG[user.role] ?? { cls: "bg-white/10 text-white/50" };

  return (
    <div className="flex flex-col gap-5 max-w-lg">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white transition-colors w-fit">
        <ArrowLeft size={14} /> Back to all users
      </button>

      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-600/20 via-violet-600/10 to-transparent relative">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)" }} />
        </div>

        <div className="px-6 pb-6 -mt-10">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-indigo-500/25 ring-4 ring-[#0d0d28] mb-4">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>

          <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
            <div>
              <h2 className="text-white text-xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>{user.name}</h2>
              <p className="text-white/30 text-sm mt-0.5">@{user.username}</p>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${roleCfg.cls}`}>
              {user.role?.charAt(0) + user.role?.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Info rows */}
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-2">
            <InfoRow icon={Shield}   label="User ID"  value={`#${user.id}`}      />
            <InfoRow icon={Mail}     label="Email"    value={user.email}          />
            <InfoRow icon={AtSign}   label="Username" value={`@${user.username}`} />
            <InfoRow icon={Server}   label="Provider" value={user.provider}       />
            <InfoRow icon={Shield}   label="Role"     value={user.role}           />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <button onClick={() => onEdit(user)}
              className="flex items-center gap-2 flex-1 justify-center bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              <Pencil size={14} /> Edit User
            </button>
            <button onClick={() => onDelete(user.id)}
              className="flex items-center gap-2 flex-1 justify-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[13px] font-semibold py-3 rounded-xl ring-1 ring-rose-500/20 transition-all active:scale-95">
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser;