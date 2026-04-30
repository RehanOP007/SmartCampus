// pages/Admin Dashboard/BookingManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, X } from "lucide-react";
import AllBookings      from "./Allbookings";
import ViewBooking      from "./Viewbooking";
import UpdateBooking    from "./Updatebooking";
import { bookingAPI }   from "../../utils/c1.api";

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

// ── Main ─────────────────────────────────────────────────────────────────────
const BookingManagement = ({ activeSubSection, onNavigate }) => {
  const [bookings,  setBookings]  = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState(null);
  const [view,      setView]      = useState("all");
  const [selected,  setSelected]  = useState(null); // booking object
  const [toast,     setToast]     = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  // Sync with sidebar sub-section
  useEffect(() => {
    if (activeSubSection === "all-bookings") setView((v) => (v === "add" || v === "all") ? "all" : v);
  }, [activeSubSection]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true); setApiError(null);
      const res = await bookingAPI.getAll();
      setBookings(res.data);
    } catch { setApiError("Failed to load bookings."); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Nav
  const goAll    = ()       => { setView("all");    onNavigate("booking-management", "all-bookings"); };
  const goView   = (b)      => { setSelected(b);    setView("view"); };
  const goEdit   = (b)      => { setSelected(b);    setView("edit"); };

  // Actions
  const handleUpdate = async (id, data) => {
    await bookingAPI.updateStatus(id, data.status);
    await fetchBookings();
    showToast("Booking updated.");
    goAll();
  };

  const handleApprove = async (id) => {
    await bookingAPI.approve(id);
    await fetchBookings();
    showToast("Booking approved.", "success");
    if (view === "view") {
      // refresh selected
      const res = await bookingAPI.getAll();
      const updated = res.data.find((b) => b.id === id);
      if (updated) setSelected(updated);
    }
  };

  const handleReject = async (id) => {
    await bookingAPI.reject(id);
    await fetchBookings();
    showToast("Booking rejected.", "warning");
    if (view === "view") {
      const res = await bookingAPI.getAll();
      const updated = res.data.find((b) => b.id === id);
      if (updated) setSelected(updated);
    }
  };

  const handleCancel = async (id) => {
    await bookingAPI.cancel(id);
    await fetchBookings();
    showToast("Booking cancelled.", "warning");
    if (view !== "all") goAll();
  };

  return (
    <div className="w-full">
      {view === "all"  && (
        <AllBookings
          bookings={bookings} loading={loading} error={apiError}
          onView={goView} onEdit={goEdit}
          onApprove={handleApprove} onReject={handleReject} onCancel={handleCancel}
          onAddBooking={() => onNavigate("booking-management", "add-booking")}
        />
      )}
      {view === "view" && selected && (
        <ViewBooking
          booking={selected} onBack={goAll} onEdit={goEdit}
          onApprove={handleApprove} onReject={handleReject} onCancel={handleCancel}
        />
      )}
      {view === "edit" && selected && (
        <UpdateBooking booking={selected} onBack={goAll} onSubmit={handleUpdate} />
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
    
  );
};

export default BookingManagement;