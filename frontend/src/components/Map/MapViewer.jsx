import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Flame, Factory, AlertTriangle, ShieldCheck, Radio, Scan,
  MapPin, Compass, Layers, Info, Navigation, BrainCircuit, Sparkles
} from 'lucide-react';
import { playSonarPing, playAlertChirp } from '../../services/sound';

// Controller to fly smoothly to selected focus coords
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom(), { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Marker styling definitions
const CATEGORY_THEMES = {
  'Industrial Fire': {
    bg: '#ef4444',
    border: '#ffffff',
    pulseClass: 'hotspot-marker-industrial',
    glowColor: 'rgba(239, 68, 68, 0.9)'
  },
  'Persistent Thermal Source': {
    bg: '#f97316',
    border: '#fed7aa',
    pulseClass: 'hotspot-marker-persistent',
    glowColor: 'rgba(249, 115, 22, 0.9)'
  },
  'Agricultural Burn': {
    bg: '#eab308',
    border: '#fef08a',
    pulseClass: 'hotspot-marker-agri',
    glowColor: 'rgba(234, 179, 8, 0.7)'
  },
  'Wildfire': {
    bg: '#10b981',
    border: '#a7f3d0',
    pulseClass: 'hotspot-marker-wildfire',
    glowColor: 'rgba(16, 185, 129, 0.7)'
  },
  'Unclassified': {
    bg: '#64748b',
    border: '#cbd5e1',
    pulseClass: '',
    glowColor: 'rgba(100, 116, 139, 0.4)'
  },
};

function createCustomIcon(category, frp, isSelected) {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES['Unclassified'];
  const baseSize = Math.min(22, Math.max(12, Math.round(frp / 7) + 8));
  const size = isSelected ? baseSize + 6 : baseSize;

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-125">
      ${isSelected ? `
        <div class="absolute -inset-3 rounded-full border-2 border-cyan-400 border-dashed animate-spin opacity-90 pointer-events-none" style="animation-duration: 8s;"></div>
        <div class="absolute -inset-1.5 rounded-full border border-cyan-300 animate-ping opacity-75 pointer-events-none"></div>
      ` : ''}
      <div class="${theme.pulseClass}" style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${theme.bg};
        border: 2px solid ${theme.border};
        border-radius: 9999px;
        box-shadow: 0 0 14px ${theme.glowColor};
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-thermal-marker',
    iconSize: [size + 12, size + 12],
    iconAnchor: [(size + 12) / 2, (size + 12) / 2],
  });
}

