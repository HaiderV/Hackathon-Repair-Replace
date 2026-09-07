import React from "react"
import type {
  IInputAnalysis,
  RepairReplaceAnalysis,
  RepairReplaceCalculation,
} from "../../types/analysis"
import { formatINR } from "./CostTable"

interface MetricsSidebarProps {
  inputAnalysis: IInputAnalysis | null
  repairReplaceAnalysis: RepairReplaceAnalysis | null
  calculation: RepairReplaceCalculation | null
  onStartStage2?: () => void
  isAnalyzingStage2?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export const MetricsSidebar: React.FC<MetricsSidebarProps> = ({
  inputAnalysis,
  repairReplaceAnalysis,
  calculation,
  onStartStage2,
  isAnalyzingStage2 = false,
  isOpen = true,
  onClose,
}) => {
  const confidence = inputAnalysis?.confidence || 0
  const isHighConfidence = confidence >= 85
  const isReadyForStage2 = isHighConfidence && !calculation

  const difficulty = repairReplaceAnalysis?.repair?.difficulty
  const safety = repairReplaceAnalysis?.safety

  return (
    <aside className="flex flex-col gap-4 rounded-3xl border border-[#2B2118]/12 bg-[#FAF5EE] p-4 sm:p-5 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#2B2118]/8 pb-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-8 w-8 shrink-0 aspect-square min-w-[2rem] min-h-[2rem] items-center justify-center rounded-xl bg-[#6C79C0]/15 text-[#5360A6] shadow-sm">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </span>
          <h3 className="font-serif text-base font-bold text-[#2B2118]">
            Diagnostic Metrics
          </h3>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#523D2B] hover:bg-[#EAD8BE] transition-colors cursor-pointer"
            title="Close metrics panel"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* 1. Problem Identification / Live Confidence Meter */}
      <div className="rounded-2xl border border-[#2B2118]/10 bg-[#EAD8BE]/40 p-4.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#523D2B]">
            Model Confidence
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-black ${
              isHighConfidence
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : confidence >= 50
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-red-100 text-red-900 border border-red-300"
            }`}
          >
            {confidence}%
          </span>
        </div>

        {/* Confidence progress meter */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#2B2118]/10 my-1">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isHighConfidence
                ? "bg-emerald-600"
                : confidence >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${Math.max(5, confidence)}%` }}
          />
        </div>

        {inputAnalysis?.itemName && (
          <div className="rounded-xl bg-white/85 p-3 text-xs border border-[#2B2118]/8 shadow-xs">
            <span className="text-[10px] uppercase font-bold text-[#523D2B]/70 block mb-0.5">
              Identified Target
            </span>
            <span className="font-bold text-[#2B2118] font-serif text-sm">
              {inputAnalysis.itemName}
            </span>
          </div>
        )}

        {inputAnalysis?.problemSummary && (
          <p className="text-xs text-[#523D2B]/85 line-clamp-3 italic pt-0.5 leading-relaxed">
            "{inputAnalysis.problemSummary}"
          </p>
        )}
      </div>

      {/* 2. Quick Calculation Metrics if Stage 2 Ready */}
      {calculation && (
        <div className="space-y-3 rounded-2xl border border-[#2B2118]/10 bg-white/90 p-4.5 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-[#523D2B] block">
            Financial Impact
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-[#2B2118]/6">
              <span className="text-[#523D2B]/80">DIY Repair Average:</span>
              <span className="font-bold font-mono text-[#2B2118]">
                {formatINR(calculation.repairCost.diy.average)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-[#2B2118]/6">
              <span className="text-[#523D2B]/80">New Replacement:</span>
              <span className="font-bold font-mono text-[#9E3E26]">
                {formatINR(calculation.replacementCost.average)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 bg-emerald-50 px-2.5 rounded-xl text-emerald-900 font-semibold mt-1">
              <span>Potential Savings:</span>
              <span className="font-bold font-mono">
                +{calculation.comparison.diySavings.percentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Difficulty & Safety Badges */}
      {(difficulty || safety) && (
        <div className="grid grid-cols-2 gap-2.5">
          {difficulty && (
            <div className="rounded-xl border border-[#2B2118]/8 bg-white/75 p-3 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#523D2B]/70 block">
                Difficulty
              </span>
              <span className="mt-0.5 inline-block text-xs font-black uppercase text-[#2B2118]">
                {difficulty.level.replace("_", " ")}
              </span>
            </div>
          )}

          {safety && (
            <div className="rounded-xl border border-[#2B2118]/8 bg-white/75 p-3 text-center shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#523D2B]/70 block">
                Safety Risk
              </span>
              <span
                className={`mt-0.5 inline-block text-xs font-black uppercase ${
                  safety.level === "high"
                    ? "text-red-700"
                    : safety.level === "medium"
                      ? "text-amber-700"
                      : "text-emerald-700"
                }`}
              >
                {safety.level}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4. Action button trigger if confidence >= 85 and Stage 2 not yet done */}
      {isReadyForStage2 && onStartStage2 && (
        <button
          onClick={onStartStage2}
          disabled={isAnalyzingStage2}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#6C79C0] py-3 px-4 text-xs font-bold text-white shadow-md transition-all hover:bg-[#5360A6] active:scale-98 disabled:opacity-50"
        >
          {isAnalyzingStage2 ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Analyzing Decision...</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Calculate Repair Decision</span>
            </>
          )}
        </button>
      )}

      {/* Tip footer */}
      <div className="rounded-xl border border-dashed border-[#2B2118]/15 p-3.5 text-[11px] text-[#523D2B]/75 leading-relaxed">
        <span className="font-semibold text-[#2B2118]">💡 Workshop Tip: </span>
        Upload clear photos showing model tags and internal damage to maximize
        diagnostic precision.
      </div>
    </aside>
  )
}

export default MetricsSidebar
