import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { createTicket, getAllTickets, deleteTicket, getAttachments, getAllResources } from "../../../Component3/utils/C3.api";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconPaperclip = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconFile = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
  </svg>
);

// ─── Status & Type config ─────────────────────────────────────────────────────
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

// ─── Shared UI ────────────────────────────────────────────────────────────────
const inputCls = "w-full bg-[#0F0E47]/60 border border-[#505081] text-white placeholder-[#505081] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#8686AC] transition-colors";
const labelCls = "block text-[#8686AC] text-xs font-medium uppercase tracking-widest mb-1.5";

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-[#272757] border border-[#505081] rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#505081] shrink-0">
        <h3 className="text-white font-medium">{title}</h3>
        <button onClick={onClose} className="text-[#8686AC] hover:text-white transition-colors"><IconX /></button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);

// ─── Attachments Panel ────────────────────────────────────────────────────────
const AttachmentsPanel = ({ ticketId, onClose }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    getAttachments(ticketId)
      .then(res => setAttachments(res.data ?? res))
      .catch(() => setErr("Failed to load attachments."))
      .finally(() => setLoading(false));
  }, [ticketId]);

  return (
    <Modal title="Attachments" onClose={onClose}>
      {loading && <p className="text-[#8686AC] text-sm text-center py-6">Loading…</p>}
      {err     && <p className="text-rose-400 text-sm">{err}</p>}
      {!loading && !err && attachments.length === 0 && (
        <div className="text-center py-8 text-[#8686AC]">
          <div className="opacity-30 text-3xl mb-2">📎</div>
          <p className="text-sm">No attachments for this ticket.</p>
        </div>
      )}
      {!loading && attachments.length > 0 && (
        <ul className="space-y-2">
          {attachments.map(a => (
            <li key={a.id} className="flex items-center gap-3 bg-[#0F0E47]/50 border border-[#505081] rounded-lg px-4 py-3">
              <span className="text-[#8686AC]"><IconFile /></span>
              <span className="text-white text-sm flex-1 truncate">{a.fileName}</span>
                <a 
                href={a.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#8686AC] hover:text-white border border-[#505081] hover:border-[#8686AC] px-2.5 py-1 rounded-md transition-all"
                >
                View
                </a>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

// ─── Create Ticket Form ───────────────────────────────────────────────────────
const TYPES = ["TECHNICAL", "FACILITY", "OTHER"];

const CreateTicketForm = ({ resources, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState({ title: "", type: "TECHNICAL", resourceId: "", description: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const needsResource = form.type === "TECHNICAL" || form.type === "FACILITY";

  return (
    <>
      <Field label="Title">
        <input
          type="text"
          className={inputCls}
          placeholder="e.g. Projector not working"
          value={form.title}
          onChange={e => set("title", e.target.value)}
          required
        />
      </Field>

      <Field label="Type">
        <div className="relative">
          <select
            className={inputCls + " appearance-none pr-8"}
            value={form.type}
            onChange={e => set("type", e.target.value)}
          >
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8686AC] pointer-events-none">
            <IconChevronDown />
          </span>
        </div>
      </Field>

      {needsResource && (
        <Field label="Resource">
          <div className="relative">
            <select
              className={inputCls + " appearance-none pr-8"}
              value={form.resourceId}
              onChange={e => set("resourceId", e.target.value)}
              required
            >
              <option value="">Select a resource</option>
              {resources.map(r => (
                <option key={r.id} value={r.id}>{r.name} — {r.location}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8686AC] pointer-events-none">
              <IconChevronDown />
            </span>
          </div>
        </Field>
      )}

      <Field label="Description">
        <textarea
          className={inputCls + " resize-none h-24"}
          placeholder="Describe the issue in detail…"
          value={form.description}
          onChange={e => set("description", e.target.value)}
          required
        />
      </Field>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onClose}
          className="flex-1 border border-[#505081] hover:bg-[#505081]/30 text-[#8686AC] hover:text-white font-medium py-2.5 rounded-lg text-sm transition-all"
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit(form)}
          disabled={loading}
          className="flex-1 bg-[#505081] hover:bg-[#8686AC] text-white font-medium py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit ticket"}
        </button>
      </div>
    </>
  );
};

// ─── Ticket Row ───────────────────────────────────────────────────────────────
const TicketRow = ({ ticket, onDelete, onViewAttachments, isLast }) => (
  <tr className={`border-b border-[#505081]/50 hover:bg-[#505081]/10 transition-colors ${isLast ? "border-b-0" : ""}`}>
    <td className="px-4 py-3">
      <p className="text-white font-medium text-sm">{ticket.title}</p>
      {ticket.description && (
        <p className="text-[#8686AC] text-xs mt-0.5 line-clamp-1">{ticket.description}</p>
      )}
    </td>
    <td className="px-4 py-3"><TypeBadge type={ticket.type} /></td>
    <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
    <td className="px-4 py-3 text-[#8686AC] text-sm">
      {ticket.assignedTo ? `#${ticket.assignedTo}` : <span className="text-[#505081] italic text-xs">Unassigned</span>}
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewAttachments(ticket.id)}
          className="flex items-center gap-1 text-[#8686AC] hover:text-white text-xs border border-[#505081] hover:border-[#8686AC] px-2 py-1 rounded-md transition-all"
        >
          <IconPaperclip /> Files
        </button>
        {ticket.status !== "RESOLVED" && ticket.status !== "CLOSED" && (
          <button
            onClick={() => onDelete(ticket.id)}
            className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs border border-rose-900 hover:border-rose-400 px-2 py-1 rounded-md transition-all"
          >
            <IconTrash /> Delete
          </button>
        )}
      </div>
    </td>
  </tr>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const TicketManagement = () => {
  const { userId } = useAuth();

  const [tickets, setTickets]             = useState([]);
  const [resources, setResources]         = useState([]);
  const [showCreate, setShowCreate]       = useState(false);
  const [viewingAttachments, setViewingAttachments] = useState(null); // ticketId
  const [busy, setBusy]                   = useState(false);
  const [loading, setLoading]             = useState(true);
  const [err, setErr]                     = useState(null);
  const [filter, setFilter]               = useState("ALL");

  const load = async () => {
    setLoading(true);
    try {
      const [rRes] = await Promise.all([getAllResources()]);
      const [tRes] = await Promise.all([getAllTickets()]);
      const all = tRes.data ?? tRes;
      console.log(all)
      setTickets(all.filter(t => t.createdBy === userId));
      setResources(rRes.data ?? rRes);
    } catch {
      setErr("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (form) => {
    setBusy(true);
    try {
      const payload = {
        title:       form.title,
        type:        form.type,
        description: form.description,
        ...(form.resourceId ? { resourceId: Number(form.resourceId) } : {}),
      };
      await createTicket(payload, userId);
      setShowCreate(false);
      load();
    } catch {
      alert("Failed to create ticket.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(ticketId);
      load();
    } catch {
      alert("Failed to delete ticket.");
    }
  };

  const STATUSES = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED"];
  const displayed = filter === "ALL" ? tickets : tickets.filter(t => t.status === filter);

  // ── Stats ──
  const counts = {
    total:      tickets.length,
    open:       tickets.filter(t => t.status === "OPEN").length,
    inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved:   tickets.filter(t => t.status === "RESOLVED").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-lg font-medium">Ticket Management</h2>
          <p className="text-[#8686AC] text-sm mt-0.5">Track and manage your support tickets</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#505081] hover:bg-[#8686AC] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
        >
          <IconPlus /> New ticket
        </button>
      </div>

      {/* Stats row */}
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

      {/* Filter tabs */}
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

      {/* Error */}
      {err && (
        <div className="bg-rose-950/50 text-rose-400 border border-rose-900 rounded-lg px-4 py-3 text-sm mb-5">{err}</div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-[#8686AC] text-sm">Loading tickets…</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-[#8686AC]">
          <div className="text-4xl mb-3 opacity-30">🎫</div>
          <p className="font-medium text-white mb-1">No tickets found</p>
          <p className="text-sm">{filter !== "ALL" ? "Try a different filter." : "Submit your first ticket to get started."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#505081]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#505081] bg-[#0F0E47]/40">
                {["Title", "Type", "Status", "Assigned to", "Actions"].map(h => (
                  <th key={h} className="text-left text-[#8686AC] text-xs font-medium uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((t, i) => (
                <TicketRow
                  key={t.id}
                  ticket={t}
                  onDelete={handleDelete}
                  onViewAttachments={setViewingAttachments}
                  isLast={i === displayed.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {showCreate && (
        <Modal title="New ticket" onClose={() => setShowCreate(false)}>
          <CreateTicketForm
            resources={resources}
            onSubmit={handleCreate}
            onClose={() => setShowCreate(false)}
            loading={busy}
          />
        </Modal>
      )}

      {viewingAttachments && (
        <AttachmentsPanel
          ticketId={viewingAttachments}
          onClose={() => setViewingAttachments(null)}
        />
      )}
    </div>
  );
};

export default TicketManagement;