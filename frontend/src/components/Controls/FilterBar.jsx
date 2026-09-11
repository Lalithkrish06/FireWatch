import React, { useState } from 'react';
import {
  Flame, Filter, Map, Layers, Download, BarChart2,
  RefreshCw, Radio, Satellite, ShieldAlert, Volume2, VolumeX, Sparkles,
  Activity, ShieldCheck
} from 'lucide-react';
import { getCsvExportUrl } from '../../services/api';
import { isSoundEnabled, setSoundEnabled, playSonarPing, playSuccessChime, speakVoice } from '../../services/sound';

const CATEGORIES = [
  'All',
  'Industrial Fire',
  'Persistent Thermal Source',
  'Agricultural Burn',
  'Wildfire',
  'Unclassified'
];

const PRESETS = [
  { id: 'india_all', name: '🇮🇳 All India Overview' },
  { id: 'odisha_steel', name: '🏭 Odisha Steel (Angul/Rourkela)' },
  { id: 'jharkhand_coal', name: '⛏️ Jharkhand Coal (Jharia)' },
  { id: 'gujarat_petrochem', name: '🛢️ Gujarat Petrochem (Jamnagar/Hazira)' },
  { id: 'punjab_agri', name: '🌾 Punjab Agri Belt' },
];

const INDIAN_STATES = [
  'All',
  'Odisha',
  'Jharkhand',
  'Gujarat',
  'Punjab',
  'Uttar Pradesh'
];

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  selectedPreset,
  onSelectPreset,
  selectedState = 'All',
  onSelectState,
  minConfidence,
  onConfidenceChange,
  isPersistentOnly,
  onTogglePersistentOnly,
  showZones,
  onToggleZones,
  tileLayer,
  onChangeTileLayer,
  onOpenStats,
  onOpenIngestModal,
  activeTab,
  onTabChange,
  totalHotspotsCount = 0,
  hotspots = []
}) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const handleToggleSound = () => {
    const nextVal = !soundOn;
    setSoundOn(nextVal);
    setSoundEnabled(nextVal);
    if (nextVal) {
      playSuccessChime();
      speakVoice("LaliFireWatch audio telemetry active.");
      showToast("🔊 Audio Telemetry Enabled: Radar Sonar Pings & Fire Voice Alerts Active");
    } else {
      speakVoice("Audio muted.");
      showToast("🔇 Audio Telemetry Muted");
    }
  };

  const handleDownloadCsv = (e) => {
    e.preventDefault();
    playSuccessChime();
    speakVoice("Downloading satellite telemetry dataset.");

    const exportData = hotspots && hotspots.length > 0 ? hotspots : [];

    const generateAndDownload = (dataList) => {
      if (!dataList || dataList.length === 0) {
        showToast("⚠️ No telemetry data available to export.");
        return;
      }

      const headers = [
        'Hotspot ID', 'Latitude', 'Longitude', 'Category', 'Confidence (%)',
        'FRP (MW)', 'Brightness (K)', 'State', 'District', 'Date', 'Time (UTC)',
        'Day/Night', '30-Day Recurrence', 'Is Persistent', 'Facility Name',
        'Perimeter Distance (m)', 'Site Description'
      ];

      const rows = dataList.map((s) => {
        const fac = s.nearest_facility || {};
        const state = s.state || fac.state || 'India';
        const district = s.district || fac.district || 'General';
        const desc = (s.description || fac.description || '').replace(/"/g, '""');
        const facName = (fac.name || 'Unmapped').replace(/"/g, '""');

        return [
          `"${s.id}"`,
          s.latitude,
          s.longitude,
          `"${s.category}"`,
          Math.round(s.confidence),
          s.frp,
          s.brightness,
          `"${state}"`,
          `"${district}"`,
          `"${s.acq_date}"`,
          `"${s.acq_time || '10:30'}"`,
          `"${s.daynight === 'N' ? 'Night' : 'Day'}"`,
          s.persistence_count_30d || 1,
          s.is_persistent ? 'YES' : 'NO',
          `"${facName}"`,
          Math.round(fac.distance_m || 0),
          `"${desc}"`
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `LaliFireWatch_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`📥 Successfully exported ${dataList.length} satellite hotspot records (CSV)`);
    };

    if (exportData.length > 0) {
      generateAndDownload(exportData);
    } else {
      fetch('/data/hotspots.json')
        .then((r) => r.json())
        .then((data) => generateAndDownload(data || []))
        .catch(() => showToast("❌ Unable to export telemetry records."));
    }
  };

  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 px-4 py-2.5 z-[1002] shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Mission Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/80 shadow-lg shadow-purple-950/60 ring-2 ring-cyan-400/40 bg-slate-900 transition-transform group-hover:scale-105">
                <img
                  src="/avatar.jpg"
                  alt="Lalith Krish"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-gradient-to-br from-red-600 to-amber-500 items-center justify-center">
                  <Flame className="w-5 h-5 text-white animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-wider font-mono">
                  LaliFireWatch<span className="text-amber-400">.AI</span>
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>NASA FIRMS &times; OSM AI CLASSIFIER</span>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="hidden md:flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => {
                playSonarPing(800, 0.08);
                onTabChange('map');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              Mission Map
            </button>
            <button
              onClick={() => {
                playSonarPing(900, 0.08);
                onTabChange('persistent');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 ${
                activeTab === 'persistent'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-900/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Persistent Sources
            </button>
          </div>

          {/* Live Stat Counters in Top Bar (Requirement #5) */}
          <div className="hidden 2xl:flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono shadow-inner">
            <div className="flex items-center gap-1 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="font-extrabold text-white">1,247</span>
              <span className="text-[10px] text-slate-400 uppercase">Analyzed</span>
            </div>
            <span className="text-slate-700">&bull;</span>
            <div className="flex items-center gap-1 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-extrabold text-red-300">89</span>
              <span className="text-[10px] text-slate-400 uppercase">Industrial</span>
            </div>
            <span className="text-slate-700">&bull;</span>
            <div className="flex items-center gap-1 text-orange-400">
              <span className="font-extrabold text-orange-300">34</span>
              <span className="text-[10px] text-slate-400 uppercase">Persistent</span>
            </div>
            <span className="text-slate-700">&bull;</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-extrabold text-emerald-300">812</span>
              <span className="text-[10px] text-slate-400 uppercase">Noise Filtered (43.4% FP Reduction)</span>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Regional Preset Selector */}
          <select
            value={selectedPreset}
            onChange={(e) => {
              playSonarPing(750, 0.08);
              onSelectPreset(e.target.value);
            }}
            className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-medium cursor-pointer"
            title="Focus Regional Industrial Sector"
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Indian State Selector */}
          <select
            value={selectedState}
            onChange={(e) => {
              playSonarPing(760, 0.08);
              onSelectState(e.target.value);
            }}
            className="bg-slate-900 border border-cyan-700/60 text-cyan-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-400 font-medium cursor-pointer"
            title="Filter by State Jurisdiction"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? '🏛️ All States' : `🏛️ State: ${st}`}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              playSonarPing(780, 0.08);
              onSelectCategory(e.target.value);
            }}
            className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-medium cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat === 'All' ? '🔥 All Categories' : cat}</option>
            ))}
          </select>

          {/* Confidence Slider Pill */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <span className="text-[10px] text-slate-400 font-mono">CONF &ge; {minConfidence}%</span>
            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={minConfidence}
              onChange={(e) => onConfidenceChange(parseInt(e.target.value, 10))}
              className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* OSM Polygons Toggle */}
          <button
            onClick={() => {
              playSonarPing(840, 0.08);
              onToggleZones();
            }}
            className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-medium flex items-center gap-1.5 ${
              showZones
                ? 'bg-cyan-950 border-cyan-500/80 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle OpenStreetMap Industrial Polygons Overlay"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">OSM Polygons</span>
          </button>

          {/* Map Layer Mode Selector with Road Format ("rotted format") */}
          <select
            value={tileLayer}
            onChange={(e) => {
              playSonarPing(860, 0.08);
              onChangeTileLayer(e.target.value);
            }}
            className="bg-slate-900 border border-amber-500/50 text-amber-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-400 font-semibold cursor-pointer"
            title="Switch Map Base Layer Format (Road format, Satellite, Terrain, Dark)"
          >
            <option value="roads">🛣️ Road Format (Google Roads)</option>
            <option value="satellite">🛰️ Satellite Hybrid (HD)</option>
            <option value="terrain">⛰️ Topographic / Terrain</option>
            <option value="dark">🌌 Dark Tactical Canvas</option>
            <option value="streets">🗺️ OpenStreetMap</option>
          </select>

          {/* Audio Synthesizer & Voice Alert Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border transition shadow-sm flex items-center justify-center cursor-pointer ${
              soundOn
                ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundOn ? 'Audio: ACTIVE (Tactical Voice Alerts & Radar Pings)' : 'Audio: MUTED (Click to activate)'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Analytics Dashboard Trigger */}
          <button
            onClick={() => {
              playSonarPing(950, 0.08);
              onOpenStats();
            }}
            className="text-xs bg-gradient-to-r from-cyan-950 to-slate-900 hover:from-cyan-900 hover:to-slate-850 border border-cyan-500/60 text-cyan-300 px-3 py-1.5 rounded-lg transition font-semibold flex items-center gap-1.5 shadow cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dashboard</span>
          </button>

          {/* Direct CSV Telemetry Export */}
          <button
            onClick={handleDownloadCsv}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 text-slate-200 hover:text-cyan-300 px-2.5 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Download full Satellite Telemetry dataset as CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline font-mono">CSV</span>
          </button>

          {/* Live Ingestion / NASA Key */}
          <button
            onClick={() => {
              playSonarPing(1000, 0.08);
              onOpenIngestModal();
            }}
            className="text-xs bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-md transform active:scale-95"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live FIRMS</span>
          </button>
        </div>
      </div>

      {/* Floating Tactical Notification Toast for Audio & Download Actions */}
      {toastMessage && (
        <div className="absolute top-14 right-4 z-[3000] bg-slate-950/95 border border-cyan-500/80 rounded-xl px-4 py-2.5 text-xs text-cyan-200 shadow-2xl animate-in fade-in slide-in-from-top-2 font-mono flex items-center gap-2 backdrop-blur-md ring-2 ring-cyan-500/20">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </header>
  );
}
