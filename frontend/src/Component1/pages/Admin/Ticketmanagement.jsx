// pages/Admin Dashboard/TicketManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
import AllTickets        from "./AllTickets";
import ViewTicket        from "./ViewTicket";
import EditTicket        from "./EditTicket";
import AssignTechnician  from "./AssignTechnician";
import { ticketAPI }     from "../../utils/c1.api";

// ── Toast ────────────────────────────────────────────────────────────────────
const TSTYLE = {
  success: "bg-emerald-950/80 border-emerald-500/30 text-emerald-300",
  error:   "bg-rose-950/80    border-rose-500/30    text-rose-300",
  warning: "bg-amber-950/80   border-amber-500/30   text-amber-300",
};
const TICON = { success: CheckCircle2, error: XCircle, warning: AlertTriangle };

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const Icon = TICON[toast.type] ?? CheckCircle2;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl text-sm font-medium shadow-2xl ${TSTYLE[toast.type] ?? TSTYLE.success}`}>
        <Icon size={15} className="flex-shrink-0" />
        {toast.message}
        <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity"><X size={13} /></button>
      </div>
    </div>
  );
};

// ── Views ─────────────────────────────────────────────────────────────────────
const V = { ALL: "all", VIEW: "view", ADD: "add", EDIT: "edit", ASSIGN: "assign" };

// ── Main ─────────────────────────────────────────────────────────────────────
const TicketManagement = ({ activeSubSection, onNavigate }) => {
  const [tickets,  setTickets]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [apiError, setApiError] = useState(null);
  const [view,     setView]     = useState(V.ALL);
  const [selected, setSelected] = useState(null);
  const [toast,    setToast]    = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // Sync with sidebar nav
  useEffect(() => {
    if (activeSubSection === "add-ticket")  setView(V.ADD);
    if (activeSubSection === "all-tickets") setView((v) => (v === V.ADD || v === V.ALL) ? V.ALL : v);
  }, [activeSubSection]);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true); setApiError(null);
      const res = await ticketAPI.getAll();
      setTickets(res.data);
    } catch { setApiError("Failed to load tickets."); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Nav helpers
  const goAll    = ()  => { setView(V.ALL);    onNavigate("ticket-management", "all-tickets"); };
  const goView   = (t) => { setSelected(t);    setView(V.VIEW);   };
  const goEdit   = (t) => { setSelected(t);    setView(V.EDIT);   };
  const goAssign = (t) => { setSelected(t);    setView(V.ASSIGN); };

  // CRUD
  const handleAdd = async (data) => {
    await ticketAPI.create(data);
    await fetchTickets();
    showToast("Ticket created successfully.");
    goAll();
  };

  const handleEdit = async (id, data) => {
    await ticketAPI.update(id, data);
    await fetchTickets();
    showToast("Ticket updated.");
    goAll();
  };

  const handleDelete = async (id) => {
    await ticketAPI.delete(id);
    await fetchTickets();
    showToast("Ticket deleted.", "warning");
    if (view !== V.ALL) goAll();
  };

  const handleStatusChange = async (id, status) => {
    await ticketAPI.updateStatus(id, status);
    await fetchTickets();
    showToast(`Status changed to ${status}.`);
    // Refresh selected if in view
    if (view === V.VIEW && selected?.id === id) {
      const res = await ticketAPI.getAll();
      const updated = res.data.find((t) => t.id === id);
      if (updated) setSelected(updated);
    }
  };

  const handleAssign = async (id, technicianId) => {
    await ticketAPI.assignTech(id, technicianId);
    await fetchTickets();
    showToast(`Technician #${technicianId} assigned.`);
    goAll();
  };

  return (
    <div className="w-full">
      {view === V.ALL    && (
        <AllTickets
          tickets={tickets} loading={loading} error={apiError}
          onView={goView} onEdit={goEdit} onDelete={handleDelete}
          onAssign={goAssign}
          onAddTicket={() => onNavigate("ticket-management", "add-ticket")}
        />
      )}
      {view === V.VIEW   && selected && (
        <ViewTicket
          ticket={selected} onBack={goAll}
          onEdit={goEdit} onDelete={handleDelete}
          onAssign={goAssign} onStatusChange={handleStatusChange}
        />
      )}
      
      {view === V.EDIT   && selected && <EditTicket   ticket={selected} onBack={goAll} onSubmit={handleEdit} />}
      {view === V.ASSIGN && selected && <AssignTechnician ticket={selected} onBack={goAll} onSubmit={handleAssign} />}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default TicketManagement;