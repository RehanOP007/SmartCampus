// pages/Admin Dashboard/AdminSidebar.jsx
import React, { useState } from "react";
import {
  Users, UserPlus, List, ChevronDown, ChevronRight,
  Hexagon, LogOut, CalendarDays, Plus, LayoutList, Ticket, ClipboardList
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const NAV = [
  {
    key: "user-management",
    label: "User",
    icon: Users,
    children: [
      { key: "all-users", label: "All Users", icon: List     },
      { key: "add-user",  label: "Add User",  icon: UserPlus },
    ],
  },
  {
    key: "booking-management",
    label: "Booking",
    icon: CalendarDays,
    children: [
      { key: "all-bookings", label: "All Bookings", icon: LayoutList },
    ],
  },
  {
    key: "ticket-management",
    label: "Tickets",
    icon: Ticket,
    children: [
      { key: "all-tickets", label: "All Tickets", icon: ClipboardList },
    ],
  },
];

const AdminSidebar = ({ activeSection, activeSubSection, onNavigate, onLogout }) => {
  const { username, role } = useAuth();
  const [open, setOpen] = useState({
    "user-management":    true,
    "booking-management": true,
    "ticket-management":  true,
  });

  const toggle = (key) => setOpen((p) => ({ ...p, [key]: !p[key] }));

  return (
    <aside className="flex flex-col h-full w-[220px] bg-[#0a0a22] border-r border-white/[0.06]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Hexagon size={14} className="text-white" fill="rgba(255,255,255,0.15)" />
            </div>
          </div>
          <span className="text-white font-bold text-sm tracking-wide" style={{ fontFamily: "'Sora', sans-serif" }}>Admin Panel</span>
        </div>
        <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ key, label, icon: Icon, children }) => {
          const isOpen         = open[key];
          const isParentActive = activeSection === key;

          return (
            <div key={key}>
              {/* Parent */}
              <button onClick={() => toggle(key)}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group ${
                  isParentActive
                    ? "text-white bg-white/8"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}>
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={isParentActive ? "text-indigo-400" : "text-white/25 group-hover:text-white/40"} />
                  {label}
                </div>
                {isOpen
                  ? <ChevronDown size={12} className="text-white/25" />
                  : <ChevronRight size={12} className="text-white/25" />}
              </button>

              {/* Children */}
              {isOpen && (
                <div className="ml-3 mt-0.5 mb-1 pl-3 flex flex-col gap-0.5 border-l border-white/[0.07]">
                  {children.map(({ key: cKey, label: cLabel, icon: CIcon }) => {
                    const isActive = activeSection === key && activeSubSection === cKey;
                    return (
                      <button key={cKey}
                        onClick={() => onNavigate(key, cKey)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 ${
                          isActive
                            ? "bg-indigo-500/15 text-indigo-300 font-semibold"
                            : "text-white/35 hover:text-white/65 hover:bg-white/5 font-medium"
                        }`}>
                        <CIcon size={13} className={isActive ? "text-indigo-400" : "text-white/25"} />
                        {cLabel}
                        {isActive && <span className="ml-auto w-1 h-1 rounded-full bg-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] mb-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md">
            {username?.charAt(0)?.toUpperCase() ?? "A"}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-white text-[13px] font-semibold truncate leading-none">{username ?? "Admin"}</p>
            <p className="text-white/30 text-[11px] mt-0.5 leading-none">{role}</p>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/30 hover:text-rose-400 hover:bg-rose-500/8 transition-all font-medium mt-0.5">
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;