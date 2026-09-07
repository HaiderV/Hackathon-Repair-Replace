import React from "react"
import { IconInfo, IconX, IconSparkles, IconClock, IconRotateCcw } from "../Icons"

interface ApiNoticeModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ApiNoticeModal: React.FC<ApiNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl border border-[#2B2118]/15 bg-[#FAF5EE] p-5 sm:p-7 shadow-2xl space-y-4 text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 aspect-square min-w-[2.5rem] min-h-[2.5rem] items-center justify-center rounded-2xl bg-[#6C79C0]/15 text-[#5360A6] shadow-xs">
              <IconInfo size={22} />
            </span>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2118]">
                AI Diagnostic & API Quota Notice
              </h3>
              <p className="text-xs text-[#523D2B]/75">
                Powered by Google Gemini Free-Tier Models
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#523D2B]/70 hover:bg-[#EAD8BE] hover:text-[#2B2118] transition-colors cursor-pointer"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Informative Notice Cards */}
        <div className="space-y-3 pt-1 text-xs text-[#523D2B]">
          {/* Quota Notice Highlight */}
          <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 p-3.5 sm:p-4 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs sm:text-sm">
              <IconClock size={16} className="text-amber-800 shrink-0 aspect-square" />
              <span>Free-Tier Rate Limits & Quotas</span>
            </div>
            <p className="text-amber-900/90 leading-relaxed">
              This application uses Google Gemini's <strong>Free Tier</strong> API, which operates under a per-minute rate limit (typically 15 requests/min) and daily request quotas.
            </p>
            <p className="text-amber-900/90 leading-relaxed">
              ⚡ <strong>If you see a Quota or Rate-Limit error (HTTP 429):</strong> Simply wait <strong>30–60 seconds</strong> for the rolling rate-limit window to reset, then click the <strong>Retry</strong> button.
            </p>
          </div>

          {/* How Diagnostics Work */}
          <div className="rounded-2xl border border-[#2B2118]/10 bg-white/85 p-3.5 sm:p-4 space-y-2">
            <div className="flex items-center gap-2 text-[#2B2118] font-bold text-xs sm:text-sm">
              <IconSparkles size={16} className="text-[#6C79C0] shrink-0 aspect-square" />
              <span>Two-Stage Diagnostic Workflow</span>
            </div>
            <ul className="space-y-2 pl-1">
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#6C79C0]">1.</span>
                <span>
                  <strong>Stage 1 (Understanding):</strong> Identifies the device, fault symptom, and checks confidence. If details are missing, it asks clarifying questions or requests a photo.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-[#6C79C0]">2.</span>
                <span>
                  <strong>Stage 2 (Assessment):</strong> Triggered when confidence reaches &ge;85%. Estimates repair costs, replacement prices, feasibility scores, and links real iFixit/video manuals.
                </span>
              </li>
            </ul>
          </div>

          {/* Session Restoration Info */}
          <div className="rounded-2xl border border-[#2B2118]/8 bg-[#EAD8BE]/30 p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-[#2B2118] font-bold">
              <IconRotateCcw size={15} className="text-[#523D2B] shrink-0 aspect-square" />
              <span>Session Memory & Starting Fresh</span>
            </div>
            <p className="text-[#523D2B]/85 leading-relaxed">
              Your active diagnostic session is preserved in your browser so you don't lose progress on page refresh. To diagnose a different device from scratch, click <strong>"New Session"</strong> in the top header.
            </p>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-[#2B2118] px-5 py-2.5 text-xs font-bold text-[#F4EBDD] shadow-sm transition-all hover:bg-[#6C79C0] hover:text-white active:scale-98 cursor-pointer"
          >
            <span>Got it, thanks!</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApiNoticeModal
