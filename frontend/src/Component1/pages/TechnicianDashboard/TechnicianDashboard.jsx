import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { ticketAPI } from "../../utils/c1.api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconTicket = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconPaperclip = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);
const IconComment = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconFile = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
  </svg>
);
const IconUpload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const TECH_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

const statusStyles = {
  OPEN:        "bg-[#505081]/30 text-[#8686AC] border-[#505081]",
  IN_PROGRESS: "bg-amber-950/50 text-amber-400 border-amber-900",
  RESOLVED:    "bg-emerald-950/50 text-emerald-400 border-emerald-900",
  CLOSED:      "bg-[#0F0E47]/60 text-[#505081] border-[#505081]",
  REJECTED:    "bg-rose-950/50 text-rose-400 border-rose-900",
};

const typeStyles = {
  TECHNICAL: "bg-blue-950/50 text-blue-400 border-blue-900",
  FACILITY:  "bg-purple-950/50 text-purple-400 border-purple-900",
  OTHER:     "bg-[#505081]/30 text-[#8686AC] border-[#505081]",
};

const STATUS_FLOW = { OPEN: "IN_PROGRESS", IN_PROGRESS: "RESOLVED", RESOLVED: "CLOSED" };

// ─── Shared UI ────────────────────────────────────────────────────────────────
const inputCls  = "w-full bg-[#0F0E47]/60 border border-[#505081] text-white placeholder-[#505081] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#8686AC] transition-colors";
const labelCls  = "block text-[#8686AC] text-xs font-medium uppercase tracking-widest mb-1.5";

