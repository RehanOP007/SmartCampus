import React, { useState, useMemo } from "react";
import { Search, Package, Plus } from "lucide-react";
import ResourceCard from "../components/ResourceCard";

const FilterSelect = ({ label, value, onChange, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-[13px] outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all cursor-pointer appearance-none"
    >
      {children}
    </select>
  </div>
);

const AllResources = ({ resources, loading, error, onEdit, onDelete, onAddResource }) => {
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minCap,       setMinCap]       = useState("");

  const filtered = useMemo(() => {
    return (resources || []).filter((r) => {
      const q = search.toLowerCase();
      if (q && !r.name?.toLowerCase().includes(q) && !r.location?.toLowerCase().includes(q)) return false;
      if (typeFilter   && r.type    !== typeFilter)    return false;
      if (statusFilter && r.status  !== statusFilter)  return false;
      if (minCap       && r.capacity < Number(minCap)) return false;
      return true;
    });
  }, [resources, search, typeFilter, statusFilter, minCap]);

  const hasFilters = search || typeFilter || statusFilter || minCap;
  const clearFilters = () => { setSearch(""); setTypeFilter(""); setStatusFilter(""); setMinCap(""); };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          
        </div>
        <button
          onClick={onAddResource}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={14} /> Add Resource
        </button>
      </div>

      {/* Search + Filters */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d28]/60 backdrop-blur-sm p-5 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search by name or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-[13px] placeholder-white/15 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/60 transition-colors text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <FilterSelect label="Type" value={typeFilter} onChange={setTypeFilter}>
            <option value="">All Types</option>
            <option value="ROOM">🏛️ Rooms</option>
            <option value="LAB">🔬 Laboratories</option>
            <option value="EQUIPMENT">🖥️ Equipment</option>
          </FilterSelect>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-wider">Min Capacity</label>
            <input
              type="number"
              placeholder="Min people"
              value={minCap}
              onChange={(e) => setMinCap(e.target.value)}
              min="1"
              className="px-3 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white text-[13px] placeholder-white/15 outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter}>
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </FilterSelect>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-white/[0] uppercase tracking-wider select-none">.</label>
            <button
              onClick={clearFilters}
              disabled={!hasFilters}
              className="px-3 py-2 rounded-xl border border-white/[0.08] text-[13px] font-semibold text-white/30 hover:bg-white/[0.04] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-white/30">
          Showing <span className="text-white font-semibold">{filtered.length}</span>
          {filtered.length !== (resources || []).length && (
            <> of <span className="text-white font-semibold">{(resources || []).length}</span></>
          )} resources
        </span>
        {hasFilters && (
          <button onClick={clearFilters} className="text-white/30 hover:text-white text-[12px] font-medium transition-colors">
            Clear all filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-rose-950/40 text-rose-300 border border-rose-500/20 text-sm px-4 py-3 rounded-xl">
          ⚠️ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-white/[0.08] border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-[13px] text-white/25">Loading resources…</p>
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <Package size={24} className="text-white/15" />
              </div>
              <h3 className="font-bold text-white text-[15px]">No resources found</h3>
              <p className="text-[13px] text-white/25">
                {hasFilters ? "Try adjusting your filters" : "Add a new resource to get started"}
              </p>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-[13px] font-semibold hover:bg-white/[0.08] transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onEdit={onEdit ? () => onEdit(resource) : null}
                  onDelete={onDelete ? () => onDelete(resource.id) : null}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllResources;