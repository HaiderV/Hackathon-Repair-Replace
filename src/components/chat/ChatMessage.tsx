import React from "react"
import { IconCamera, IconWrench } from "../Icons"
import type { ChatMessage as ChatMessageType } from "../../types/analysis"
import AnalysisResult from "../analysis/AnalysisResult"
import ConfidenceActionCard from "./ConfidenceActionCard"

interface ChatMessageProps {
  message: ChatMessageType
  onAddImageFile?: (file: File) => void
  onAddExtraInfo?: () => void
  onStartStage2?: () => void
  isStage2Loading?: boolean
}

export default function ChatMessage({
  message,
  onAddImageFile,
  onAddExtraInfo,
  onStartStage2,
  isStage2Loading = false,
}: ChatMessageProps) {
  const isUser = message.sender === "user"

  // User Message
  if (isUser) {
    return (
      <div className="flex justify-end my-3 animate-fade-in">
        <div
          className="max-w-[90%] sm:max-w-[80%] md:max-w-[75%] rounded-2xl p-3.5 sm:p-4 shadow-sm break-words"
          style={{
            background: "#6C79C0",
            color: "#FFFFFF",
            boxShadow: "2px 2px 0 rgba(205,187,157,0.9)",
          }}
        >
          {/* Uploaded image if present */}
          {message.imagePreviewUrl && (
            <div className="mb-2.5 rounded-xl overflow-hidden border border-white/20 shadow-inner">
              <img
                src={message.imagePreviewUrl}
                alt="User uploaded attachment"
                className="max-h-60 w-auto max-w-full object-cover rounded-xl"
              />
            </div>
          )}

          {/* User text */}
          {message.text && (
            <p className="text-sm sm:text-[0.93rem] leading-relaxed whitespace-pre-wrap font-sans break-words">
              {message.text}
            </p>
          )}
        </div>
      </div>
    )
  }

  // If this message contains Stage 2 Analysis results
  if (message.stage2Result) {
    return (
      <div className="my-6 animate-fade-in w-full min-w-0 max-w-full overflow-hidden">
        <AnalysisResult data={message.stage2Result} />
      </div>
    )
  }

  // If this message is an Interactive Confidence Action Card
  if (message.isActionCard && message.inputAnalysis) {
    return (
      <ConfidenceActionCard
        inputAnalysis={message.inputAnalysis}
        onAddImageFile={onAddImageFile}
        onAddExtraInfo={onAddExtraInfo}
        onStartStage2={onStartStage2 || (() => {})}
        isStage2Loading={isStage2Loading}
      />
    )
  }

  // Regular Assistant message
  return (
    <div className="flex items-start gap-2.5 sm:gap-3 my-4 animate-fade-in min-w-0">
      {/* Avatar */}
      <div
        className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 aspect-square min-w-[1.75rem] min-h-[1.75rem] rounded-xl flex items-center justify-center mt-1 shadow-sm"
        style={{
          background: "#2B2118",
          color: "#E6C79C",
          boxShadow: "1px 1px 0 rgba(205,187,157,0.8)",
        }}
      >
        <IconWrench size={15} />
      </div>

      {/* Bubble */}
      <div
        className="wood-card flex-1 min-w-0 max-w-[92%] sm:max-w-[88%] rounded-2xl p-3.5 sm:p-5 break-words"
        style={{
          border: "1px solid rgba(205,187,157,0.85)",
          boxShadow: "2px 3px 12px rgba(43,33,24,0.06)",
        }}
      >
        {/* Main message text */}
        {message.text && (
          <p
            className="text-sm sm:text-[0.93rem] leading-relaxed whitespace-pre-wrap font-sans break-words"
            style={{ color: "#2B2118" }}
          >
            {message.text}
          </p>
        )}

        {/* Visual inspection observations if image was analyzed */}
        {message.imageAnalysis && (
          <div
            className="mt-3 p-3 rounded-xl text-xs space-y-1.5"
            style={{
              background: "rgba(230,199,156,0.3)",
              border: "1px solid rgba(205,187,157,0.6)",
              color: "#5A4030",
            }}
          >
            <div className="flex items-center gap-1.5 font-semibold text-[#6C79C0] mb-1">
              <IconCamera size={14} />
              <span>Visual Inspection Findings:</span>
            </div>
            {message.imageAnalysis.observations?.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {message.imageAnalysis.observations.map((obs, i) => (
                  <li key={i}>{obs}</li>
                ))}
              </ul>
            ) : (
              <p>
                {message.imageAnalysis.damageDescription ||
                  "Component and condition verified."}
              </p>
            )}
            {message.imageAnalysis.safetyConcern &&
              message.imageAnalysis.safetyWarning && (
                <p className="mt-2 font-semibold text-[#A03020] bg-red-50 p-2 rounded-lg border border-red-200">
                  ⚠ Safety Advisory: {message.imageAnalysis.safetyWarning}
                </p>
              )}
          </div>
        )}

        {/* Follow-up questions from Stage 1 */}
        {message.inputAnalysis &&
          message.inputAnalysis.questions?.length > 0 &&
          !message.inputAnalysis.understood && (
            <div className="mt-3.5 pt-3 border-t border-[rgba(205,187,157,0.6)]">
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ color: "#7A6A58" }}
              >
                Helpful details to clarify:
              </p>
              <ul className="space-y-1.5">
                {message.inputAnalysis.questions.map((q, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs sm:text-sm font-medium"
                    style={{ color: "#5A4030" }}
                  >
                    <span className="text-[#6C79C0] font-bold mt-0.5">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  )
}
