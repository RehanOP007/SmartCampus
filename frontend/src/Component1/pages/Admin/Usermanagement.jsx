// pages/Admin Dashboard/UserManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
import ViewAllUsers from "./Viewallusers";
import ViewUser from "./Viewuser";
import AddUser from "./AddUser";
import EditUser     from "./Edituser";
import { userAPI }  from "../../utils/c1.api";

// ── Toast ────────────────────────────────────────────────────────────────────
const TSTYLE = {
  success: "bg-emerald-950/80 border-emerald-400/30 text-emerald-300",
  error:   "bg-rose-950/80    border-rose-400/30    text-rose-300",
  warning: "bg-amber-950/80   border-amber-400/30   text-amber-300",
};
const TICON = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
};

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  const Icon = TICON[toast.type] ?? CheckCircle2;
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl text-sm font-medium shadow-2xl ${TSTYLE[toast.type] ?? TSTYLE.success}`}>
        <Icon size={15} className="flex-shrink-0" />
        {toast.message}
        <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity"><X size={13} /></button>
      </div>
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────────────────────────
const UserManagement = ({ activeSubSection, onNavigate }) => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // view = "all" | "view-one" | "edit"
  // note: "add" is handled via activeSubSection from sidebar
  const [view,         setView]         = useState("all");
  const [selectedId,   setSelectedId]   = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // When sidebar navigates to add-user or all-users, sync internal view
  useEffect(() => {
    if (activeSubSection === "add-user")  { setView("add"); }
    if (activeSubSection === "all-users") {
      // Only reset to "all" if not already in a detail/edit view
      setView((v) => (v === "add" || v === "all") ? "all" : v);
    }
  }, [activeSubSection]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true); setApiError(null);
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch { setApiError("Failed to load users."); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // ── Navigation ─────────────────────────────────────────────────────────
  const goAll  = ()     => { setView("all");      onNavigate("user-management", "all-users"); };
  const goView = (id)   => { setSelectedId(id);   setView("view-one"); };
  const goEdit = (user) => { setSelectedUser(user); setView("edit"); };

  // ── CRUD handlers ──────────────────────────────────────────────────────
  const handleAdd = async (data) => {
    await userAPI.create(data);
    await fetchUsers();
    showToast("User created successfully.");
    goAll();
  };

  const handleEdit = async (id, data) => {
    await userAPI.update(id, data);
    await fetchUsers();
    showToast("User updated successfully.");
    goAll();
  };

  const handleDelete = async (id) => {
    await userAPI.delete(id);
    await fetchUsers();
    showToast("User deleted.", "warning");
    if (view !== "all") goAll();
  };

  return (
    <div className="w-full">
      {view === "all"      && <ViewAllUsers users={users} loading={loading} error={apiError} onView={goView} onEdit={goEdit} onDelete={handleDelete} onAddUser={() => onNavigate("user-management", "add-user")} />}
      {view === "view-one" && <ViewUser     userId={selectedId} onBack={goAll} onEdit={goEdit} onDelete={handleDelete} />}
      {view === "add"      && <AddUser      onBack={goAll} onSubmit={handleAdd} />}
      {view === "edit"     && selectedUser && <EditUser user={selectedUser} onBack={goAll} onSubmit={handleEdit} />}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default UserManagement;