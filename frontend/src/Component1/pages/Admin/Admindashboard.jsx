// pages/Admin/AdminDashboard.jsx
import React, { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar      from "./Adminsidebar";
import UserManagement    from "./Usermanagement";
import BookingManagement from "./BookingManagement";
import TicketManagement from "./Ticketmanagement";
import { useAuth }       from "../../../context/AuthContext";

const AdminDashboard = () => {
  const { logout } = useAuth();

  const [activeSection,    setActiveSection]    = useState("user-management");
  const [activeSubSection, setActiveSubSection] = useState("all-users");
  const [mobileOpen,       setMobileOpen]       = useState(false);

  const handleNavigate = (section, subSection) => {
    setActiveSection(section);
    setActiveSubSection(subSection ?? "all-users");
    setMobileOpen(false);
  };

  const titles = {
    "all-users":    { title: "Users",    sub: "Manage your platform users and settings"    },
    "add-user":     { title: "Add User",            sub: "Create a new platform account"              },
    "all-bookings": { title: "Bookings",  sub: "View and manage all booking requests"       },
    "all-tickets":  { title: "Tickets",   sub: "View and manage all support tickets"        },
  };
  const { title, sub } = titles[activeSubSection] ?? titles["all-users"];

  return (
    <div className="flex h-screen bg-[#07071a] overflow-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Sora:wght@600;700&display=swap');`}</style>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <AdminSidebar activeSection={activeSection} activeSubSection={activeSubSection} onNavigate={handleNavigate} onLogout={logout} />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-50">
            <AdminSidebar activeSection={activeSection} activeSubSection={activeSubSection} onNavigate={handleNavigate} onLogout={logout} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 px-8 py-5 border-b border-white/[0.06] bg-[#07071a]/95 backdrop-blur-xl flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all">
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-white font-bold text-[1.25rem] tracking-tight leading-none" style={{ fontFamily: "'Sora', sans-serif" }}>{title}</h1>
            <p className="text-white/30 text-xs mt-1.5 font-normal">{sub}</p>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {activeSection === "user-management"    && <UserManagement    activeSubSection={activeSubSection} onNavigate={handleNavigate} />}
          {activeSection === "booking-management" && <BookingManagement activeSubSection={activeSubSection} onNavigate={handleNavigate} />}
          {activeSection === "ticket-management"  && <TicketManagement  activeSubSection={activeSubSection} onNavigate={handleNavigate} />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;