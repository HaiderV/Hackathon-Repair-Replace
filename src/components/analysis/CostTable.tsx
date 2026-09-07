import React from "react"
import type {
  CalculationRepairCost,
  CostRange,
  RepairCost,
} from "../../types/analysis"

interface CostTableProps {
  repairCostDetails?: RepairCost
  calculatedCost: CalculationRepairCost
  replacementCost: CostRange
}

export const formatINR = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatRange = (range?: CostRange): string => {
  if (!range) return "₹0"
  if (range.min === range.max) return formatINR(range.min)
  return `${formatINR(range.min)} – ${formatINR(range.max)}`
}

export const CostTable: React.FC<CostTableProps> = ({
  repairCostDetails,
  calculatedCost,
  replacementCost,
}) => {
  return (
    <div className="rounded-2xl border border-[#2B2118]/12 bg-[#FAF5EE] p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2B2118]/8 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 aspect-square min-w-[1.75rem] min-h-[1.75rem] items-center justify-center rounded-lg bg-[#6C79C0]/15 text-[#5360A6]">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </span>
          <h4 className="font-serif text-lg font-bold text-[#2B2118]">
            Cost Comparison Breakdown
          </h4>
        </div>
        <span className="text-xs font-medium text-[#523D2B]/70 bg-[#EAD8BE]/50 px-2.5 py-1 rounded-full border border-[#2B2118]/10">
          All prices in INR (₹)
        </span>
      </div>

      {/* 3-Column Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* DIY Repair */}
        <div className="flex flex-col justify-between rounded-xl border border-[#2B2118]/10 bg-[#EAD8BE]/40 p-4 transition-all hover:border-[#6C79C0]/30 hover:bg-[#EAD8BE]/60">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5360A6]">
                DIY Repair
              </span>
              <span className="inline-flex rounded-md bg-[#6C79C0]/15 px-2 py-0.5 text-[10px] font-bold text-[#5360A6]">
                Lowest Cost
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#2B2118] font-serif mt-1">
              {formatRange(calculatedCost.diy)}
            </div>
            <p className="text-[11px] text-[#523D2B]/80 mt-1">
              Avg:{" "}
              <strong className="text-[#2B2118] font-semibold">
                {formatINR(calculatedCost.diy?.average)}
              </strong>
            </p>
          </div>

          {repairCostDetails && (
            <div className="mt-3.5 pt-2.5 border-t border-[#2B2118]/8 space-y-1 text-xs text-[#523D2B]/85">
              <div className="flex justify-between text-[11px]">
                <span>Materials:</span>
                <span className="font-semibold text-[#2B2118]">
                  {formatRange(repairCostDetails.materials)}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Tools needed:</span>
                <span className="font-semibold text-[#2B2118]">
                  {formatRange(repairCostDetails.tools)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Professional Repair */}
        <div className="flex flex-col justify-between rounded-xl border border-[#2B2118]/10 bg-[#EAD8BE]/40 p-4 transition-all hover:border-[#2B2118]/25 hover:bg-[#EAD8BE]/60">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#523D2B]">
                Professional Repair
              </span>
              <span className="inline-flex rounded-md bg-[#523D2B]/10 px-2 py-0.5 text-[10px] font-bold text-[#523D2B]">
                Labor Included
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#2B2118] font-serif mt-1">
              {formatRange(calculatedCost.professional)}
            </div>
            <p className="text-[11px] text-[#523D2B]/80 mt-1">
              Avg:{" "}
              <strong className="text-[#2B2118] font-semibold">
                {formatINR(calculatedCost.professional?.average)}
              </strong>
            </p>
          </div>

          {repairCostDetails && (
            <div className="mt-3.5 pt-2.5 border-t border-[#2B2118]/8 space-y-1 text-xs text-[#523D2B]/85">
              <div className="flex justify-between text-[11px]">
                <span>Materials & Parts:</span>
                <span className="font-semibold text-[#2B2118]">
                  {formatRange(repairCostDetails.materials)}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>Labor Charges:</span>
                <span className="font-semibold text-[#2B2118]">
                  {formatRange(repairCostDetails.professionalLabor)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* New Replacement */}
        <div className="flex flex-col justify-between rounded-xl border border-[#2B2118]/10 bg-[#EAD8BE]/40 p-4 transition-all hover:border-[#E07A5F]/40 hover:bg-[#EAD8BE]/60">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9E3E26]">
                New Replacement
              </span>
              <span className="inline-flex rounded-md bg-[#E07A5F]/20 px-2 py-0.5 text-[10px] font-bold text-[#9E3E26]">
                Brand New Unit
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#2B2118] font-serif mt-1">
              {formatRange(replacementCost)}
            </div>
            <p className="text-[11px] text-[#523D2B]/80 mt-1">
              Avg:{" "}
              <strong className="text-[#2B2118] font-semibold">
                {formatINR(replacementCost?.average)}
              </strong>
            </p>
          </div>

          <div className="mt-3.5 pt-2.5 border-t border-[#2B2118]/8 space-y-1 text-xs text-[#523D2B]/85">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#523D2B]/75">Cost Benchmark:</span>
              <span className="font-bold text-[#9E3E26]">100% Baseline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostTable
