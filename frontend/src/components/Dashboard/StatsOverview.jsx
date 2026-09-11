import React, { useState, useEffect } from 'react';
import {
  Flame, Factory, AlertTriangle, ShieldCheck, CheckCircle2,
  TrendingDown, Award, BarChart3, PieChart as PieIcon, Sparkles, X
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';

function AnimatedNumber({ value = 0, suffix = '', decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) {
      setDisplayValue(0);
      return;
    }
    const duration = 900;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;
      setDisplayValue(current);

      if (frame >= totalFrames) {
        clearInterval(counter);
        setDisplayValue(end);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <span>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue)}
      {suffix}
    </span>
  );
}

export default function StatsOverview({ stats, onClose }) {
  if (!stats) return null;

  const breakdownData = stats.breakdown || [];
  const topZones = stats.top_zones || [];

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col ring-1 ring-cyan-500/20">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                FireWatch AI &mdash; Mission Intelligence Dashboard
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400">
                SIH26162 (NTRO) Active Satellite Telemetry & Thermal Persistence Analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Top KPI Cards Grid with Animated Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-850/80 border border-slate-750 p-4 rounded-2xl shadow-lg">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Total Detections</div>
              <div className="text-3xl font-mono font-bold text-white mt-1">
                <AnimatedNumber value={stats.total_hotspots} />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Last 30-Day Window</div>
            </div>

            <div className="bg-red-950/40 border border-red-500/40 p-4 rounded-2xl shadow-lg shadow-red-950/20">
              <div className="text-[11px] font-mono text-red-300 uppercase flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                Industrial Fires
              </div>
              <div className="text-3xl font-mono font-bold text-red-400 mt-1">
                <AnimatedNumber value={stats.industrial_fires_count} />
              </div>
              <div className="text-[11px] text-red-300/80 mt-1">Inside Facility Perimeters</div>
            </div>

            <div className="bg-orange-950/40 border border-orange-500/40 p-4 rounded-2xl shadow-lg shadow-orange-950/20">
              <div className="text-[11px] font-mono text-orange-300 uppercase flex items-center gap-1">
                <Factory className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                Persistent Sources
              </div>
              <div className="text-3xl font-mono font-bold text-orange-400 mt-1">
                <AnimatedNumber value={stats.persistent_sources_count} />
              </div>
              <div className="text-[11px] text-orange-300/80 mt-1">Flares / Coal Seams (&ge;7x)</div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl shadow-lg shadow-emerald-950/20">
              <div className="text-[11px] font-mono text-emerald-300 uppercase flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                FP Reduction
              </div>
              <div className="text-3xl font-mono font-bold text-emerald-400 mt-1">
                <AnimatedNumber value={stats.false_positive_reduction_pct} suffix="%" decimals={1} />
              </div>
              <div className="text-[11px] text-emerald-300/80 mt-1">Non-Industrial Noise Filtered</div>
            </div>
          </div>

          {/* Core Innovation Spotlight Box */}
          <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/60 border border-cyan-500/40 rounded-2xl p-5 text-xs text-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5">
              <div className="font-bold text-cyan-300 flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-amber-400" />
                Smart India Hackathon Value Pitch (SIH26162 / NTRO)
              </div>
              <p className="text-slate-300 leading-relaxed max-w-3xl">
                NASA FIRMS treats every thermal detection as a generic wildfire alert. FireWatch AI fuses high-resolution OpenStreetMap industrial polygons with a 30-day spatio-temporal persistence tracker and Random Forest classification to separate transient crop burning and wildfires from genuine industrial non-compliance, achieving a <b>{stats.false_positive_reduction_pct}% reduction in false industrial alarms</b> with explainable decision attribution.
              </p>
            </div>
            <div className="bg-slate-900/90 border border-cyan-500/50 px-4 py-3 rounded-xl text-center font-mono whitespace-nowrap shadow-lg shadow-cyan-950/40">
              <div className="text-[10px] text-slate-400 uppercase">MODEL ACCURACY</div>
              <div className="text-xl font-bold text-cyan-300">
                <AnimatedNumber value={stats.model_accuracy_pct} suffix="%" decimals={1} />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Breakdown Bar Chart */}
            <div className="bg-slate-850/70 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <PieIcon className="w-4 h-4 text-cyan-400" />
                Anomaly Classification Breakdown
              </h3>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={breakdownData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <YAxis dataKey="category" type="category" width={140} tick={{ fill: '#e2e8f0', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#38bdf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Industrial Zones by Frequency */}
            <div className="bg-slate-850/70 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Factory className="w-4 h-4 text-orange-400" />
                Top Monitored Industrial Hotspots
              </h3>
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {topZones.map((z, idx) => (
                  <div key={idx} className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition">
                    <div>
                      <div className="font-bold text-slate-200">{z.zone_name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{z.state} &bull; {z.persistent_count} persistent hits</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-400 text-sm">{z.detection_count}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">passes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