const StatusBadge = ({ status }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusStyles[status] ?? statusStyles.OPEN}`}>
    {status?.replace("_", " ")}
  </span>
);

const TypeBadge = ({ type }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${typeStyles[type] ?? typeStyles.OTHER}`}>
    {type}
  </span>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className={`bg-[#272757] border border-[#505081] rounded-2xl shadow-2xl max-h-[90vh] flex flex-col w-full ${wide ? "max-w-2xl" : "max-w-lg"}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#505081] shrink-0">
        <h3 className="text-white font-medium">{title}</h3>
        <button onClick={onClose} className="text-[#8686AC] hover:text-white transition-colors"><IconX /></button>
      </div>
      <div className="p-6 overflow-y-auto flex-1">{children}</div>
    </div>
  </div>
);

// ─── Ticket Detail Modal ──────────────────────────────────────────────────────
const TicketDetailModal = ({ ticket, onClose, onStatusUpdated, userId }) => {
  const [status, setStatus]           = useState(ticket.status);
  const [comment, setComment]         = useState("");
  const [attachments, setAttachments] = useState([]);
  const [loadingAtt, setLoadingAtt]   = useState(true);
  const [busyStatus, setBusyStatus]   = useState(false);
  const [busyComment, setBusyComment] = useState(false);
  const [busyUpload, setBusyUpload]   = useState(false);
  const [feedback, setFeedback]       = useState(null);
  const [uploadForm, setUploadForm]   = useState({ fileUrl: "", fileName: "" }); // ← NEW

  const flash = (msg, ok = true) => {
    setFeedback({ msg, ok });
    setTimeout(() => setFeedback(null), 3000);
  };

  const loadAttachments = () => {
    setLoadingAtt(true);
    ticketAPI.getAttachments(ticket.id)
      .then(res => setAttachments(res.data ?? res))
      .catch(() => flash("Failed to load attachments.", false))
      .finally(() => setLoadingAtt(false));
  };

  useEffect(() => { loadAttachments(); }, [ticket.id]);

  const handleStatusChange = async (newStatus) => {
    setBusyStatus(true);
    try {
      await ticketAPI.updateStatus(ticket.id, newStatus);
      setStatus(newStatus);
      onStatusUpdated(ticket.id, newStatus);
      flash(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch { flash("Failed to update status.", false); }
    finally { setBusyStatus(false); }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setBusyComment(true);
    try {
      await ticketAPI.addComment(ticket.id, comment.trim(), userId);
      setComment("");
      flash("Comment added.");
    } catch { flash("Failed to add comment.", false); }
    finally { setBusyComment(false); }
  };

  // ── Updated upload handler ────────────────────────────────────────────────
  const handleUpload = async () => {
    const { fileUrl, fileName } = uploadForm;
    if (!fileUrl.trim() || !fileName.trim()) {
      flash("Please provide both a file name and URL.", false);
      return;
    }
    setBusyUpload(true);
    try {
      await ticketAPI.uploadAttachment(ticket.id, fileUrl.trim(), fileName.trim());
      setUploadForm({ fileUrl: "", fileName: "" });
      loadAttachments();
      flash("Attachment added.");
    } catch { flash("Upload failed.", false); }
    finally { setBusyUpload(false); }
  };

  const handleDeleteAttachment = async (attId) => {
    if (!window.confirm("Remove this attachment?")) return;
    try {
      await ticketAPI.deleteAttachment(attId);
      loadAttachments();
      flash("Attachment removed.");
    } catch { flash("Failed to remove.", false); }
  };

  const nextStatus = STATUS_FLOW[status];
  const isClosed   = status === "CLOSED" || status === "REJECTED";

  return (
    <Modal title={`Ticket #${ticket.id} — ${ticket.title}`} onClose={onClose} wide>
      {/* Feedback banner */}
      {feedback && (
        <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm border ${feedback.ok
          ? "bg-emerald-950/50 text-emerald-400 border-emerald-900"
          : "bg-rose-950/50 text-rose-400 border-rose-900"}`}>
          {feedback.msg}
        </div>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap gap-2 mb-5">
        <TypeBadge type={ticket.type} />
        <StatusBadge status={status} />
      </div>

      {ticket.description && (
        <p className="text-[#8686AC] text-sm mb-6 leading-relaxed">{ticket.description}</p>
      )}

      {/* ── Status control ── */}
      <div className="bg-[#0F0E47]/40 border border-[#505081] rounded-xl p-4 mb-5">
        <p className={labelCls}>Update status</p>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {TECH_STATUSES.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button
                disabled={busyStatus || isClosed || s === status}
                onClick={() => handleStatusChange(s)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all disabled:cursor-not-allowed ${
                  s === status
                    ? statusStyles[s] + " opacity-100"
                    : "border-[#505081] text-[#505081] hover:border-[#8686AC] hover:text-[#8686AC] disabled:opacity-40"
                }`}
              >
                {s.replace("_", " ")}
              </button>
              {i < TECH_STATUSES.length - 1 && (
                <span className="text-[#505081]"><IconArrowRight /></span>
              )}
            </div>
          ))}
        </div>
        {nextStatus && !isClosed && (
          <button
            disabled={busyStatus}
            onClick={() => handleStatusChange(nextStatus)}
            className="flex items-center gap-2 bg-[#505081] hover:bg-[#8686AC] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {busyStatus ? "Updating…" : `Advance to ${nextStatus.replace("_", " ")}`}
            <IconArrowRight />
          </button>
        )}
        {isClosed && <p className="text-[#505081] text-xs italic">This ticket is in a terminal state.</p>}
      </div>

      {/* ── Add Comment ── */}
      <div className="bg-[#0F0E47]/40 border border-[#505081] rounded-xl p-4 mb-5">
        <p className={labelCls}>Add comment</p>
        <textarea
          className={inputCls + " resize-none h-20 mb-3"}
          placeholder="Write a comment or update for this ticket…"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button
          disabled={busyComment || !comment.trim()}
          onClick={handleComment}
          className="flex items-center gap-2 bg-[#505081] hover:bg-[#8686AC] text-white text-sm font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-50"
        >
          <IconComment /> {busyComment ? "Posting…" : "Post comment"}
        </button>
      </div>

      {/* ── Attachments ── */}
      <div className="bg-[#0F0E47]/40 border border-[#505081] rounded-xl p-4">
        <p className={labelCls + " mb-3"}>Attachments</p>

        {/* Upload form — two fields + button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
          <input
            type="text"
            className={inputCls}
            placeholder="File name  e.g. report.pdf"
            value={uploadForm.fileName}
            onChange={e => setUploadForm(f => ({ ...f, fileName: e.target.value }))}
          />
          <input
            type="text"
            className={inputCls}
            placeholder="File URL  e.g. https://…"
            value={uploadForm.fileUrl}
            onChange={e => setUploadForm(f => ({ ...f, fileUrl: e.target.value }))}
          />
        </div>
        <button
          disabled={busyUpload || !uploadForm.fileUrl.trim() || !uploadForm.fileName.trim()}
          onClick={handleUpload}
          className="flex items-center gap-1.5 text-xs border border-[#505081] hover:border-[#8686AC] text-[#8686AC] hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 mb-4"
        >
          <IconUpload /> {busyUpload ? "Saving…" : "Add attachment"}
        </button>

        {/* Attachment list */}
        {loadingAtt && <p className="text-[#8686AC] text-xs text-center py-4">Loading…</p>}
        {!loadingAtt && attachments.length === 0 && (
          <p className="text-[#505081] text-xs italic text-center py-4">No attachments yet.</p>
        )}
        {!loadingAtt && attachments.length > 0 && (
          <ul className="space-y-2">
            {attachments.map(a => (
              <li key={a.id} className="flex items-center gap-3 bg-[#272757] border border-[#505081] rounded-lg px-3 py-2.5">
                <span className="text-[#8686AC] shrink-0"><IconFile /></span>
                <span className="text-white text-sm flex-1 truncate">{a.fileName}</span>
                <a href={a.fileUrl} target="_blank" rel="noreferrer"
                  className="text-xs text-[#8686AC] hover:text-white border border-[#505081] hover:border-[#8686AC] px-2.5 py-1 rounded-md transition-all shrink-0">
                  View
                </a>
                <button onClick={() => handleDeleteAttachment(a.id)}
                  className="text-rose-400 hover:text-rose-300 border border-rose-900 hover:border-rose-400 p-1 rounded-md transition-all shrink-0">
                  <IconTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
};

// ─── Ticket Row ───────────────────────────────────────────────────────────────
const TicketRow = ({ ticket, onManage, isLast }) => (
  <tr className={`border-b border-[#505081]/50 hover:bg-[#505081]/10 transition-colors ${isLast ? "border-b-0" : ""}`}>
    <td className="px-4 py-3">
      <p className="text-white font-medium text-sm">{ticket.title}</p>
      {ticket.description && (
        <p className="text-[#8686AC] text-xs mt-0.5 line-clamp-1">{ticket.description}</p>
      )}
    </td>
    <td className="px-4 py-3"><TypeBadge type={ticket.type} /></td>
    <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
    <td className="px-4 py-3 text-[#8686AC] text-sm">#{ticket.createdBy}</td>
    <td className="px-4 py-3">
      <button
        onClick={() => onManage(ticket)}
        className="flex items-center gap-1.5 text-xs border border-[#505081] hover:border-[#8686AC] text-[#8686AC] hover:text-white px-3 py-1.5 rounded-md transition-all"
      >
        <IconPaperclip /> Manage
      </button>
    </td>
  </tr>
);

// ─── Ticket Management Tab ────────────────────────────────────────────────────
const TechnicianTickets = ({ userId }) => {
  const [tickets, setTickets]     = useState([]);
  const [managing, setManaging]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [err, setErr]             = useState(null);
  const [filter, setFilter]       = useState("ALL");

  const load = async () => {
    setLoading(true);
    try {
      const res = await ticketAPI.getAll();
      const all = res.data ?? res;
      setTickets(all.filter(t => t.assignedTo === userId));
    } catch { setErr("Failed to load tickets."); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStatusUpdated = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
  };

  const STATUSES = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
  const displayed = filter === "ALL" ? tickets : tickets.filter(t => t.status === filter);

  const counts = {
    total:      tickets.length,
    open:       tickets.filter(t => t.status === "OPEN").length,
    inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved:   tickets.filter(t => t.status === "RESOLVED").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-white text-lg font-medium">My Assigned Tickets</h2>
        <p className="text-[#8686AC] text-sm mt-0.5">Tickets assigned to you — update status, add comments and attachments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total",       value: counts.total },
          { label: "Open",        value: counts.open },
          { label: "In progress", value: counts.inProgress },
          { label: "Resolved",    value: counts.resolved },
        ].map(s => (
          <div key={s.label} className="bg-[#0F0E47]/40 border border-[#505081] rounded-xl px-4 py-3">
            <p className="text-[#8686AC] text-xs mb-1">{s.label}</p>
            <p className="text-white text-2xl font-medium">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1 flex-wrap mb-5">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === s
                ? "bg-[#505081] text-white"
                : "text-[#8686AC] hover:text-white hover:bg-[#505081]/30"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {err && (
        <div className="bg-rose-950/50 text-rose-400 border border-rose-900 rounded-lg px-4 py-3 text-sm mb-5">{err}</div>
      )}

      {loading ? (
        <div className="text-center py-16 text-[#8686AC] text-sm">Loading tickets…</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-[#8686AC]">
          <div className="text-4xl mb-3 opacity-30">🔧</div>
          <p className="font-medium text-white mb-1">No tickets found</p>
          <p className="text-sm">{filter !== "ALL" ? "Try a different filter." : "No tickets are assigned to you yet."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#505081]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#505081] bg-[#0F0E47]/40">
                {["Title", "Type", "Status", "Reported by", "Actions"].map(h => (
                  <th key={h} className="text-left text-[#8686AC] text-xs font-medium uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((t, i) => (
                <TicketRow
                  key={t.id}
                  ticket={t}
                  onManage={setManaging}
                  isLast={i === displayed.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {managing && (
        <TicketDetailModal
          userId={userId}
          ticket={managing}
          onClose={() => setManaging(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
};

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const navItems = [
  { id: "tickets", label: "Tickets", Icon: IconTicket },
];

// ─── Root Dashboard ───────────────────────────────────────────────────────────
const TechnicianDashboard = () => {
  const { username, role, userId, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("tickets");

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
          {activeTab === "tickets" && <TechnicianTickets userId={userId} />}
        </main>
      </div>
    </div>
  );
};

export default TechnicianDashboard;