// Generate the rich explainability & telemetry popup HTML
function createPopupContent(spot, onSelectHotspot) {
  const theme = CATEGORY_THEMES[spot.category] || CATEGORY_THEMES['Unclassified'];
  const fac = spot.nearest_facility || {};
  const isInside = fac.distance_m === 0 || fac.distance_m <= 100;
  const spotState = spot.state || fac.state || 'India';
  const spotDistrict = spot.district || fac.district || 'General District';
  const spotDesc = spot.description || fac.description || `${fac.name || 'Thermal anomaly point'} located in ${spotDistrict}, ${spotState}.`;

  const container = document.createElement('div');
  container.className = 'text-xs text-slate-200 p-1.5 space-y-2 min-w-[260px] max-w-[300px]';

  container.innerHTML = `
    <!-- Header with Category -->
    <div class="flex items-center justify-between border-b border-slate-700 pb-1.5">
      <span class="font-bold text-white text-sm font-mono tracking-wider">${spot.id}</span>
      <span class="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider" style="background-color: ${theme.bg}; color: #ffffff">
        ${spot.category}
      </span>
    </div>

    <!-- State & District Badges -->
    <div class="bg-slate-800/80 rounded-lg p-2 border border-slate-700 space-y-1">
      <div class="flex items-center justify-between text-xs">
        <span class="text-cyan-300 font-semibold">🏛️ State: <strong class="text-white">${spotState}</strong></span>
      </div>
      <div class="flex items-center justify-between text-xs">
        <span class="text-emerald-300 font-semibold">📍 District: <strong class="text-white">${spotDistrict}</strong></span>
      </div>
    </div>

    <!-- Why Flagged as Industrial? / XAI Explainability Card -->
    <div class="bg-slate-900/90 rounded-lg p-2 border border-cyan-800/70 space-y-1.5">
      <div class="flex items-center justify-between text-[11px] font-bold text-cyan-300">
        <span class="flex items-center gap-1 font-mono uppercase">🧠 Why Flagged by AI?</span>
        <span class="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1 rounded font-mono">XAI</span>
      </div>
      <div class="space-y-1 text-[11px] text-slate-300">
        <div class="flex items-center justify-between">
          <span class="text-slate-400">• Inside Industrial Polygon:</span>
          <span class="font-mono font-bold ${isInside ? 'text-red-400' : 'text-amber-300'}">
            ${isInside ? 'YES (0m)' : `${Math.round(fac.distance_m || 0)}m`}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-400">• 30-Day Recurrence:</span>
          <span class="font-mono font-bold text-orange-400">
            ${spot.persistence_count_30d || 1}x passes
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-400">• Heat Radiative Power:</span>
          <span class="font-mono font-bold text-amber-400">${spot.frp} MW</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-slate-400">• Model Confidence:</span>
          <span class="font-mono font-bold text-emerald-400">${Math.round(spot.confidence)}%</span>
        </div>
      </div>
    </div>

    <!-- Site Description -->
    <div class="text-[11px] text-slate-300 leading-snug bg-slate-950/60 p-2 rounded border border-slate-800">
      <div class="text-[10px] text-amber-400 font-mono uppercase font-bold mb-0.5">📝 Description</div>
      <div>${spotDesc}</div>
    </div>

    <!-- Telemetry Metrics -->
    <div class="grid grid-cols-2 gap-1.5 text-[11px] pt-0.5">
      <div><span class="text-slate-400">Brightness:</span> <span class="font-bold text-red-300">${spot.brightness} K</span></div>
      <div><span class="text-slate-400">Date:</span> <span class="font-mono text-slate-200">${spot.acq_date}</span></div>
    </div>

    <!-- Inspect Details Button -->
    <button
      id="btn-inspect-${spot.id}"
      class="w-full mt-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-1.5 rounded-lg text-center transition shadow-md cursor-pointer flex items-center justify-center gap-1.5 text-xs font-mono"
    >
      <span>Inspect Telemetry &amp; AI Why</span>
      <span>&rarr;</span>
    </button>
  `;

  setTimeout(() => {
    const btn = container.querySelector(`#btn-inspect-${spot.id}`);
    if (btn) {
      btn.onclick = () => {
        onSelectHotspot(spot);
      };
    }
  }, 10);

  return container;
}

// Marker Cluster & Layer Handler Component
function HotspotsLayer({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  enableClustering
}) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // Clean up previous layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    let layerGroup;

    if (enableClustering && typeof L.markerClusterGroup === 'function') {
      // Create high-tech animated cluster group
      layerGroup = L.markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 48,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          const markers = cluster.getAllChildMarkers();

          let hasIndustrial = false;
          let hasPersistent = false;
          for (const m of markers) {
            if (m.options?.customCategory === 'Industrial Fire') hasIndustrial = true;
            if (m.options?.customCategory === 'Persistent Thermal Source') hasPersistent = true;
          }

          const badgeClass = hasIndustrial
            ? 'cluster-badge-industrial'
            : hasPersistent
            ? 'cluster-badge-persistent'
            : 'cluster-badge-default';

          return L.divIcon({
            html: `<div class="cluster-badge ${badgeClass}" title="${count} thermal hotspots clustered"><span>${count}</span></div>`,
            className: 'custom-cluster-wrapper',
            iconSize: L.point(44, 44),
            iconAnchor: [22, 22]
          });
        }
      });
    } else {
      // Normal flat FeatureGroup when clustering is toggled off
      layerGroup = L.featureGroup();
    }

    // Populate markers
    hotspots.forEach((spot) => {
      const isSelected = selectedHotspot && selectedHotspot.id === spot.id;
      const icon = createCustomIcon(spot.category, spot.frp, isSelected);

      const marker = L.marker([spot.latitude, spot.longitude], {
        icon,
        customCategory: spot.category,
      });

      // Sleek Hover Tooltip
      const spotState = spot.state || spot.nearest_facility?.state || 'India';
      const spotDistrict = spot.district || spot.nearest_facility?.district || 'General';
      const tooltipHtml = `
        <div class="space-y-0.5">
          <div class="font-bold flex items-center justify-between gap-2 font-mono">
            <span>${spot.id}</span>
            <span class="text-[9px] px-1 rounded uppercase font-bold" style="background:${(CATEGORY_THEMES[spot.category] || CATEGORY_THEMES['Unclassified']).bg}; color:#fff;">
              ${spot.category}
            </span>
          </div>
          <div class="text-[11px] text-cyan-300">🏛️ ${spotState} &bull; 📍 ${spotDistrict}</div>
          <div class="text-[10px] text-amber-300 font-mono">FRP: ${spot.frp} MW &bull; Temp: ${spot.brightness} K</div>
        </div>
      `;

      marker.bindTooltip(tooltipHtml, {
        className: 'dark-tooltip',
        direction: 'top',
        offset: [0, -10],
        opacity: 0.95
      });

      // Pin Click Popup
      marker.bindPopup(() => createPopupContent(spot, onSelectHotspot), {
        className: 'dark-popup',
        maxWidth: 320,
      });

      marker.on('click', () => {
        if (spot.category === 'Industrial Fire') {
          playAlertChirp();
        } else {
          playSonarPing(920);
        }
        onSelectHotspot(spot);
      });

      layerGroup.addLayer(marker);
    });

    map.addLayer(layerGroup);
    layerRef.current = layerGroup;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, hotspots, selectedHotspot, enableClustering]);

  return null;
}

