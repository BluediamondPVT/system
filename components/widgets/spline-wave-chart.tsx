'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SplineWaveChartProps {
  title?: string;
}

export function SplineWaveChart({
  title = 'Statistic',
}: SplineWaveChartProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All Transaction');

  // SVG dimensions
  const width = 560;
  const height = 190;

  // Primary Orange Spline Path (Image 1 style)
  // Starts lower on Jan, rises to peak in Feb/Mar, dips on Apr/May, rises slightly
  const primaryOrangePath =
    'M 30,135 C 75,125 110,85 145,80 C 180,75 220,135 270,145 C 320,155 370,85 430,95 C 480,105 510,135 540,125';

  // Secondary White Spline Path (smooth inverse wave)
  const secondaryWhitePath =
    'M 30,150 C 75,145 110,120 160,110 C 210,100 250,85 300,90 C 350,95 400,140 455,145 C 495,150 520,130 540,120';

  // Peak marker on orange curve at x=145, y=80
  const peakX = 145;
  const peakY = 80;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return (
    <div className="space-y-2.5">
      {/* Outer Header: Title & Dropdown */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className="glass-pill px-3.5 py-1.5 text-xs text-white/80 hover:text-white flex items-center gap-1.5 transition font-medium border border-white/12"
          >
            <span>{selectedFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/50" />
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-9 w-36 glass-card rounded-xl border border-white/15 p-1 z-30 shadow-2xl space-y-1">
              {['All Transaction', 'Monthly Flow', 'Quarterly'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(opt);
                    setFilterOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Frosted Chart Card */}
      <div className="glass-card rounded-[22px] p-5 sm:p-6 border border-white/12 space-y-4 relative overflow-hidden shadow-xl">
        {/* Top Info & Legend */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Top Contributor
            </h4>
            <p className="text-[11px] text-white/45">
              Top Half-Year Earning And Expenses Source
            </p>
          </div>

          {/* Legend dots */}
          <div className="flex flex-wrap items-center gap-3.5 text-[11px] text-white/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
              <span>Groceries</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span>Invest Corporate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff6536]" />
              <span>Hobbies</span>
            </div>
          </div>
        </div>

        {/* Dual-Spline SVG Wave */}
        <div className="relative w-full pt-1 select-none">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
          >
            {/* Orange Stroke */}
            <path
              d={primaryOrangePath}
              fill="none"
              stroke="#ff6536"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* White Stroke */}
            <path
              d={secondaryWhitePath}
              fill="none"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Peak Marker Dot (Orange ring with white inner) */}
            <circle
              cx={peakX}
              cy={peakY}
              r="6"
              fill="#ff6536"
              stroke="#ffffff"
              strokeWidth="2.5"
            />

            {/* Peak Tooltip Pill Bubble */}
            <g transform={`translate(${peakX}, ${peakY - 32})`}>
              <rect
                x="-32"
                y="-10"
                width="64"
                height="28"
                rx="8"
                fill="rgba(22, 26, 38, 0.85)"
                stroke="rgba(255, 255, 255, 0.25)"
                strokeWidth="1"
              />
              <text
                x="0"
                y="1"
                fill="rgba(255, 255, 255, 0.55)"
                fontSize="8"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                Groceries
              </text>
              <text
                x="0"
                y="12"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                $55.42
              </text>
            </g>

            {/* Month Labels */}
            {months.map((m, idx) => {
              const xPos = 40 + idx * 95;
              return (
                <text
                  key={m}
                  x={xPos}
                  y={180}
                  fill="rgba(255, 255, 255, 0.45)"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {m}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
