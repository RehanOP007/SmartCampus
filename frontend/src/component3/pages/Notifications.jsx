import React, { useState, useEffect } from "react";
import { getNotificationsByUserId, markAsRead } from "../utils/C3.api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconCheckAll = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 12 9 17 20 6" />
    <polyline points="1 12 6 17 17 6" opacity="0.5" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getTimeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const getNotificationMeta = (message) => {
  if (message.includes("APPROVED"))  return { icon: "✅", color: "#34d399", bg: "bg-emerald-950/50 border-emerald-900", text: "text-emerald-400" };
  if (message.includes("REJECTED"))  return { icon: "❌", color: "#f87171", bg: "bg-rose-950/50 border-rose-900",    text: "text-rose-400"    };
  if (message.includes("CANCELLED")) return { icon: "🚫", color: "#f87171", bg: "bg-rose-950/50 border-rose-900",    text: "text-rose-400"    };
  if (message.includes("booking"))   return { icon: "📅", color: "#818cf8", bg: "bg-indigo-950/50 border-indigo-900", text: "text-indigo-400"  };
  return                                     { icon: "🔔", color: "#8686AC", bg: "bg-[#505081]/30 border-[#505081]",  text: "text-[#8686AC]"   };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [fetchErr, setFetchErr]           = useState(null);
  const [filter, setFilter]              = useState("all");
  const [marking, setMarking]            = useState(null); // id being marked

  const load = async () => {
    try {
      setLoading(true);
      setFetchErr(null);
      const res = await getNotificationsByUserId(userId);
      const data = res.data ?? res;
      // Sort newest first
      setNotifications([...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {
      setFetchErr("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [userId]);

  const handleMarkRead = async (e, id) => {
    e.stopPropagation();
    setMarking(id);
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch {
      alert("Failed to mark as read.");
    } finally {
      setMarking(null);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    try {
      await Promise.all(unread.map(n => markAsRead(n.id)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {
      alert("Failed to mark all as read.");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "read")   return n.read;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-lg font-medium">Notifications</h2>
          <p className="text-[#8686AC] text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
          </p>
        </div>
        
      </div>

      {/* Error */}
      {fetchErr && (
        <div className="bg-rose-950/50 text-rose-400 border border-rose-900 rounded-lg px-4 py-3 text-sm mb-5">
          {fetchErr}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-5 bg-[#0F0E47]/40 border border-[#505081] rounded-xl p-1 w-fit">
        {[
          { key: "all",    label: "All",    count: notifications.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "read",   label: "Read",   count: notifications.length - unreadCount },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
              filter === tab.key
                ? "bg-[#505081] text-white"
                : "text-[#8686AC] hover:text-white"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab.key ? "bg-white/20" : "bg-[#505081]/60"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center gap-3 text-[#8686AC] py-10 justify-center">
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
          </svg>
          <span className="text-sm">Loading notifications…</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#8686AC]">
          <div className="text-4xl mb-3 opacity-30">🔕</div>
          <p className="font-medium text-white mb-1">
            {filter === "unread" ? "No unread notifications" : filter === "read" ? "No read notifications" : "No notifications yet"}
          </p>
          <p className="text-sm">
            {filter === "all" ? "We'll notify you when something happens." : "Switch to a different filter to see more."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#505081]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#505081] bg-[#0F0E47]/40">
                {["", "Message", "Received", "Status", "Actions"].map((h, i) => (
                  <th key={i} className="text-left text-[#8686AC] text-xs font-medium uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((n, i) => {
                const meta = getNotificationMeta(n.message);
                return (
                  <tr
                    key={n.id}
                    className={`border-b border-[#505081]/50 hover:bg-[#505081]/10 transition-colors ${
                      i === filtered.length - 1 ? "border-b-0" : ""
                    } ${!n.read ? "bg-[#505081]/5" : ""}`}
                  >
                    {/* Indicator dot */}
                    <td className="pl-4 pr-2 py-3 w-6">
                      {!n.read && (
                        <span className="block w-2 h-2 rounded-full bg-[#8686AC]" />
                      )}
                    </td>

                    {/* Message */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base leading-none">{meta.icon}</span>
                        <span className={`${!n.read ? "text-white font-medium" : "text-[#8686AC]"}`}>
                          {n.message}
                        </span>
                      </div>
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3 text-[#8686AC] whitespace-nowrap text-xs">
                      {getTimeAgo(n.createdAt)}
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${meta.bg} ${meta.text}`}>
                        {n.read ? "Read" : "Unread"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      {!n.read && (
                        <button
                          onClick={(e) => handleMarkRead(e, n.id)}
                          disabled={marking === n.id}
                          className="flex items-center gap-1 text-[#8686AC] hover:text-white text-xs border border-[#505081] hover:border-[#8686AC] px-2 py-1 rounded-md transition-all disabled:opacity-50"
                        >
                          <IconCheck />
                          {marking === n.id ? "Marking…" : "Mark read"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Notifications;