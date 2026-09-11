const API_BASE = '/api';
const DIRECT_BACKEND = 'http://127.0.0.1:8000/api';

// Map API paths to bundled static data for standalone Netlify deployments
const STATIC_FALLBACK_MAP = {
  '/hotspots': '/data/hotspots.json',
  '/persistent': '/data/persistent.json',
  '/stats': '/data/stats.json',
  '/industrial-zones': '/data/industrial_zones.json',
  '/presets': '/data/presets.json',
};

let cachedStaticHotspots = null;

async function loadStaticHotspots() {
  if (!cachedStaticHotspots) {
    const res = await fetch('/data/hotspots.json');
    cachedStaticHotspots = await res.json();
  }
  return cachedStaticHotspots;
}

/**
 * Robust fetcher:
 * 1. Tries /api proxy
 * 2. Tries direct 127.0.0.1:8000
 * 3. Falls back to bundled static /data/*.json for standalone Netlify hosting
 */
async function apiFetch(path, options = {}) {
  // Strip query string for route lookup
  const cleanPath = path.split('?')[0];

  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    if (res.ok) return await res.json();
    throw new Error(`Proxy error ${res.status}`);
  } catch (err) {
    try {
      const resFallback = await fetch(`${DIRECT_BACKEND}${path}`, options);
      if (resFallback.ok) return await resFallback.json();
      throw new Error(`Direct backend error ${resFallback.status}`);
    } catch (fallbackErr) {
      // 3. Static fallback for Netlify deployment
      const staticFile = STATIC_FALLBACK_MAP[cleanPath];
      if (staticFile) {
        console.warn(`[FireWatch Netlify Mode] Serving static telemetry from ${staticFile}`);
        const staticRes = await fetch(staticFile);
        if (staticRes.ok) {
          const data = await staticRes.json();
          return data;
        }
      }

      // Handle single hotspot detail in static mode
      if (cleanPath.startsWith('/hotspots/')) {
        const id = cleanPath.split('/')[2];
        const allSpots = await loadStaticHotspots();
        const spot = allSpots.find((s) => s.id === id);
        if (spot) {
          const history = allSpots
            .filter((s) => s.cluster_id && s.cluster_id === spot.cluster_id)
            .map((s) => ({
              id: s.id,
              acq_date: s.acq_date,
              acq_time: s.acq_time,
              frp: s.frp,
              brightness: s.brightness,
              daynight: s.daynight,
            }))
            .sort((a, b) => a.acq_date.localeCompare(b.acq_date));
          return { hotspot: spot, history };
        }
      }

      console.error(`[FireWatch API Error] Failed to fetch ${path}:`, err.message);
      throw err;
    }
  }
}

export async function fetchHotspots(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.minConfidence) query.append('min_confidence', params.minConfidence);
  if (params.dateFrom) query.append('date_from', params.dateFrom);
  if (params.dateTo) query.append('date_to', params.dateTo);
  if (params.isPersistent !== undefined && params.isPersistent !== null) {
    query.append('is_persistent', params.isPersistent);
  }
  if (params.preset && params.preset !== 'india_all') {
    query.append('preset', params.preset);
  }
  if (params.state && params.state !== 'All') {
    query.append('state', params.state);
  }
  if (params.district && params.district !== 'All') {
    query.append('district', params.district);
  }

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return apiFetch(`/hotspots${queryString}`);
}

export async function fetchHotspotDetails(id) {
  return apiFetch(`/hotspots/${id}`);
}

export async function fetchPersistentSources() {
  return apiFetch('/persistent');
}

export async function fetchStats() {
  return apiFetch('/stats');
}

export async function fetchIndustrialZones() {
  return apiFetch('/industrial-zones');
}

export async function fetchPresets() {
  return apiFetch('/presets');
}

export async function triggerLiveIngestion(payload) {
  return apiFetch('/ingest/live', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function getPdfReportUrl(id) {
  return `${API_BASE}/hotspots/${id}/report/pdf`;
}

export function getCsvExportUrl() {
  return `${API_BASE}/export/csv`;
}
