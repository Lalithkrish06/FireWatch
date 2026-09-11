import L from 'leaflet';

// Attach Leaflet to window object so plugins like leaflet.markercluster can hook into it
if (typeof window !== 'undefined') {
  window.L = L;
}

export default L;
