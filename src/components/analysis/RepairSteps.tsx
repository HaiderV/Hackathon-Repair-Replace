import React, { useState } from "react"
import type { RepairTime } from "../../types/analysis"

interface RepairStepsProps {
  steps: string[]
  time?: RepairTime
}

export const RepairSteps: React.FC<RepairStepsProps> = ({ steps, time }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>(
    {},
  )

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const completedCount = Object.values(completedSteps).filter(Boolean).length

  return (
    <div className="rounded-2xl border border-[#2B2118]/12 bg-[#FAF5EE] p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2B2118]/8 pb-3">
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
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </span>
          <div>
            <h4 className="font-serif text-lg font-bold text-[#2B2118]">
              Step-by-Step DIY Repair Guide
            </h4>
            <p className="text-xs text-[#523D2B]/80">
              {completedCount} of {steps.length} steps completed
            </p>
          </div>
        </div>

        {time && (
          <div className="flex items-center gap-1.5 rounded-full bg-[#EAD8BE]/50 border border-[#2B2118]/10 px-3 py-1 text-xs font-semibold text-[#523D2B]">
            <svg
              className="h-3.5 w-3.5 text-[#5360A6]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>
              Est. Time:{" "}
              <strong>
                {time.minMinutes === time.maxMinutes
                  ? `${time.minMinutes} mins`
                  : `${time.minMinutes} – ${time.maxMinutes} mins`}
              </strong>
            </span>
          </div>
        )}
      </div>

      {steps.length === 0 ? (
        <p className="text-xs text-[#523D2B]/70 italic">
          No detailed steps available. Consult the recommended guides below.
        </p>
      ) : (
        <div className="relative space-y-3 pl-2">
          {/* Timeline Connector Line */}
          <div className="absolute bottom-4 left-5 top-4 w-0.5 bg-[#2B2118]/10" />

          {steps.map((step, index) => {
            const isDone = !!completedSteps[index]
            return (
              <div
                key={`step-${index}`}
                onClick={() => toggleStep(index)}
                className={`group relative flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                  isDone
                    ? "border-emerald-300 bg-emerald-50/50 opacity-70"
                    : "border-[#2B2118]/8 bg-[#EAD8BE]/30 hover:border-[#6C79C0]/40 hover:bg-[#EAD8BE]/50"
                }`}
              >
                {/* Number Badge / Checkmark */}
                <div
                  className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-[#2B2118] text-[#F4EBDD] group-hover:bg-[#6C79C0]"
                  }`}
                >
                  {isDone ? (
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="pt-0.5">
                  <p
                    className={`text-xs leading-relaxed transition-all ${
                      isDone
                        ? "line-through text-[#523D2B]/70"
                        : "text-[#2B2118] font-medium"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RepairSteps
