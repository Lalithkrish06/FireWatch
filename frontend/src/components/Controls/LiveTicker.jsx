import React from 'react';
import { Radio, Satellite, Flame, Factory, ShieldAlert, Cpu } from 'lucide-react';

const TICKER_ITEMS = [
  { icon: Flame, color: 'text-red-400', text: '[ACUTE ALERT] VIIRS S-NPP: 194.2 MW Thermal Exceedance at Tata Steel (Jajpur, Odisha)' },
  { icon: Factory, color: 'text-orange-400', text: '[PERSISTENCE CONFIRMED] Jharia Coal Seam Fire (Dhanbad, Jharkhand) active across 26 satellite passes' },
  { icon: Radio, color: 'text-cyan-400', text: '[ORBITAL TELEMETRY] VIIRS NOAA-20 Night Pass completed over Jamnagar & Surat Petrochemical Corridor (Gujarat)' },
  { icon: ShieldAlert, color: 'text-amber-400', text: '[COMPLIANCE WATCH] Jindal Steel & Power Complex (Angul, Odisha) monitored for flare emissions' },
  { icon: Cpu, color: 'text-emerald-400', text: '[AI CLASSIFIER] Scikit-Learn Random Forest active across Odisha, Jharkhand, Gujarat, Punjab & UP' },
  { icon: Satellite, color: 'text-purple-400', text: '[SENSOR STATUS] VIIRS 375m I-Band nominal • MODIS 1km calibrated • NTRO Multi-District Feed live' },
];

export default function LiveTicker() {
  return (
    <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-1.5 overflow-hidden flex items-center gap-3 text-xs z-[1001]">
      {/* Live Badge */}
      <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/60 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-red-300 tracking-wider flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
        <span>SAT FEED</span>
      </div>

      {/* Scrolling Ticker Strip */}
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-ticker space-x-12">
          {/* Duplicated list to create continuous infinite marquee */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                <Icon className={`w-3.5 h-3.5 ${item.color} flex-shrink-0`} />
                <span>{item.text}</span>
                <span className="text-slate-600 ml-4">&bull;</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orbital Speed Telemetry */}
      <div className="hidden xl:flex items-center gap-3 font-mono text-[10px] text-slate-400 border-l border-slate-800 pl-3 flex-shrink-0">
        <div>ORBIT: <span className="text-cyan-400">824 km LEO</span></div>
        <div>SWATH: <span className="text-amber-400">3,040 km</span></div>
      </div>
    </div>
  );
}
