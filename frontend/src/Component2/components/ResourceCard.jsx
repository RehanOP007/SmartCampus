import React, { useState } from "react";
import { MapPin, Users, LayoutGrid, Pencil, Trash2 } from "lucide-react";

const TYPE_LABEL = { LAB: "Laboratory", ROOM: "Room", EQUIPMENT: "Equipment" };
const TYPE_ICON  = { LAB: "🔬",         ROOM: "🏛️",   EQUIPMENT: "🖥️"        };

const isActive = (status) => status === "AVAILABLE" || status === "ACTIVE";

const ResourceCard = ({ resource, onEdit, onDelete }) => {
  const [showDelete, setShowDelete] = useState(false);
  const active = isActive(resource.status);

  return (
    <>
      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden hover:border-white/[0.12] transition-all duration-200 flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 ring-1 ring-indigo-500/25 flex items-center justify-center text-xl">
            {TYPE_ICON[resource.type] ?? "📦"}
          </div>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            active
              ? "bg-emerald-950/50 text-emerald-400 border-emerald-500/20"
              : "bg-rose-950/50 text-rose-400 border-rose-500/20"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-rose-400"}`} />
            {active ? "Available" : "Out of Service"}
          </span>
        </div>

        {/* Body */}
        <div className="px-5 pb-4 flex flex-col gap-3 flex-1">
          <h3 className="font-bold text-white text-[14px] leading-snug">{resource.name}</h3>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12px] text-white/40">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{resource.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-white/40">
              <Users size={12} className="flex-shrink-0" />
              <span>
                {resource.capacity} people
                {resource.availableCapacity != null && resource.availableCapacity !== resource.capacity && (
                  <span className="text-emerald-400 ml-1">· {resource.availableCapacity} free</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-white/40">
              <LayoutGrid size={12} className="flex-shrink-0" />
              <span>{TYPE_LABEL[resource.type] ?? resource.type}</span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
      {(onEdit || onDelete) && (
        <div className="flex border-t border-white/[0.06]">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-semibold text-[#8686AC] hover:text-indigo-400 hover:bg-indigo-500/5 transition-all"
            >
              <Pencil size={12} /> Edit
            </button>
          )}
          {onEdit && onDelete && <div className="w-px bg-white/[0.06]" />}
          {onDelete && (
            <button
              onClick={() => setShowDelete(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[12px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all"
            >
              <Trash2 size={12} /> Delete
            </button>
          )}
        </div>
      )}
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowDelete(false)}
        >
          <div
            className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/95 backdrop-blur-xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-400 text-lg">⚠️</span>
              </div>
              <div>
                <h3 className="font-bold text-white text-[15px]">Delete Resource</h3>
                <p className="text-white/25 text-[12px]">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-white/40 text-[13px]">
              Are you sure you want to delete <span className="text-white font-semibold">"{resource.name}"</span>? All associated bookings will be affected.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowDelete(false)}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white/40 border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowDelete(false); onDelete(); }}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-lg shadow-rose-500/20 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourceCard;