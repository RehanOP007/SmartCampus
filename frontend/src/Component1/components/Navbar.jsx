import React from "react";

const Navbar = ({ username, role }) => {
  return (
    <header className="h-14 bg-[#0F0E47]/80 backdrop-blur-xl border-b border-[#505081] flex items-center justify-between px-6 shrink-0">
      <p className="text-[#8686AC] text-sm">
        Good to see you,{" "}
        <span className="text-white font-medium">{username}</span>
      </p>

      <div className="flex items-center gap-4">
        <span className="text-xs bg-[#505081]/40 text-[#8686AC] border border-[#505081] px-2.5 py-1 rounded-full uppercase tracking-wider">
          {role}
        </span>
      </div>
    </header>
  );
};

export default Navbar;