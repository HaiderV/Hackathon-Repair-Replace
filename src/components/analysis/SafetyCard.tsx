import React from "react"
import type { SafetyDetail } from "../../types/analysis"

interface SafetyCardProps {
  safety: SafetyDetail
}

export const SafetyCard: React.FC<SafetyCardProps> = ({ safety }) => {
  const isHigh = safety.level === "high"
  const isMedium = safety.level === "medium"

  const badgeColor = isHigh
    ? "bg-red-100 text-red-800 border-red-300"
    : isMedium
      ? "bg-amber-100 text-amber-900 border-amber-300"
      : "bg-emerald-100 text-emerald-900 border-emerald-300"

  const cardBorder = isHigh
    ? "border-red-300/80 bg-red-500/5"
    : isMedium
      ? "border-amber-300/80 bg-amber-500/5"
      : "border-emerald-300/60 bg-emerald-500/5"

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${cardBorder}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`flex h-8 w-8 shrink-0 aspect-square min-w-[2rem] min-h-[2rem] items-center justify-center rounded-lg ${
              isHigh
                ? "bg-red-600/15 text-red-700"
                : isMedium
                  ? "bg-amber-600/15 text-amber-700"
                  : "bg-emerald-600/15 text-emerald-700"
            }`}
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </span>
          <div>
            <h4 className="font-serif text-base font-bold text-[#2B2118]">
              Safety Advisory & Risk Rating
            </h4>
            <p className="text-xs text-[#523D2B]/80">
              Safety Score: <strong>{safety.score}/100</strong>
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeColor}`}
        >
          {safety.level} Risk
        </span>
      </div>

      {/* Safety Score Bar */}
      <div className="w-full bg-[#2B2118]/10 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isHigh
              ? "bg-red-600"
              : isMedium
                ? "bg-amber-500"
                : "bg-emerald-600"
          }`}
          style={{ width: `${Math.min(100, Math.max(10, safety.score))}%` }}
        />
      </div>

      {safety.warning ? (
        <div
          className={`mt-2 rounded-xl p-3 text-xs leading-relaxed ${
            isHigh
              ? "bg-red-100/70 text-red-900 border border-red-200"
              : isMedium
                ? "bg-amber-100/70 text-amber-950 border border-amber-200"
                : "bg-emerald-100/70 text-emerald-950 border border-emerald-200"
          }`}
        >
          <span className="font-bold">⚠️ Warning Note: </span>
          {safety.warning}
        </div>
      ) : (
        <p className="text-xs text-[#523D2B]/80 italic">
          No critical hazards detected for this repair operation. Always
          disconnect power sources before starting.
        </p>
      )}
    </div>
  )
}

export default SafetyCard
