import React from "react"
import type { Scores } from "../../types/analysis"

interface RecommendationCardProps {
  recommendation: "repair" | "replace" | "both" | "neither"
  scores: Scores
  replacementReason?: string
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  scores,
  replacementReason,
}) => {
  const isRepair = recommendation === "repair"
  const isReplace = recommendation === "replace"
  const isBoth = recommendation === "both"

  const titleText = isRepair
    ? "Recommendation: Repair Before Replace"
    : isReplace
      ? "Recommendation: Consider Replacement"
      : isBoth
        ? "Recommendation: Repair & Replace are Both Viable"
        : "Recommendation: Consult a Professional Specialist"

  const badgeColor = isRepair
    ? "bg-emerald-600 text-white"
    : isReplace
      ? "bg-[#E07A5F] text-white"
      : "bg-[#6C79C0] text-white"

  const borderClass = isRepair
    ? "border-emerald-600/30 bg-gradient-to-br from-emerald-500/10 via-[#FAF5EE] to-[#FAF5EE]"
    : isReplace
      ? "border-[#E07A5F]/30 bg-gradient-to-br from-[#E07A5F]/10 via-[#FAF5EE] to-[#FAF5EE]"
      : "border-[#6C79C0]/30 bg-gradient-to-br from-[#6C79C0]/10 via-[#FAF5EE] to-[#FAF5EE]"

  const repairPct = Math.round(scores.repair)
  const replacePct = Math.round(scores.replace)

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 shadow-md space-y-5 transition-all w-full min-w-0 overflow-hidden ${borderClass}`}
    >
      {/* Header Badge & Scores */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2B2118]/8 pb-4">
        <div className="min-w-0 flex-1">
          <span
            className={`inline-block rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-xs ${badgeColor}`}
          >
            {recommendation} Recommendation
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B2118] mt-2 break-words">
            {titleText}
          </h3>
        </div>

        {/* Scores Pill */}
        <div className="flex items-center gap-2.5 bg-white/85 backdrop-blur-sm border border-[#2B2118]/10 rounded-xl p-2.5 shrink-0 self-start sm:self-auto shadow-xs">
          <div className="text-center px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#523D2B]/70 block">
              Repair Score
            </span>
            <span className="font-serif text-lg sm:text-xl font-black text-emerald-800">
              {repairPct}/100
            </span>
          </div>
          <div className="h-7 w-px bg-[#2B2118]/15" />
          <div className="text-center px-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#523D2B]/70 block">
              Replace Score
            </span>
            <span className="font-serif text-lg sm:text-xl font-black text-[#9E3E26]">
              {replacePct}/100
            </span>
          </div>
        </div>
      </div>

      {/* Visual Dual Comparison Bar */}
      <div className="space-y-1.5 w-full min-w-0">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-emerald-900">Repair Index ({repairPct}%)</span>
          <span className="text-[#9E3E26]">Replace Index ({replacePct}%)</span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#2B2118]/10 p-0.5">
          <div
            className="h-full rounded-l-full bg-emerald-600 transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(5, (scores.repair / (scores.repair + scores.replace || 1)) * 100))}%`,
            }}
          />
          <div
            className="h-full rounded-r-full bg-[#E07A5F] transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(5, (scores.replace / (scores.repair + scores.replace || 1)) * 100))}%`,
            }}
          />
        </div>
      </div>

      {/* Factor Ratings Breakdown */}
      {scores.factors && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 w-full min-w-0">
          <div className="rounded-xl border border-[#2B2118]/8 bg-white/75 p-2.5 text-center min-w-0 shadow-xs">
            <span className="text-[10px] font-semibold text-[#523D2B]/70 uppercase block truncate">
              Cost Advantage
            </span>
            <span className="font-serif text-base font-bold text-[#2B2118]">
              {Math.round(scores.factors.cost)}/100
            </span>
          </div>
          <div className="rounded-xl border border-[#2B2118]/8 bg-white/75 p-2.5 text-center min-w-0 shadow-xs">
            <span className="text-[10px] font-semibold text-[#523D2B]/70 uppercase block truncate">
              Feasibility
            </span>
            <span className="font-serif text-base font-bold text-[#2B2118]">
              {Math.round(scores.factors.feasibility)}/100
            </span>
          </div>
          <div className="rounded-xl border border-[#2B2118]/8 bg-white/75 p-2.5 text-center min-w-0 shadow-xs">
            <span className="text-[10px] font-semibold text-[#523D2B]/70 uppercase block truncate">
              Difficulty Factor
            </span>
            <span className="font-serif text-base font-bold text-[#2B2118]">
              {Math.round(scores.factors.difficulty)}/100
            </span>
          </div>
          <div className="rounded-xl border border-[#2B2118]/8 bg-white/75 p-2.5 text-center min-w-0 shadow-xs">
            <span className="text-[10px] font-semibold text-[#523D2B]/70 uppercase block truncate">
              Safety Score
            </span>
            <span className="font-serif text-base font-bold text-[#2B2118]">
              {Math.round(scores.factors.safety)}/100
            </span>
          </div>
        </div>
      )}

      {/* Replacement Reason if present */}
      {replacementReason && isReplace && (
        <div className="rounded-xl bg-[#E07A5F]/15 border border-[#E07A5F]/30 p-3.5 text-xs text-[#9E3E26] leading-relaxed">
          <strong className="block font-bold mb-0.5">
            Key Replacement Driver:
          </strong>
          {replacementReason}
        </div>
      )}
    </div>
  )
}

export default RecommendationCard
