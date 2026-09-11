import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchHotspots, fetchIndustrialZones, fetchPersistentSources,
  fetchStats, fetchPresets
} from './services/api';
import FilterBar from './components/Controls/FilterBar';
import LiveTicker from './components/Controls/LiveTicker';
import TimeSlider from './components/Controls/TimeSlider';
import MapViewer from './components/Map/MapViewer';
import HotspotDetail from './components/Details/HotspotDetail';
import PersistentSourcesList from './components/Panels/PersistentSourcesList';
import StatsOverview from './components/Dashboard/StatsOverview';
import LiveIngestModal from './components/Controls/LiveIngestModal';
import { Loader2, AlertTriangle, RefreshCw, Radio, X } from 'lucide-react';
import { playSonarPing, playAlertChirp } from './services/sound';

const STATE_COORDINATES = {
  Odisha: { center: [20.95, 85.5], zoom: 8 },
  Jharkhand: { center: [23.75, 86.4], zoom: 9 },
  Gujarat: { center: [22.3, 71.0], zoom: 8 },
  Punjab: { center: [30.4, 75.8], zoom: 8 },
  'Uttar Pradesh': { center: [24.2, 83.0], zoom: 8 },
  All: { center: [22.5, 82.0], zoom: 5 },
};

export default function App() {
  // Data states
  const [allHotspots, setAllHotspots] = useState([]);
  const [zones, setZones] = useState([]);
  const [persistentClusters, setPersistentClusters] = useState([]);
  const [stats, setStats] = useState(null);
  const [presets, setPresets] = useState({});
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null);

  // Filter & control states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPreset, setSelectedPreset] = useState('india_all');
  const [selectedState, setSelectedState] = useState('All');
  const [minConfidence, setMinConfidence] = useState(50);
  const [isPersistentOnly, setIsPersistentOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCumulative, setIsCumulative] = useState(false);
  const [showZones, setShowZones] = useState(true);
  const [tileLayer, setTileLayer] = useState('roads');

  // UI view states
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'persistent'
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showIngestModal, setShowIngestModal] = useState(false);

  // Live alert simulation toast state
  const [liveAlert, setLiveAlert] = useState(null);

  // Map position
  const [mapCenter, setMapCenter] = useState([22.5, 82.0]);
  const [mapZoom, setMapZoom] = useState(5);

  // Initial load
  const loadData = async () => {
    try {
      setLoading(true);
      setConnectionError(null);
      const [spotsData, zonesData, clustersData, statsData, presetsData] = await Promise.all([
        fetchHotspots(),
        fetchIndustrialZones(),
        fetchPersistentSources(),
        fetchStats(),
        fetchPresets()
      ]);
      setAllHotspots(spotsData || []);
      setZones(zonesData || []);
      setPersistentClusters(clustersData || []);
      setStats(statsData || null);
      setPresets(presetsData || {});
    } catch (err) {
      console.error('Error loading FireWatch data:', err);
      setConnectionError('Unable to connect to FireWatch AI backend on http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Live alert simulation loop: triggers orbital telemetry alert every 22 seconds during demo
  useEffect(() => {
    if (allHotspots.length === 0) return;

    const interval = setInterval(() => {
      // Pick an industrial or persistent hotspot to simulate a live detection
      const highPriority = allHotspots.filter(
        (h) => h.category === 'Industrial Fire' || h.category === 'Persistent Thermal Source'
      );
      const pool = highPriority.length > 0 ? highPriority : allHotspots;
      const randomSpot = pool[Math.floor(Math.random() * pool.length)];

      if (randomSpot) {
        setLiveAlert({
          id: `ORBIT-${Date.now().toString().slice(-4)}`,
          spot: randomSpot,
          timestamp: new Date().toLocaleTimeString(),
          satellite: Math.random() > 0.5 ? 'NOAA-20 / VIIRS' : 'Suomi NPP / VIIRS',
        });
        playAlertChirp();

        // Auto dismiss after 9 seconds if not interacted with
        setTimeout(() => {
          setLiveAlert((prev) => (prev?.spot?.id === randomSpot.id ? null : prev));
        }, 9000);
      }
    }, 22000);

    return () => clearInterval(interval);
  }, [allHotspots]);

  // Compute all unique dates sorted chronologically
  const availableDates = useMemo(() => {
    const dateSet = new Set(allHotspots.map((s) => s.acq_date).filter(Boolean));
    return Array.from(dateSet).sort();
  }, [allHotspots]);

  // Handle Preset selection & pan
  const handleSelectPreset = (presetKey) => {
    setSelectedPreset(presetKey);
    const preset = presets[presetKey];
    if (preset) {
      setMapCenter([preset.lat, preset.lon]);
      setMapZoom(preset.zoom);
    }
  };

  // Handle State selection & pan
  const handleSelectState = (stateName) => {
    setSelectedState(stateName);
    const coords = STATE_COORDINATES[stateName] || STATE_COORDINATES.All;
    setMapCenter(coords.center);
    setMapZoom(coords.zoom);
  };

  // Filtered hotspots based on current controls
  const filteredHotspots = useMemo(() => {
    return allHotspots.filter((spot) => {
      // Category filter
      if (selectedCategory !== 'All' && spot.category !== selectedCategory) {
        return false;
      }
      // Confidence threshold
      if (spot.confidence < minConfidence) {
        return false;
      }
      // Persistent only toggle
      if (isPersistentOnly && !spot.is_persistent) {
        return false;
      }
      // State filter
      if (selectedState !== 'All') {
        const spotState = spot.state || spot.nearest_facility?.state || '';
        if (spotState.toLowerCase() !== selectedState.toLowerCase()) {
          return false;
        }
      }
      // Date filter
      if (selectedDate) {
        if (isCumulative) {
          if (spot.acq_date > selectedDate) return false;
        } else {
          if (spot.acq_date !== selectedDate) return false;
        }
      }
      // Preset geographic filtering (approx bounding box if not all)
      if (selectedPreset !== 'india_all' && presets[selectedPreset]) {
        const p = presets[selectedPreset];
        if (Math.abs(spot.latitude - p.lat) > 2.5 || Math.abs(spot.longitude - p.lon) > 2.5) {
          return false;
        }
      }
      return true;
    });
  }, [allHotspots, selectedCategory, selectedState, minConfidence, isPersistentOnly, selectedDate, isCumulative, selectedPreset, presets]);

  // Handle clicking a persistent cluster to inspect on map
  const handleSelectCluster = (cluster) => {
    playSonarPing(920, 0.1);
    setMapCenter([cluster.latitude, cluster.longitude]);
    setMapZoom(11);
    // Find closest spot in cluster to open in inspector
    const matchingSpot = allHotspots.find((s) => s.cluster_id === cluster.cluster_id);
    if (matchingSpot) {
      setSelectedHotspot(matchingSpot);
    }
    setActiveTab('map');
  };

  // Handle clicking inspect on live alert toast
  const handleInspectAlert = (spot) => {
    playSonarPing(920, 0.1);
    setMapCenter([spot.latitude, spot.longitude]);
    setMapZoom(12);
    setSelectedHotspot(spot);
    setActiveTab('map');
    setLiveAlert(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 select-none font-sans">
      {/* Top Filter & Navigation Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedPreset={selectedPreset}
        onSelectPreset={handleSelectPreset}
        selectedState={selectedState}
        onSelectState={handleSelectState}
        minConfidence={minConfidence}
        onConfidenceChange={setMinConfidence}
        isPersistentOnly={isPersistentOnly}
        onTogglePersistentOnly={() => setIsPersistentOnly(!isPersistentOnly)}
        showZones={showZones}
        onToggleZones={() => setShowZones(!showZones)}
        tileLayer={tileLayer}
        onChangeTileLayer={setTileLayer}
        onOpenStats={() => setShowStatsModal(true)}
        onOpenIngestModal={() => setShowIngestModal(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalHotspotsCount={filteredHotspots.length}
      />

      {/* Animated Live Satellite Telemetry Ticker Feed */}
      <LiveTicker />

      {/* Backend Connection Warning Banner if offline */}
      {connectionError && (
        <div className="bg-red-950/90 border-b border-red-500/50 px-4 py-2 flex items-center justify-between text-xs text-red-200 z-[1003] animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 animate-bounce" />
            <span>
              {connectionError} Running in Standalone Satellite Demo Mode.
            </span>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 bg-red-800 hover:bg-red-700 px-3 py-1 rounded text-white font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Main Mission Control Area */}
      <div className="relative flex-1 flex overflow-hidden">
        {loading && !connectionError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-[3000] backdrop-blur-sm">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-3" />
              <div className="absolute inset-0 rounded-full border border-cyan-500 animate-ping opacity-25"></div>
            </div>
            <div className="text-sm font-mono font-bold text-slate-200 tracking-wider uppercase">
              Initializing LaliFireWatch Thermal Intelligence...
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              Fusing NASA FIRMS &times; OpenStreetMap &times; Random Forest
            </div>
          </div>
        ) : null}

        {/* Map View */}
        <div className="flex-1 relative h-full w-full">
          <MapViewer
            hotspots={filteredHotspots}
            zones={zones}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(spot) => setSelectedHotspot(spot)}
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            showZones={showZones}
            tileLayer={tileLayer}
            onChangeTileLayer={setTileLayer}
            selectedState={selectedState}
          />

          {/* Floating Animated Time-Lapse Scrubber */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[94%] max-w-3xl">
            <TimeSlider
              dates={availableDates}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              isCumulative={isCumulative}
              onToggleCumulative={() => setIsCumulative(!isCumulative)}
              totalMatching={filteredHotspots.length}
            />
          </div>

          {/* Live Orbital Telemetry Alert Toast (Requirement: Live Alert Simulation) */}
          {liveAlert && (
            <div className="absolute bottom-28 right-5 z-[1500] bg-slate-950/95 border-2 border-red-500/80 rounded-2xl p-3.5 shadow-2xl max-w-xs w-full animate-in slide-in-from-bottom-5 duration-300 ring-4 ring-red-500/20 backdrop-blur-md">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-mono font-extrabold text-white tracking-wider uppercase">
                    Orbital Pass Alert
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                    {liveAlert.satellite}
                  </span>
                  <button
                    onClick={() => setLiveAlert(null)}
                    className="text-slate-400 hover:text-white p-0.5 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="truncate max-w-[170px]">{liveAlert.spot.nearest_facility?.name || liveAlert.spot.id}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold bg-red-950 text-red-300 border border-red-600">
                    {liveAlert.spot.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center gap-2">
                  <span className="text-cyan-300">🏛️ {liveAlert.spot.state || 'India'}</span>
                  <span>&bull;</span>
                  <span className="text-emerald-300">📍 {liveAlert.spot.district || 'Sector'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-0.5 text-slate-400">
                  <div>FRP: <strong className="text-amber-400">{liveAlert.spot.frp} MW</strong></div>
                  <div>Temp: <strong className="text-red-300">{liveAlert.spot.brightness} K</strong></div>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => handleInspectAlert(liveAlert.spot)}
                  className="flex-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-1 px-2.5 rounded-lg text-xs transition shadow-md flex items-center justify-center gap-1 cursor-pointer font-mono"
                >
                  <span>Locate &amp; Inspect</span>
                  <span>&rarr;</span>
                </button>
                <button
                  onClick={() => setLiveAlert(null)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2 py-1 rounded-lg transition"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Persistent Sources Drawer Panel */}
        {activeTab === 'persistent' && (
          <div className="w-full md:w-[380px] h-full bg-slate-900 border-l border-slate-800 z-[1001] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ring-1 ring-orange-500/20">
            <PersistentSourcesList
              clusters={persistentClusters}
              onSelectCluster={handleSelectCluster}
              selectedClusterId={selectedHotspot?.cluster_id}
            />
          </div>
        )}

        {/* Hotspot Telemetry & Explainability Inspector */}
        {selectedHotspot && (
          <div className="animate-in slide-in-from-right duration-300 h-full z-[1001]">
            <HotspotDetail
              hotspot={selectedHotspot}
              onClose={() => {
                playSonarPing(600, 0.08);
                setSelectedHotspot(null);
              }}
            />
          </div>
        )}
      </div>

      {/* Stats Dashboard Modal */}
      {showStatsModal && (
        <StatsOverview
          stats={stats}
          onClose={() => setShowStatsModal(false)}
        />
      )}

      {/* Live FIRMS Ingest Modal */}
      <LiveIngestModal
        isOpen={showIngestModal}
        onClose={() => setShowIngestModal(false)}
        onIngestSuccess={() => {
          loadData();
          setShowIngestModal(false);
        }}
      />
    </div>
  );
}
