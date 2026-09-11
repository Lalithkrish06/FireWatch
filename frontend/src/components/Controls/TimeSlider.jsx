import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Calendar, Radio, Activity } from 'lucide-react';
import { playSonarPing } from '../../services/sound';

export default function TimeSlider({
  dates = [],
  selectedDate,
  onDateChange,
  isCumulative = false,
  onToggleCumulative,
  totalMatching = 0,
  hotspots = []
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(900);
  const timerRef = useRef(null);

  // Auto playback loop
  useEffect(() => {
    if (isPlaying && dates.length > 0) {
      timerRef.current = setInterval(() => {
        onDateChange((prevDate) => {
          const currentIndex = dates.indexOf(prevDate);
          if (currentIndex === -1 || currentIndex >= dates.length - 1) {
            playSonarPing(700, 0.08);
            return dates[0];
          }
          playSonarPing(820 + (currentIndex * 15), 0.06);
          return dates[currentIndex + 1];
        });
      }, playbackSpeed);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, dates, playbackSpeed, onDateChange]);

  const currentIndex = selectedDate ? dates.indexOf(selectedDate) : dates.length - 1;

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    if (dates[idx]) {
      playSonarPing(880, 0.08);
      onDateChange(dates[idx]);
    }
  };

  const handleStep = (direction) => {
    let nextIdx = currentIndex + direction;
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= dates.length) nextIdx = dates.length - 1;
    if (dates[nextIdx]) {
      playSonarPing(900, 0.08);
      onDateChange(dates[nextIdx]);
    }
  };

  // Compute daily detection density histogram
  const { dateDensity, maxDensity } = React.useMemo(() => {
    const counts = {};
    dates.forEach((d) => { counts[d] = 0; });
    if (hotspots && hotspots.length > 0) {
      hotspots.forEach((h) => {
        if (h.acq_date && counts[h.acq_date] !== undefined) {
          counts[h.acq_date] += 1;
        }
      });
    } else {
      dates.forEach((d, i) => {
        counts[d] = Math.max(2, Math.round(5 + 4 * Math.sin(i * 0.4) + (i % 5 === 0 ? 6 : 0)));
      });
    }
    const maxVal = Math.max(1, ...Object.values(counts));
    return { dateDensity: counts, maxDensity: maxVal };
  }, [dates, hotspots]);

  if (!dates || dates.length === 0) return null;

  const progressPct = dates.length > 1 ? ((currentIndex >= 0 ? currentIndex : dates.length - 1) / (dates.length - 1)) * 100 : 100;

  return (
    <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-800/90 rounded-2xl px-5 py-3.5 shadow-2xl text-slate-200 ring-1 ring-cyan-500/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Playback Controls & Date Readout */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playSonarPing(isPlaying ? 600 : 1000, 0.1);
              setIsPlaying(!isPlaying);
            }}
            className={`p-2.5 rounded-xl transition shadow-lg flex items-center justify-center transform active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/30'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-cyan-600/30'
            }`}
            title={isPlaying ? 'Pause time-lapse' : 'Play continuous time-lapse'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={() => handleStep(-1)}
            disabled={currentIndex <= 0}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition border border-slate-700/60"
            title="Step Back 1 Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleStep(1)}
            disabled={currentIndex >= dates.length - 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 transition border border-slate-700/60"
            title="Step Forward 1 Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
            <div className="relative">
              <Calendar className="w-4 h-4 text-cyan-400" />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              )}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
                <span>Orbit Window</span>
                {isPlaying && <Activity className="w-3 h-3 text-amber-400 animate-pulse" />}
              </div>
              <div className="text-sm font-mono font-bold text-white tracking-wide">
                {selectedDate || 'All 30 Days Combined'}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Range Scrubber with Neon Progress Track + Density Histogram */}
        <div className="flex-1 min-w-[280px] px-2 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>{dates[0]}</span>
            <span className="text-cyan-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Daily Thermal Density Histogram
            </span>
            <span className="text-cyan-400 font-semibold">{dates[dates.length - 1]}</span>
          </div>

          {/* Mini Density Histogram Bars */}
          <div className="flex items-end gap-[3px] h-6 px-1 pt-1 bg-slate-950/50 rounded-md border border-slate-800/80">
            {dates.map((d, i) => {
              const count = dateDensity[d] || 0;
              const barHeightPct = Math.max(15, Math.round((count / maxDensity) * 100));
              const isSelected = selectedDate === d || (currentIndex === i);
              const isPeak = count >= 8;

              return (
                <div
                  key={d}
                  onClick={() => {
                    playSonarPing(880, 0.08);
                    onDateChange(d);
                  }}
                  className={`flex-1 rounded-t-sm transition-all cursor-pointer hover:opacity-100 ${
                    isSelected
                      ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8] scale-y-110'
                      : isPeak
                      ? 'bg-gradient-to-t from-red-600 to-amber-400 opacity-90'
                      : 'bg-slate-700/80 hover:bg-slate-500 opacity-70'
                  }`}
                  style={{ height: `${barHeightPct}%` }}
                  title={`${d}: ${count} thermal detections (${isPeak ? 'High Peak Activity' : 'Baseline'})`}
                />
              );
            })}
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={dates.length - 1}
              value={currentIndex >= 0 ? currentIndex : dates.length - 1}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 z-10 transition"
            />
            {/* Glowing progress underlay */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-gradient-to-r from-cyan-600 via-blue-500 to-amber-500 rounded-lg pointer-events-none opacity-80 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
              style={{ width: `${progressPct}%` }}
            ></div>
          </div>
        </div>

        {/* Mode Toggles & Counter */}
        <div className="flex items-center gap-3">
          <div className="text-xs bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700/80 font-mono shadow-inner">
            <span className="text-slate-400">Telemetry: </span>
            <span className="text-amber-400 font-bold">{totalMatching}</span>
          </div>

          <button
            onClick={onToggleCumulative}
            className={`text-xs px-3 py-1.5 rounded-lg transition font-medium border ${
              isCumulative
                ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Cumulative mode shows all thermal detections up to current date"
          >
            {isCumulative ? 'Cumulative: ON' : 'Single Day'}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              playSonarPing(500, 0.08);
              onDateChange(null);
            }}
            className="text-xs text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
            title="Reset to all 30 days combined"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