export default function MapViewer({
  hotspots = [],
  zones = [],
  selectedHotspot,
  onSelectHotspot,
  mapCenter,
  mapZoom,
  showZones = true,
  tileLayer = 'roads',
  onChangeTileLayer,
  selectedState = 'All'
}) {
  const [showRadarScan, setShowRadarScan] = useState(true);
  const [enableClustering, setEnableClustering] = useState(true);

  // Free, high-resolution tiles with real road networks, satellite imagery, and topography
  const tileUrls = {
    roads: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',       // Google Road Map format
    satellite: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',   // Google Satellite Hybrid with labels
    terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',     // Google Terrain/Physical
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    streets: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  // Active Region Info for Floating HUD
  const activeState = selectedHotspot?.state || (selectedState !== 'All' ? selectedState : 'National Overview');
  const activeDistrict = selectedHotspot?.district || (selectedHotspot?.nearest_facility?.district) || (selectedState !== 'All' ? 'Key Industrial Districts' : 'Multi-State Coverage');
  const activeDesc = selectedHotspot?.description || (
    selectedState !== 'All'
      ? `Focused surveillance of high-priority industrial facilities and thermal hotspots across ${selectedState}.`
      : 'Continuous satellite orbital pass monitoring fusing NASA VIIRS/MODIS with OpenStreetMap industrial spatial zones.'
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Animated Orbital Scan Line Beam */}
      {showRadarScan && <div className="satellite-scan-beam"></div>}

      <MapContainer
        center={mapCenter || [22.5, 82.0]}
        zoom={mapZoom || 5}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        {/* Real Map Tile Layer (High Definition, 100% Free, No Watermark, No API Key) */}
        <TileLayer
          attribution='&copy; Google Maps &bull; NASA FIRMS &bull; OpenStreetMap'
          url={tileUrls[tileLayer] || tileUrls.roads}
          maxZoom={20}
          maxNativeZoom={19}
        />

        {/* Industrial Land-Use Polygons */}
        {showZones && zones.map((zone) => {
          const isIndustrial = zone.landuse === 'industrial' || zone.tags?.industrial;
          const isQuarry = zone.landuse === 'quarry' || zone.tags?.mining;
          const isForest = zone.landuse === 'forest';

          const strokeColor = isIndustrial ? '#38bdf8' : isQuarry ? '#fb923c' : isForest ? '#34d399' : '#a78bfa';
          const fillColor = isIndustrial ? '#0284c7' : isQuarry ? '#ea580c' : isForest ? '#059669' : '#7c3aed';

          return (
            <Polygon
              key={zone.id}
              positions={zone.polygon}
              pathOptions={{
                color: strokeColor,
                fillColor: fillColor,
                fillOpacity: 0.18,
                weight: 1.5,
                dashArray: isIndustrial ? '4, 4' : undefined,
              }}
            >
              <Tooltip sticky direction="top" opacity={0.95} className="dark-tooltip">
                <div className="text-xs text-slate-100 p-1.5 max-w-xs space-y-1">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-cyan-400" />
                    {zone.name}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <span className="text-amber-300 font-semibold">🏛️ {zone.state}</span>
                    <span>&bull;</span>
                    <span className="text-emerald-300">📍 {zone.district}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase bg-slate-800/80 px-1.5 py-0.5 rounded inline-block">
                    Zone Type: {zone.landuse}
                  </div>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* Marker Cluster & Hotspots Layer */}
        <HotspotsLayer
          hotspots={hotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={onSelectHotspot}
          enableClustering={enableClustering}
        />
      </MapContainer>

      {/* Floating State, District & Description HUD Card (Top-Left) */}
      <div className="absolute top-4 left-4 z-[1000] bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-2xl p-3.5 shadow-2xl text-xs max-w-sm w-full space-y-2.5 animate-in fade-in">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
            <span className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">
              Sector Intelligence
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Clustering Toggle Button */}
            <button
              onClick={() => {
                playSonarPing(850, 0.08);
                setEnableClustering(!enableClustering);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 border ${
                enableClustering
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/80 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle Marker Clustering at high zoom levels"
            >
              <span>⚡ Cluster:</span>
              <span>{enableClustering ? 'ON' : 'OFF'}</span>
            </button>

            {/* Quick Format Switcher */}
            {onChangeTileLayer && (
              <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-0.5 text-[10px]">
                <button
                  onClick={() => onChangeTileLayer('roads')}
                  className={`px-2 py-0.5 rounded font-medium transition ${
                    tileLayer === 'roads'
                      ? 'bg-cyan-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Switch to Google Road format"
                >
                  🛣️ Roads
                </button>
                <button
                  onClick={() => onChangeTileLayer('satellite')}
                  className={`px-2 py-0.5 rounded font-medium transition ${
                    tileLayer === 'satellite'
                      ? 'bg-cyan-600 text-white font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Switch to Google Satellite Hybrid"
                >
                  🛰️ Sat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Real State and District Display */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-cyan-400 font-mono block uppercase">State</span>
            <span className="text-sm font-bold text-white tracking-wide">
              {activeState}
            </span>
          </div>
          <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-emerald-400 font-mono block uppercase">District</span>
            <span className="text-sm font-bold text-white tracking-wide truncate block">
              {activeDistrict}
            </span>
          </div>
        </div>

        {/* Map Description Box */}
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300">
          <div className="text-[10px] text-amber-400 font-mono uppercase font-bold mb-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-amber-400" />
            Map Area Description
          </div>
          <p className="leading-relaxed text-slate-300">
            {activeDesc}
          </p>
        </div>

        {/* Coordinates indicator if spot selected */}
        {selectedHotspot && (
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800">
            <span>TARGET COORDS:</span>
            <span className="text-cyan-300 font-bold">
              {selectedHotspot.latitude.toFixed(4)}°N, {selectedHotspot.longitude.toFixed(4)}°E
            </span>
          </div>
        )}
      </div>

      {/* Floating Radar & Legend Controls (Bottom-Left) */}
      <div className="absolute bottom-5 left-4 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl text-xs space-y-2 max-w-[250px]">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Thermal Feed ({hotspots.length})
          </div>
          <button
            onClick={() => setShowRadarScan(!showRadarScan)}
            className={`p-1 rounded transition ${showRadarScan ? 'text-cyan-400 bg-cyan-950/80' : 'text-slate-500 hover:text-slate-300'}`}
            title="Toggle Orbital Scan Line"
          >
            <Scan className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-ping"></span>
              <span className="text-slate-200 font-medium">Industrial Fire</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Acute</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>
              <span className="text-slate-200 font-medium">Persistent Source</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">&ge;3x/30d</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-200">Agri Burn</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Seasonal</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-200">Wildfire</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Forest</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <span className="text-slate-400">Unclassified</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Noise</span>
          </div>
        </div>
      </div>
    </div>
  );
}
