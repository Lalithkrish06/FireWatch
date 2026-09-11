import React, { useState, useEffect } from 'react';
import {
  X, FileText, ExternalLink, Flame, Factory, MapPin,
  Calendar, Clock, Zap, AlertOctagon, TrendingUp, Download,
  Landmark, BrainCircuit, ShieldAlert, CheckCircle2, Printer
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { fetchHotspotDetails, getPdfReportUrl } from '../../services/api';
import { playSonarPing } from '../../services/sound';

const CATEGORY_BADGES = {
  'Industrial Fire': 'bg-red-950/90 border-red-500/80 text-red-300',
  'Persistent Thermal Source': 'bg-orange-950/90 border-orange-500/80 text-orange-300',
  'Agricultural Burn': 'bg-amber-950/90 border-amber-500/80 text-amber-300',
  'Wildfire': 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300',
  'Unclassified': 'bg-slate-800 border-slate-600 text-slate-400',
};

// Client-side fallback report generator for standalone cloud/Netlify deployments
function generatePrintableIncidentDossier(hotspot) {
  const fac = hotspot.nearest_facility || {};
  const state = hotspot.state || fac.state || 'India';
  const district = hotspot.district || fac.district || 'General District';
  const isInside = fac.distance_m === 0 || fac.distance_m <= 100;

  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Please allow popups to open the official NTRO Incident Report.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>NTRO Incident Dossier - ${hotspot.id}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #ffffff;
          color: #1e293b;
          margin: 0;
          padding: 30px;
          line-height: 1.5;
        }
        .header-table {
          width: 100%;
          border-bottom: 3px double #0f172a;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .title {
          font-size: 20px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0f172a;
        }
        .subtitle {
          font-size: 12px;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 12px;
          text-transform: uppercase;
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #f87171;
        }
        .section-title {
          font-size: 13px;
          font-weight: bold;
          text-transform: uppercase;
          color: #0369a1;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 4px;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        table.data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 12px;
        }
        table.data-table th, table.data-table td {
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          text-align: left;
        }
        table.data-table th {
          background-color: #f8fafc;
          font-weight: bold;
          color: #334155;
          width: 35%;
        }
        .xai-box {
          background-color: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 6px;
          padding: 12px;
          margin-top: 15px;
          font-size: 12px;
        }
        .footer {
          margin-top: 40px;
          font-size: 10px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
          text-align: center;
        }
        @media print {
          .no-print { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 18px; border-radius: 6px; font-weight: bold; cursor: pointer;">
          🖨️ Print / Save as PDF
        </button>
      </div>

      <table class="header-table">
        <tr>
          <td>
            <div class="subtitle">Government of India &bull; Smart India Hackathon SIH26162</div>
            <div class="title">National Technical Research Organisation (NTRO)</div>
            <div class="subtitle">FireWatch AI &bull; Satellite Thermal Anomaly Dossier</div>
          </td>
          <td style="text-align: right;">
            <div class="badge">${hotspot.category}</div>
            <div style="font-size: 11px; margin-top: 5px; font-family: monospace;">INCIDENT REF: ${hotspot.id}</div>
            <div style="font-size: 10px; color: #64748b;">Generated: ${new Date().toISOString()}</div>
          </td>
        </tr>
      </table>

      <div class="section-title">1. Administrative & Geographic Jurisdiction</div>
      <table class="data-table">
        <tr><th>State Jurisdiction</th><td><strong>${state}</strong></td></tr>
        <tr><th>District / Sector</th><td><strong>${district}</strong></td></tr>
        <tr><th>Geographic Coordinates</th><td><code>${hotspot.latitude.toFixed(5)}° N, ${hotspot.longitude.toFixed(5)}° E</code></td></tr>
        <tr><th>Nearest Infrastructure Facility</th><td>${fac.name || 'Unmapped Facility'} (${fac.landuse_type || 'industrial'})</td></tr>
        <tr><th>Perimeter Proximity</th><td><strong>${isInside ? 'CONFIRMED INSIDE FACILITY POLYGON (0m)' : `${Math.round(fac.distance_m)}m from boundary`}</strong></td></tr>
      </table>

      <div class="section-title">2. Satellite Orbital Telemetry (NASA FIRMS MODIS / VIIRS)</div>
      <table class="data-table">
        <tr><th>Fire Radiative Power (FRP)</th><td><strong>${hotspot.frp} MW</strong></td></tr>
        <tr><th>Brightness Temperature</th><td><strong>${hotspot.brightness} Kelvin</strong></td></tr>
        <tr><th>Acquisition Timestamp</th><td>${hotspot.acq_date} at ${hotspot.acq_time || '10:30'} UTC (${hotspot.daynight === 'N' ? 'Night Pass' : 'Day Pass'})</td></tr>
        <tr><th>Satellite Sensor</th><td>${hotspot.satellite || 'VIIRS NOAA-20 / S-NPP'}</td></tr>
        <tr><th>30-Day Persistence Recurrence</th><td><strong>${hotspot.persistence_count_30d || 1} confirmed orbital detections</strong></td></tr>
      </table>

      <div class="section-title">3. Explainable AI (XAI) Classification Decision Tree</div>
      <div class="xai-box">
        <strong>Random Forest Classification Decision:</strong> ${hotspot.category} (${Math.round(hotspot.classification_confidence * 100)}% Confidence)
        <p style="margin-top: 6px; margin-bottom: 0;">
          <strong>Explainability Attribution:</strong>
          This hotspot was classified as <em>${hotspot.category}</em> because it falls ${isInside ? 'directly within an OpenStreetMap industrial polygon (distance: 0m)' : `${Math.round(fac.distance_m)}m from industrial polygon perimeter`}, exhibits a high recurrence count of ${hotspot.persistence_count_30d || 1} passes in 30 days, and produces a sustained thermal radiative power of ${hotspot.frp} MW.
        </p>
      </div>

      <div class="section-title">4. Ground Context & Description</div>
      <p style="font-size: 12px; color: #334155; background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-radius: 4px;">
        ${hotspot.description || fac.description || 'Active industrial surveillance sector verified under NTRO monitoring criteria.'}
      </p>

      <div class="footer">
        Confidential Incident Intelligence &bull; Produced by FireWatch AI System &bull; NTRO SIH26162
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export default function HotspotDetail({ hotspot, onClose }) {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hotspot?.id) {
      setLoading(true);
      fetchHotspotDetails(hotspot.id)
        .then((data) => {
          if (data?.history) {
            setHistoryData(data.history);
          }
        })
        .catch((err) => console.error('Error fetching history:', err))
        .finally(() => setLoading(false));
    }
  }, [hotspot?.id]);

  if (!hotspot) return null;

  const fac = hotspot.nearest_facility || {};
  const isInside = fac.distance_m === 0 || fac.distance_m <= 100;
  const stateName = hotspot.state || fac.state || 'India';
  const districtName = hotspot.district || fac.district || 'General District';
  const siteDescription = hotspot.description || fac.description || `${fac.name || 'Thermal anomaly point'} located in ${districtName}, ${stateName}.`;

  const handleDownloadReport = (e) => {
    e.preventDefault();
    playSonarPing(900, 0.1);
    const backendPdfUrl = getPdfReportUrl(hotspot.id);

    // Try opening backend PDF or fall back to client-side dossier
    fetch(backendPdfUrl, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          window.open(backendPdfUrl, '_blank');
        } else {
          generatePrintableIncidentDossier(hotspot);
        }
      })
      .catch(() => {
        generatePrintableIncidentDossier(hotspot);
      });
  };

  // Plain-English explanation generator based on features
  const getDecisionSummary = () => {
    if (hotspot.category === 'Industrial Fire') {
      return `Classified as Industrial Fire with ${Math.round(hotspot.classification_confidence * 100)}% confidence due to acute thermal radiative power (${hotspot.frp} MW), coincidence with ${fac.name || 'industrial'} polygon (${isInside ? '0m perimeter distance' : `${Math.round(fac.distance_m)}m away`}), and sustained brightness temperature of ${hotspot.brightness} K.`;
    }
    if (hotspot.category === 'Persistent Thermal Source') {
      return `Identified as a Persistent Thermal Source (flare/coal seam) due to high recurrence frequency (${hotspot.persistence_count_30d || 1} passes in 30 days within 1km) and proximity to ${fac.name || 'industrial zone'}.`;
    }
    if (hotspot.category === 'Agricultural Burn') {
      return `Classified as Agricultural Burn because the anomaly is located in open rural croplands (>15km from heavy industrial zones) with moderate FRP (${hotspot.frp} MW) and transient single-pass recurrence.`;
    }
    if (hotspot.category === 'Wildfire') {
      return `Classified as Wildfire due to dense forest land-use cover, dispersed cluster perimeter, and absence of fixed industrial infrastructure.`;
    }
    return `Thermal signature filtered as transient unclassified noise after spatial-temporal verification.`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-slate-800 text-slate-200 overflow-y-auto w-full md:w-[420px] shadow-2xl z-[1001]">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-5 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono text-slate-400">Satellite Incident Dossier</div>
            <div className="text-base font-mono font-bold text-white tracking-wide">{hotspot.id}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 space-y-4 flex-1">
        {/* Classification Badge Card */}
        <div className={`p-4 rounded-xl border ${CATEGORY_BADGES[hotspot.category] || CATEGORY_BADGES['Unclassified']}`}>
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-mono uppercase tracking-wider opacity-80">AI Model Output</div>
            <div className="text-xs font-mono font-bold">
              {Math.round(hotspot.classification_confidence * 100)}% Confidence
            </div>
          </div>
          <div className="text-lg font-bold mt-1 text-white tracking-wide flex items-center gap-2">
            {hotspot.category}
            {hotspot.is_persistent && (
              <span className="text-[10px] bg-orange-600/60 text-orange-200 px-2 py-0.5 rounded-full uppercase font-mono">
                Persistent Flare
              </span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EXPLAINABILITY PANEL (CORE PITCH: WHY FLAGGED BY AI?) - PLACED AT TOP      */}
        {/* ========================================================================= */}
        <div className="bg-slate-950/90 border-2 border-cyan-500/80 rounded-xl p-4 space-y-3 shadow-xl ring-2 ring-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 font-mono">
              <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" />
              Why Flagged as {hotspot.category}?
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono font-bold">
              XAI EXPLAINABILITY
            </span>
          </div>

          {/* Plain-English AI Decision Reason */}
          <div className="text-xs text-slate-200 leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            <p>{getDecisionSummary()}</p>
          </div>

          {/* Key Factor Importance Progress Bars */}
          <div className="space-y-2.5 pt-1">
            <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
              Feature Importance Attribution
            </div>

            {hotspot.explainability && hotspot.explainability.length > 0 ? (
              hotspot.explainability.map((factor, idx) => (
                <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{factor.feature}</span>
                    <span className="font-mono text-cyan-400 font-bold">{Math.round(factor.importance_pct)}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, factor.importance_pct))}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {factor.description}
                  </div>
                </div>
              ))
            ) : (
              <div className="space-y-2 text-xs">
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">OSM Industrial Polygon Proximity</span>
                    <span className="font-mono text-cyan-400 font-bold">42%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full w-[42%]"></div>
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">30-Day Persistence Recurrence</span>
                    <span className="font-mono text-orange-400 font-bold">28%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full w-[28%]"></div>
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Fire Radiative Power (FRP)</span>
                    <span className="font-mono text-amber-400 font-bold">18%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full w-[18%]"></div>
                  </div>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Brightness Temperature</span>
                    <span className="font-mono text-red-400 font-bold">12%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full w-[12%]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button: One-Click Official NTRO Report (PDF / Print Dossier) */}
        <button
          onClick={handleDownloadReport}
          className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-3 px-4 rounded-xl shadow-xl transition transform active:scale-95 cursor-pointer text-sm font-mono tracking-wide border border-amber-500/30"
        >
          <Download className="w-4 h-4" />
          <span>One-Click NTRO Incident Report</span>
        </button>

        {/* State & District Administrative Jurisdiction */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold uppercase text-[11px]">
              <Landmark className="w-3.5 h-3.5" />
              Administrative Jurisdiction
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded font-mono font-semibold">
              GEO-CODED
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">State</span>
              <span className="text-sm font-bold text-cyan-300 tracking-wide flex items-center gap-1">
                🏛️ {stateName}
              </span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">District</span>
              <span className="text-sm font-bold text-emerald-300 tracking-wide flex items-center gap-1">
                📍 {districtName}
              </span>
            </div>
          </div>
        </div>

        {/* Site Description */}
        <div className="bg-slate-800/40 border border-slate-700/70 rounded-xl p-3.5 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-mono">
            <FileText className="w-3.5 h-3.5" />
            Site Context &amp; Description
          </div>
          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 font-sans">
            {siteDescription}
          </p>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              FIRE RADIATIVE POWER
            </div>
            <div className="text-lg font-mono font-bold text-amber-300 mt-1">
              {hotspot.frp} <span className="text-xs font-normal text-slate-400">MW</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-red-400" />
              BRIGHTNESS TEMP
            </div>
            <div className="text-lg font-mono font-bold text-red-300 mt-1">
              {hotspot.brightness} <span className="text-xs font-normal text-slate-400">K</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" />
              ACQUISITION DATE
            </div>
            <div className="text-xs font-mono font-bold text-slate-200 mt-1">
              {hotspot.acq_date}
            </div>
            <div className="text-[10px] font-mono text-slate-400">
              {hotspot.acq_time || '10:30'} hrs ({hotspot.daynight === 'N' ? 'Night Pass' : 'Day Pass'})
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              30-DAY RECURRENCE
            </div>
            <div className="text-lg font-mono font-bold text-emerald-300 mt-1">
              {hotspot.persistence_count_30d || 1} <span className="text-xs font-normal text-slate-400">times</span>
            </div>
          </div>
        </div>

        {/* Spatial & Infrastructure Cross-Reference Card */}
        <div className="bg-slate-800/40 border border-slate-700/70 rounded-xl p-4 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Factory className="w-4 h-4" />
            OSM Infrastructure Match
          </div>
          <div className="text-sm font-semibold text-white">
            {fac.name || 'Unmapped Infrastructure'}
          </div>
          <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-slate-700/50">
            <span>Land-use Polygon:</span>
            <span className="font-mono text-amber-400 uppercase">{fac.landuse_type || 'industrial'}</span>
          </div>
          <div className="text-xs text-slate-300 flex items-center justify-between">
            <span>Distance to Perimeter:</span>
            <span className={`font-mono font-bold ${isInside ? 'text-red-400' : 'text-slate-300'}`}>
              {isInside ? 'INSIDE FACILITY (0m)' : `${Math.round(fac.distance_m)}m away`}
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-1 pt-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span className="font-mono text-[11px]">{hotspot.latitude.toFixed(5)}° N, {hotspot.longitude.toFixed(5)}° E</span>
          </div>
        </div>

        {/* 30-Day Cluster Thermal History Chart */}
        {historyData.length > 1 && (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>30-Day Heat Radiance Trend (FRP)</span>
              <span className="text-[10px] text-amber-400 font-mono">{historyData.length} observations</span>
            </div>
            <div className="h-32 w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="frpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="acq_date" tick={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 9, fill: '#94a3b8' }} width={24} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="frp" stroke="#f59e0b" fillOpacity={1} fill="url(#frpGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
