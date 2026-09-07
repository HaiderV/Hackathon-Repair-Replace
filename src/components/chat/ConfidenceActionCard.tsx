import React, { useRef } from "react"
import { IconCamera, IconPlus, IconSparkles, IconWrench } from "../Icons"
import type { IInputAnalysis } from "../../types/analysis"

interface ConfidenceActionCardProps {
  inputAnalysis: IInputAnalysis
  onAddImageFile?: (file: File) => void
  onAddExtraInfo?: () => void
  onStartStage2?: () => void
  isStage2Loading?: boolean
}

export default function ConfidenceActionCard({
  inputAnalysis,
  onAddImageFile,
  onAddExtraInfo,
  onStartStage2,
  isStage2Loading = false,
}: ConfidenceActionCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const requiresImage = inputAnalysis.requiresImage
  const problemSummary = inputAnalysis.problemSummary

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAddImageFile) {
      onAddImageFile(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div
      className="wood-card my-4 p-5 rounded-2xl animate-fade-in shadow-sm"
      style={{
        border: "1.5px solid #6C79C0",
        boxShadow:
          "0 0 0 3px rgba(108,121,192,0.12), 4px 6px 18px rgba(43,33,24,0.08)",
      }}
    >
      {/* Hidden File Input for Direct Photo Upload & Send */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5 min-w-0">
        <div
          className="w-6 h-6 shrink-0 aspect-square min-w-[1.5rem] min-h-[1.5rem] rounded-full flex items-center justify-center shadow-xs"
          style={{ background: "#6C79C0", color: "#fff" }}
        >
          <IconSparkles size={13} />
        </div>
        <h3
          style={{
            fontFamily: "Fraunces, Georgia, serif",
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "#2B2118",
          }}
        >
          Problem Understood
        </h3>
        <span
          className="ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={{
            background: "rgba(108,121,192,0.15)",
            color: "#5A69AE",
          }}
        >
          Confidence {Math.round(inputAnalysis.confidence)}%
        </span>
      </div>

      {/* Description / Summary */}
      <p
        style={{
          color: "#5A4030",
          fontSize: "0.88rem",
          lineHeight: 1.5,
          marginBottom: requiresImage ? "0.75rem" : "1.25rem",
        }}
      >
        {problemSummary
          ? `I have sufficient details on "${problemSummary}" to calculate repair feasibility, costs, and replacement options.`
          : "I have enough information to run a complete repair vs replace assessment."}
      </p>

      {/* Notice if Image is recommended */}
      {requiresImage && (
        <div
          className="mb-4 p-3 rounded-xl flex items-start gap-2.5 text-xs"
          style={{
            background: "rgba(230,199,156,0.35)",
            border: "1px solid rgba(205,187,157,0.9)",
            color: "#6B4C28",
          }}
        >
          <IconCamera
            size={16}
            className="text-[#6C79C0] flex-shrink-0 mt-0.5"
          />
          <span>
            <strong>Photo recommended:</strong> A photograph of the visible
            damage or model label will significantly improve assessment
            precision.
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-2.5 pt-1">
        {/* Start Repair/Replace (Primary) */}
        <button
          onClick={onStartStage2}
          disabled={isStage2Loading}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-98"
          style={{
            background: isStage2Loading ? "#8C96D0" : "#6C79C0",
            color: "#fff",
            border: "none",
            cursor: isStage2Loading ? "not-allowed" : "pointer",
            boxShadow: "2px 2px 0 rgba(205,187,157,1)",
          }}
        >
          <IconWrench size={15} />
          {isStage2Loading ? "Assessing..." : "Start Repair / Replace"}
        </button>

        {/* Add Image - Directly Opens File Browser & Sends on selection */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStage2Loading}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer active:scale-98"
          style={{
            background: requiresImage ? "rgba(108,121,192,0.12)" : "#FAF5EE",
            border: requiresImage ? "1.5px solid #6C79C0" : "1px solid #CDBB9D",
            color: requiresImage ? "#5A69AE" : "#5A4530",
          }}
        >
          <IconCamera size={15} />
          {requiresImage ? "+ Add Photo (Recommended)" : "+ Add Photo"}
        </button>

        {/* Add Extra Info - Focuses Bottom Input */}
        <button
          type="button"
          onClick={onAddExtraInfo}
          disabled={isStage2Loading}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer bg-[#FAF5EE] border border-[#CDBB9D] text-[#5A4530] hover:bg-[#EAD8BE] active:scale-98"
        >
          <IconPlus size={14} />
          + Add Extra Info
        </button>
      </div>
    </div>
  )
}
