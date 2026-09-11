import React, { useState, useMemo } from 'react';
import {
  Factory, AlertTriangle, Eye, Flame, Calendar, ArrowUpRight,
  ShieldAlert, Search, Trophy, Compass, Activity, ChevronRight
} from 'lucide-react';
import { playSonarPing } from '../../services/sound';

const HAZARD_STYLES = {
  HIGH: 'bg-red-950/90 border-red-500/80 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  MEDIUM: 'bg-orange-950/90 border-orange-500/80 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
  ELEVATED: 'bg-amber-950/90 border-amber-500/80 text-amber-300',
  LOW: 'bg-slate-800 border-slate-700 text-slate-300',
};

const MEDAL_ICONS = {
  0: { label: '🥇 #1 LEADER', color: 'text-amber-300 border-amber-500/80 bg-amber-950/60' },
  1: { label: '🥈 #2 RANK', color: 'text-slate-200 border-slate-400/80 bg-slate-800/80' },
  2: { label: '🥉 #3 RANK', color: 'text-orange-300 border-orange-600/80 bg-orange-950/60' },
};

export default function PersistentSourcesList({
  clusters = [],
  onSelectCluster,
  selectedClusterId
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sorted by total detections descending
  const sortedClusters = useMemo(() => {
    return [...clusters].sort((a, b) => (b.total_detections || 0) - (a.total_detections || 0));
  }, [clusters]);

  // Filtered by search query
  const filteredClusters = useMemo(() => {
    if (!searchQuery.trim()) return sortedClusters;
    const q = searchQuery.toLowerCase();
    return sortedClusters.filter((c) =>
      (c.facility_name && c.facility_name.toLowerCase().includes(q)) ||
      (c.state && c.state.toLowerCase().includes(q)) ||
      (c.district && c.district.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }, [sortedClusters, searchQuery]);

  // Summary Metrics
  const maxDetections = sortedClusters.length > 0 ? sortedClusters[0].total_detections : 0;
  const avgFrpAll = sortedClusters.length > 0
    ? (sortedClusters.reduce((acc, c) => acc + (parseFloat(c.avg_frp) || 0), 0) / sortedClusters.length).toFixed(1)
    : 0;

  if (!clusters || clusters.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-slate-500 space-y-2">
        <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
        <div>Scanning satellite passes for recurring 30-day thermal clusters...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-3 p-4 bg-slate-900 select-none">
      {/* Header & Centerpiece Title */}
      <div className="pb-2 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Persistent Thermal Leaderboard</span>
          </h3>
          <span className="text-xs font-mono font-bold bg-orange-950 text-orange-400 border border-orange-800 px-2 py-0.5 rounded-full">
            {clusters.length} Sources
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Ranked by 30-day satellite pass recurrence (spatial clustering within 1km radius).
        </p>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
            <div className="text-[9px] text-slate-400 uppercase">Total Flares</div>
            <div className="text-sm font-bold text-white mt-0.5">{clusters.length}</div>
          </div>
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
            <div className="text-[9px] text-orange-400 uppercase">Max Passes</div>
            <div className="text-sm font-bold text-orange-300 mt-0.5">{maxDetections}x</div>
          </div>
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
            <div className="text-[9px] text-amber-400 uppercase">Avg FRP</div>
            <div className="text-sm font-bold text-amber-300 mt-0.5">{avgFrpAll} MW</div>
          </div>
        </div>

        {/* Search filter input */}
        <div className="relative mt-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search facility, state, district..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* Ranked Cluster List */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
        {filteredClusters.map((c, idx) => {
          const isSelected = selectedClusterId === c.cluster_id;
          const hazardClass = HAZARD_STYLES[c.hazard_level] || HAZARD_STYLES.LOW;
          const medal = MEDAL_ICONS[idx];

          return (
            <div
              key={c.cluster_id}
              onClick={() => onSelectCluster(c)}
              className={`p-3.5 rounded-xl border transition cursor-pointer relative group ${
                isSelected
                  ? 'bg-slate-800 border-cyan-500 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Medal / Rank Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {medal ? (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${medal.color}`}>
                      {medal.label}
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      #{idx + 1}
                    </span>
                  )}
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                    {c.facility_name}
                  </span>
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${hazardClass}`}>
                  {c.hazard_level}
                </span>
              </div>

              {/* State & District Badges */}
              <div className="flex items-center gap-2 mt-2 text-[11px]">
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-cyan-300 font-semibold flex items-center gap-1">
                  🏛️ {c.state || 'India'}
                </span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-emerald-300 font-semibold flex items-center gap-1">
                  📍 {c.district || 'General District'}
                </span>
              </div>

              {/* Description snippet */}
              {c.description && (
                <div className="text-[11px] text-slate-300 mt-2 bg-slate-950/70 p-2 rounded border border-slate-800/80 leading-snug">
                  <span className="text-amber-400 font-mono text-[10px] uppercase font-bold block mb-0.5">
                    📝 Ground Intel
                  </span>
                  {c.description}
                </div>
              )}

              {/* Recurrence & Emission Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-2.5 text-xs text-slate-300">
                <div className="bg-slate-950/70 p-2 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-mono">30D RECURRENCE</span>
                  <span className="text-sm font-mono font-bold text-orange-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    {c.total_detections}x passes
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block font-mono">AVG HEAT RADIANCE</span>
                  <span className="text-sm font-mono font-bold text-amber-300">
                    {c.avg_frp} <span className="text-[10px] font-normal text-slate-400">MW</span>
                  </span>
                </div>
              </div>

              {/* Footer with Camera Flight Action */}
              <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
                <span className="truncate">Range: {c.first_seen} &rarr; {c.last_seen}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playSonarPing(920, 0.1);
                    onSelectCluster(c);
                  }}
                  className="text-cyan-400 flex items-center gap-1 hover:text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80 hover:bg-cyan-900/80 transition"
                >
                  <span>Locate</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
