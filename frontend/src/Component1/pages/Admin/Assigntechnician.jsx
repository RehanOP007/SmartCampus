// pages/Admin Dashboard/AssignTechnician.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, UserCheck, Search, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { TypeBadge, StatusBadge } from "./AllTickets";
import { userAPI } from "../../utils/c1.api";

const AssignTechnician = ({ ticket: t, onBack, onSubmit }) => {
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechs, setLoadingTechs] = useState(true);
  const [techError, setTechError] = useState(null);
  const [selectedId, setSelectedId] = useState(t?.assignedTo ?? null);
  const [search, setSearch] = useState("");
  const [submitting, setSub] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setLoadingTechs(true);
        setTechError(null);
        const res = await userAPI.getAll();
        const techs = (res.data || []).filter(
          (u) => u.role?.toLowerCase() === "technician"
        );
        setTechnicians(techs);
      } catch {
        setTechError("Failed to load technicians.");
      } finally {
        setLoadingTechs(false);
      }
    };
    fetchTechnicians();
  }, []);

  if (!t) return null;

  const filtered = technicians.filter((tech) => {
    const q = search.toLowerCase();
    return (
      !q ||
      tech.name?.toLowerCase().includes(q) ||
      tech.email?.toLowerCase().includes(q) ||
      String(tech.id).includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) {
      setGlobalError("Please select a technician.");
      return;
    }
    try {
      setSub(true);
      setGlobalError(null);
      await onSubmit(t.id, Number(selectedId));
    } catch (err) {
      const msg = err?.response?.data?.message || "";
      setGlobalError(msg || "Failed to assign technician.");
    } finally {
      setSub(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-md">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[13px] text-white/30 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft size={14} /> Back to all tickets
      </button>

      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25 flex items-center justify-center">
            <UserCheck size={16} className="text-emerald-400" />
          </div>
          <div>
            <h2
              className="text-white font-bold text-[15px]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Assign Technician
            </h2>
            <p className="text-white/25 text-[12px] mt-0.5">
              Select a technician to handle this ticket
            </p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Ticket summary */}
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col gap-3">
            <p className="text-white/25 text-[11px] font-semibold uppercase tracking-wider">
              Ticket Summary
            </p>
            <p className="text-white font-semibold text-[14px] leading-snug">
              {t.title}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={t.type} />
              <StatusBadge status={t.status} />
            </div>
            <p className="text-white/25 text-xs">
              Currently assigned to:{" "}
              <span className="text-white/50 font-medium">
                {t.assignedTo
                  ? technicians.find((tech) => tech.id === t.assignedTo)?.name ||
                    `Technician #${t.assignedTo}`
                  : "Nobody"}
              </span>
            </p>
          </div>

          {globalError && (
            <div className="bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={14} className="flex-shrink-0" />
              {globalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Technician list */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-semibold text-white/40 uppercase tracking-wider">
                Select Technician <span className="text-rose-400">*</span>
              </label>

              {/* Search */}
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, email or ID…"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder-white/15 outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                />
              </div>

              {/* List */}
              <div className="max-h-52 overflow-y-auto flex flex-col gap-1.5 pr-0.5 mt-1">
                {loadingTechs ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-white/30 text-[13px]">
                    <Loader2 size={15} className="animate-spin" />
                    Loading technicians…
                  </div>
                ) : techError ? (
                  <div className="flex items-center gap-2 py-6 text-rose-400 text-[13px] justify-center">
                    <AlertCircle size={14} />
                    {techError}
                  </div>
                ) : filtered.length === 0 ? (
                  <p className="text-white/20 text-[13px] text-center py-6">
                    {search ? "No technicians match your search." : "No technicians found."}
                  </p>
                ) : (
                  filtered.map((tech) => {
                    const isSelected = selectedId === tech.id;
                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(tech.id);
                          setGlobalError(null);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1]"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 ${
                            isSelected
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/[0.06] text-white/40"
                          }`}
                        >
                          {(tech.name || "?")[0].toUpperCase()}
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className={`text-[13px] font-semibold truncate ${
                              isSelected ? "text-emerald-300" : "text-white/80"
                            }`}
                          >
                            {tech.name || `User #${tech.id}`}
                          </span>
                          {tech.email && (
                            <span className="text-[11px] text-white/25 truncate">
                              {tech.email}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-white/20">
                            #{tech.id}
                          </span>
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-emerald-400" />
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white/40 border border-white/[0.08] hover:bg-white/[0.04] hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedId}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserCheck size={14} /> Assign Technician
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnician;