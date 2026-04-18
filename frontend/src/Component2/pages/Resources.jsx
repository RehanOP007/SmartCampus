import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
import AllResources  from "./Allresources ";
import AddResource   from "../components/ResourceForm";
import EditResource  from "../components/EditResource";
import resourceService from "../services/resourceService";

// ── Toast ─────────────────────────────────────────────────────────────────────
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
        <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
          <X size={13} />
        </button>
      </div>
    </div>
  );
};

// ── Views ──────────────────────────────────────────────────────────────────────
const V = { ALL: "all", ADD: "add", EDIT: "edit" };

// ── Main ──────────────────────────────────────────────────────────────────────
const ResourceManagement = ({ activeSubSection, onNavigate }) => {
  const [resources,    setResources]    = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [apiError,     setApiError]     = useState(null);
  const [view,         setView]         = useState(V.ALL);
  const [editingRes,   setEditingRes]   = useState(null);
  const [toast,        setToast]        = useState(null);

  const userRole = localStorage.getItem("userRole");
  const isAdmin  = userRole === "ADMIN";

  const showToast = (message, type = "success") => setToast({ message, type });

  // Sync with sidebar nav
  useEffect(() => {
    if (activeSubSection === "add-resource")  setView(V.ADD);
    if (activeSubSection === "all-resources") setView((v) => (v === V.ADD || v === V.ALL) ? V.ALL : v);
  }, [activeSubSection]);

  // Fetch
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true); setApiError(null);
      const res = await resourceService.getAll();
      setResources(res.data || []);
    } catch {
      setApiError("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  // Nav helpers
  const goAll  = ()  => { setView(V.ALL); onNavigate("resource-management", "all-resources"); };
  const goEdit = (r) => { setEditingRes(r); setView(V.EDIT); };

  // CRUD
  const handleAdd = async (msg) => {
    await fetchResources();
    showToast(msg);
    goAll();
  };

  const handleEdit = async (msg) => {
    await fetchResources();
    showToast(msg);
    goAll();
  };

  const handleDelete = async (id) => {
    try {
      await resourceService.delete(id);
      await fetchResources();
      showToast("Resource deleted.", "warning");
    } catch {
      showToast("Failed to delete resource.", "error");
    }
  };

  return (
    <div className="w-full">
      {view === V.ALL && (
        <AllResources
          resources={resources}
          loading={loading}
          error={apiError}
          onEdit={isAdmin ? goEdit : null}
          onDelete={isAdmin ? handleDelete : null}
          onAddResource={() => onNavigate("resource-management", "add-resource")}
        />
      )}

      {view === V.ADD && (
        <AddResource
          onBack={goAll}
          onSuccess={handleAdd}
        />
      )}

      {view === V.EDIT && editingRes && (
        <EditResource
          resource={editingRes}
          onBack={goAll}
          onSuccess={handleEdit}
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ResourceManagement;