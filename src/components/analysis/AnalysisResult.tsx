import React, { useState } from "react"
import type { Stage2ResponseData } from "../../types/analysis"
import RecommendationCard from "./RecommendationCard"
import CostTable from "./CostTable"
import SavingsCard from "./SavingsCard"
import SafetyCard from "./SafetyCard"
import ToolsMaterialsList from "./ToolsMaterialsList"
import RepairSteps from "./RepairSteps"
import ResourceSection from "../resources/ResourceSection"

interface AnalysisResultProps {
  data: Stage2ResponseData
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  const { repairReplaceAnalysis, calculation, resources } = data
  const [activeView, setActiveView] = useState<
    "overview" | "steps" | "resources"
  >("overview")

  const repairDetail = repairReplaceAnalysis?.repair
  const replacementDetail = repairReplaceAnalysis?.replacement
  const safetyDetail = repairReplaceAnalysis?.safety

  return (
    <div className="w-full min-w-0 max-w-full space-y-6 rounded-3xl border border-[#2B2118]/15 bg-white/90 p-4 sm:p-6 lg:p-7 shadow-lg backdrop-blur-sm overflow-hidden">
      {/* Top Main Recommendation */}
      <RecommendationCard
        recommendation={calculation.recommendation}
        scores={calculation.scores}
        replacementReason={replacementDetail?.reason}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#2B2118]/10 pb-2 gap-2 overflow-x-auto text-xs font-bold w-full min-w-0 max-w-full scrollbar-none">
        <button
          onClick={() => setActiveView("overview")}
          className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all cursor-pointer ${
            activeView === "overview"
              ? "bg-[#2B2118] text-[#F4EBDD] shadow-sm"
              : "bg-[#EAD8BE]/40 text-[#523D2B] hover:bg-[#EAD8BE]/70"
          }`}
        >
          <svg
            className="h-3.5 w-3.5 shrink-0 aspect-square min-w-[14px] min-h-[14px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          <span>Financial & Safety Overview</span>
        </button>

        <button
          onClick={() => setActiveView("steps")}
          className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all cursor-pointer ${
            activeView === "steps"
              ? "bg-[#2B2118] text-[#F4EBDD] shadow-sm"
              : "bg-[#EAD8BE]/40 text-[#523D2B] hover:bg-[#EAD8BE]/70"
          }`}
        >
          <svg
            className="h-3.5 w-3.5 shrink-0 aspect-square min-w-[14px] min-h-[14px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span>DIY Steps & Tools ({repairDetail?.steps?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveView("resources")}
          className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 transition-all cursor-pointer ${
            activeView === "resources"
              ? "bg-[#2B2118] text-[#F4EBDD] shadow-sm"
              : "bg-[#EAD8BE]/40 text-[#523D2B] hover:bg-[#EAD8BE]/70"
          }`}
        >
          <svg
            className="h-3.5 w-3.5 shrink-0 aspect-square min-w-[14px] min-h-[14px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          </svg>
          <span>
            Guides, Videos & Replacement (
            {(resources?.repairGuides?.length || 0) +
              (resources?.videos?.length || 0)}
            )
          </span>
        </button>
      </div>

      {/* Tab View Content */}
      {activeView === "overview" && (
        <div className="space-y-6 w-full min-w-0">
          {/* Cost Comparison */}
          <CostTable
            repairCostDetails={repairDetail?.cost}
            calculatedCost={calculation.repairCost}
            replacementCost={calculation.replacementCost}
          />

          {/* Savings Card */}
          <SavingsCard comparison={calculation.comparison} />

          {/* Safety Warnings */}
          {safetyDetail && <SafetyCard safety={safetyDetail} />}
        </div>
      )}

      {activeView === "steps" && (
        <div className="space-y-6 w-full min-w-0">
          {/* Tools and Materials Checklist */}
          {repairDetail && (
            <ToolsMaterialsList
              tools={repairDetail.tools || []}
              materials={repairDetail.materials || []}
            />
          )}

          {/* Step by step timeline */}
          {repairDetail && (
            <RepairSteps
              steps={repairDetail.steps || []}
              time={repairDetail.time}
            />
          )}
        </div>
      )}

      {activeView === "resources" && (
        <div className="space-y-6 w-full min-w-0">
          {resources && <ResourceSection resources={resources} />}
        </div>
      )}
    </div>
  )
}

export default AnalysisResult
