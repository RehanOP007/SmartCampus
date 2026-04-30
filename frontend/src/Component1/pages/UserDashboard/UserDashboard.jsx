import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import BookingManagement from "./BookingManagement";
import TicketDashboard from "./TicketManagement";
import Notifications from "../../../Component3/pages/Notifications";

// ─── Sidebar Icons ────────────────────────────────────────────────────────────
const IconBooking = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconTicket = () => (
  <svg width="18" height="18" viewBox="0 0 23 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

// ─── Nav Config ───────────────────────────────────────────────────────────────
const navItems = [
  { id: "bookings",      label: "Bookings",      Icon: IconBooking },
  { id: "tickets",       label: "Tickets",       Icon: IconTicket  },
  { id: "notifications", label: "Notifications", Icon: IconBell    },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
const UserDashboard = () => {
  const { username, role, userId, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="min-h-screen flex bg-[#0F0E47]">
      <Sidebar
        active={activeTab}
        setActive={setActiveTab}
        navItems={navItems}
        logout={logout}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Navbar username={username} role={role} />
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "bookings"      && <BookingManagement userId={userId} />}
          {activeTab === "tickets"       && <TicketDashboard />}
          {activeTab === "notifications" && <Notifications userId={userId} />}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;