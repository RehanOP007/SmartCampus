import React, { useState, useEffect } from "react";
import { 
  getAllResources, 
  createBooking, 
  getAllBookings, 
  cancelBooking, 
  updateBooking 
} from "../../../Component3/utils/C3.api";

// ─── Internal Sub-Components & Icons ──────────────────────────────────────────
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
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconCancel = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const statusStyles = {
  PENDING:   "bg-amber-950/50 text-amber-400 border border-amber-900",
  APPROVED:  "bg-emerald-950/50 text-emerald-400 border border-emerald-900",
  CANCELLED: "bg-rose-950/50 text-rose-400 border border-rose-900",
  REJECTED:  "bg-rose-950/50 text-rose-400 border border-rose-900",
};

const StatusBadge = ({ status }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyles[status] ?? "bg-[#505081]/30 text-[#8686AC] border border-[#505081]"}`}>
    {status}
  </span>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-[#272757] border border-[#505081] rounded-2xl w-full max-w-lg shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#505081]">
        <h3 className="text-white font-medium">{title}</h3>
        <button onClick={onClose} className="text-[#8686AC] hover:text-white transition-colors"><IconX /></button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const inputCls = "w-full bg-[#0F0E47]/60 border border-[#505081] text-white placeholder-[#505081] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#8686AC] transition-colors";
const labelCls = "block text-[#8686AC] text-xs font-medium uppercase tracking-widest mb-1.5";

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className={labelCls}>{label}</label>
    {children}
  </div>
);

const BookingForm = ({ resources, initial, onSubmit, onClose, loading }) => {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <Field label="Resource">
        <select className={inputCls} value={form.resourceId} onChange={e => set("resourceId", e.target.value)} required>
          <option value="">Select a resource</option>
          {resources.map(r => (
            <option key={r.id} value={r.id}>{r.name} — {r.location} (cap. {r.capacity})</option>
          ))}
        </select>
      </Field>
      <Field label="Date">
        <input type="date" className={inputCls} value={form.date} onChange={e => set("date", e.target.value)} required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start time">
          <input type="time" className={inputCls} value={form.startTime} onChange={e => set("startTime", e.target.value)} required />
        </Field>
        <Field label="End time">
          <input type="time" className={inputCls} value={form.endTime} onChange={e => set("endTime", e.target.value)} required />
        </Field>
      </div>
      <Field label="Purpose">
        <input type="text" className={inputCls} placeholder="e.g. Lecture, Workshop" value={form.purpose} onChange={e => set("purpose", e.target.value)} required />
      </Field>
      <Field label="Attendees">
        <input type="number" min="1" className={inputCls} placeholder="30" value={form.attendees} onChange={e => set("attendees", e.target.value)} required />
      </Field>
      <div className="flex gap-3 mt-2">
        <button onClick={onClose} className="flex-1 border border-[#505081] hover:bg-[#505081]/30 text-[#8686AC] hover:text-white font-medium py-2.5 rounded-lg text-sm transition-all">
          Cancel
        </button>
        <button
          onClick={() => onSubmit(form)}
          disabled={loading}
          className="flex-1 bg-[#505081] hover:bg-[#8686AC] text-white font-medium py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save booking"}
        </button>
      </div>
    </>
  );
};

// ─── Main Exported Component ──────────────────────────────────────────────────
const BookingManagement = ({ userId }) => {
  const [resources, setResources]   = useState([]);
  const [bookings, setBookings]     = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing]       = useState(null);
  const [busy, setBusy]             = useState(false);
  const [fetchErr, setFetchErr]     = useState(null);

  const emptyForm = { resourceId: "", date: "", startTime: "", endTime: "", purpose: "", attendees: "" };

  const load = async () => {
    try {
      const [rRes, bRes] = await Promise.all([getAllResources(), getAllBookings()]);
      setResources((rRes.data ?? rRes).filter(r => r.status === "AVAILABLE"));
      const all = bRes.data ?? bRes;
      setBookings(all.filter(b => b.userId === userId));
    } catch (e) {
      setFetchErr("Failed to load data. Please try again.");
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (form) => {
    console.log(form);
    console.log(userId);

  if (!form.resourceId) return alert("Select a resource");
  if (!form.date) return alert("Select a date");
  if (!form.startTime || !form.endTime) return alert("Select time");
  if (form.startTime >= form.endTime) return alert("Invalid time range");
  if (!form.attendees || Number(form.attendees) <= 0) return alert("Invalid attendees");

  setBusy(true);

  try {
    await createBooking({
      ...form,
      userId,
      resourceId: Number(form.resourceId),
      attendees: Number(form.attendees),
    });

    setShowCreate(false);
    load();

  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "Failed to create booking");
  } finally {
    setBusy(false);
  }
};

  const handleUpdate = async (form) => {
    setBusy(true);
    try {
      await updateBooking(editing.id, { ...form, userId, resourceId: Number(form.resourceId), attendees: Number(form.attendees) });
      setEditing(null);
      load();
    } catch { alert("Failed to update booking."); }
    finally { setBusy(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await cancelBooking(id);
      load();
    } catch { alert("Failed to cancel booking."); }
  };

  const resourceName = (id) => resources.find(r => r.id === id)?.name ?? `Resource #${id}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-lg font-medium">Booking Management</h2>
          <p className="text-[#8686AC] text-sm mt-0.5">Manage your resource reservations</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-[#505081] hover:bg-[#8686AC] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
        >
          <IconPlus /> New booking
        </button>
      </div>

      {fetchErr && (
        <div className="bg-rose-950/50 text-rose-400 border border-rose-900 rounded-lg px-4 py-3 text-sm mb-5">{fetchErr}</div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-16 text-[#8686AC]">
          <div className="text-4xl mb-3 opacity-30">📅</div>
          <p className="font-medium text-white mb-1">No bookings yet</p>
          <p className="text-sm">Create your first booking to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#505081]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#505081] bg-[#0F0E47]/40">
                {["Resource", "Date", "Time", "Purpose", "Attendees", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-[#8686AC] text-xs font-medium uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b.id} className={`border-b border-[#505081]/50 hover:bg-[#505081]/10 transition-colors ${i === bookings.length - 1 ? "border-b-0" : ""}`}>
                  <td className="px-4 py-3 text-white font-medium">{resourceName(b.resourceId)}</td>
                  <td className="px-4 py-3 text-[#8686AC]">{b.date}</td>
                  <td className="px-4 py-3 text-[#8686AC] whitespace-nowrap">{b.startTime} – {b.endTime}</td>
                  <td className="px-4 py-3 text-[#8686AC]">{b.purpose}</td>
                  <td className="px-4 py-3 text-[#8686AC] text-center">{b.attendees}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    {b.status !== "CANCELLED" && b.status !== "REJECTED" && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditing(b)} className="flex items-center gap-1 text-[#8686AC] hover:text-white text-xs border border-[#505081] hover:border-[#8686AC] px-2 py-1 rounded-md transition-all">
                          <IconEdit /> Edit
                        </button>
                        <button onClick={() => handleCancel(b.id)} className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs border border-rose-900 hover:border-rose-400 px-2 py-1 rounded-md transition-all">
                          <IconCancel /> Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Available Resources Panel */}
      <div className="mt-8">
        <h3 className="text-white font-medium mb-3">Available Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {resources.map(r => (
            <div key={r.id} className="bg-[#0F0E47]/40 border border-[#505081] rounded-xl px-4 py-3">
              <div className="flex items-start justify-between mb-1">
                <p className="text-white font-medium text-sm">{r.name}</p>
                <span className="text-xs bg-emerald-950/50 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded-full">{r.type}</span>
              </div>
              <p className="text-[#8686AC] text-xs">{r.location}</p>
              <p className="text-[#8686AC] text-xs mt-0.5">Capacity: {r.availableCapacity} / {r.capacity}</p>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <Modal title="New booking" onClose={() => setShowCreate(false)}>
          <BookingForm resources={resources} initial={emptyForm} onSubmit={handleCreate} onClose={() => setShowCreate(false)} loading={busy} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit booking" onClose={() => setEditing(null)}>
          <BookingForm
            resources={resources}
            initial={{
              resourceId: editing.resourceId,
              date: editing.date,
              startTime: editing.startTime,
              endTime: editing.endTime,
              purpose: editing.purpose,
              attendees: editing.attendees,
            }}
            onSubmit={handleUpdate}
            onClose={() => setEditing(null)}
            loading={busy}
          />
        </Modal>
      )}
    </div>
  );
};

export default BookingManagement;