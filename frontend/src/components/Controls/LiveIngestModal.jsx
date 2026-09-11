import React, { useState } from 'react';
import { X, Satellite, Key, CheckCircle, AlertCircle, RefreshCw, Radio } from 'lucide-react';
import { triggerLiveIngestion } from '../../services/api';

export default function LiveIngestModal({ isOpen, onClose, onIngestSuccess }) {
  const [apiKey, setApiKey] = useState('');
  const [sensor, setSensor] = useState('VIIRS_SNPP_NRT');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await triggerLiveIngestion({
        firms_api_key: apiKey.trim() || undefined,
        source: sensor,
        country: 'IND',
        days: parseInt(days, 10),
      });
      setResult(resp);
      if (onIngestSuccess) onIngestSuccess();
    } catch (err) {
      setError(err.message || 'Live ingestion failed. Falling back to cached seed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2500] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="font-bold text-base">NASA FIRMS Live Telemetry Ingest</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Ingest real-time active fire and thermal anomaly data from NASA's MODIS / VIIRS satellites for India and run through the FireWatch spatial & ML classification pipeline.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                NASA FIRMS MAP_KEY (Optional)
              </label>
              <a
                href="https://firms.modaps.eosdis.nasa.gov/api/map_key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Get Free Key</span>
                <span className="text-xs">&rarr;</span>
              </a>
            </div>
            <input
              type="text"
              placeholder="e.g. your_firms_map_key (leave blank for offline demo)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
              <span>Leave blank to use curated 30-day India sample dataset.</span>
              <a
                href="https://firms.modaps.eosdis.nasa.gov/api/map_key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline font-mono"
              >
                firms.modaps.eosdis.nasa.gov
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Satellite Sensor</label>
              <select
                value={sensor}
                onChange={(e) => setSensor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="VIIRS_SNPP_NRT">VIIRS S-NPP (375m)</option>
                <option value="VIIRS_NOAA20_NRT">VIIRS NOAA-20 (375m)</option>
                <option value="MODIS_NRT">MODIS Terra/Aqua (1km)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Lookback Window</label>
              <select
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value={1}>Last 24 Hours (1 Day)</option>
                <option value={3}>Last 3 Days</option>
                <option value={7}>Last 7 Days</option>
                <option value={30}>Full 30-Day Window</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-lg text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-emerald-300 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-bold">{result.message}</div>
                <div className="text-[10px] opacity-80 mt-0.5">
                  Processed {result.total_ingested} points across spatial polygons & trained classifier.
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold transition flex items-center gap-1.5 shadow"
            >
              {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? 'Ingesting...' : 'Trigger Pipeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
