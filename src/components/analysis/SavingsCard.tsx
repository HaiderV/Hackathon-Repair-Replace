import React from "react"
import type { Comparison } from "../../types/analysis"
import { formatINR } from "./CostTable"

interface SavingsCardProps {
  comparison: Comparison
}

export const SavingsCard: React.FC<SavingsCardProps> = ({ comparison }) => {
  const diySavings = comparison.diySavings
  const profSavings = comparison.professionalSavings

  return (
    <div className="rounded-2xl border border-[#2B2118]/12 bg-gradient-to-br from-[#FAF5EE] to-[#EAD8BE]/50 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 aspect-square min-w-[1.75rem] min-h-[1.75rem] items-center justify-center rounded-lg bg-emerald-700/15 text-emerald-800">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </span>
          <h4 className="font-serif text-lg font-bold text-[#2B2118]">
            Estimated Savings Potential
          </h4>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
          Save up to {diySavings.percentage}%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* DIY Savings */}
        <div className="rounded-xl border border-emerald-600/20 bg-emerald-500/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              DIY Repair Savings
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-white/70 px-2 py-0.5 rounded">
              +{diySavings.percentage}% Saved
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-950 font-serif">
            {formatINR(diySavings.amount)}
          </div>
          <p className="text-xs text-emerald-900/80 mt-1">
            Costs only {comparison.diyRepairCostPercentage}% of buying new.
          </p>
          {/* Progress fill */}
          <div className="mt-3 w-full bg-emerald-950/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, diySavings.percentage))}%`,
              }}
            />
          </div>
        </div>

        {/* Pro Savings */}
        <div className="rounded-xl border border-[#2B2118]/10 bg-[#FAF5EE] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#523D2B]">
              Pro Repair Savings
            </span>
            <span className="text-xs font-bold text-[#523D2B] bg-[#EAD8BE]/60 px-2 py-0.5 rounded">
              +{profSavings.percentage}% Saved
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-[#2B2118] font-serif">
            {formatINR(profSavings.amount)}
          </div>
          <p className="text-xs text-[#523D2B]/80 mt-1">
            Costs {comparison.professionalRepairCostPercentage}% of buying new.
          </p>
          {/* Progress fill */}
          <div className="mt-3 w-full bg-[#2B2118]/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#6C79C0] h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, profSavings.percentage))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavingsCard
