import React from "react";
import { LogOut as IconLogout } from "lucide-react";

const CampusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
    <path d="M8 1L2 4.5V10l6 4.5 6-4.5V4.5L8 1zm0 1.8l4 2.5v4.4L8 12.2 4 10.2V5.7l4-2.5z"/>
  </svg>
);

const Sidebar = ({ active, setActive, navItems, logout }) => {
  return (
    <aside className="w-56 shrink-0 bg-[#272757] border-r border-[#505081] flex flex-col h-screen sticky top-0">
      
      {/* Logo Section */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[#505081]">
        <div className="w-7 h-7 bg-[#505081] rounded-lg flex items-center justify-center">
          <CampusIcon />
        </div>
        <span className="text-white font-medium text-sm tracking-wide">
          SmartCampus
        </span>
      </div>

      {/* Navigation - Main Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
              active === id
                ? "bg-[#505081] text-white"
                : "text-[#8686AC] hover:text-white hover:bg-[#505081]/30"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom Section - Logout */}
      <div className="p-3 border-t border-[#505081]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-all text-left"
        >
          <IconLogout size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;