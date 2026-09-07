import React from "react"
import { IconRotateCcw, IconX } from "../Icons"

interface ConfirmResetModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop Click */}
      <div
        className="absolute inset-0"
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-[#2B2118]/15 bg-[#FAF5EE] p-6 shadow-2xl space-y-4 text-left">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 aspect-square min-w-[2.5rem] min-h-[2.5rem] items-center justify-center rounded-2xl bg-[#E07A5F]/15 text-[#9E3E26] shadow-xs">
              <IconRotateCcw size={20} />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2118]">
                Start New Diagnosis?
              </h3>
              <p className="text-xs text-[#523D2B]/75">
                Reset current workshop session
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl p-1.5 text-[#523D2B]/70 hover:bg-[#EAD8BE] hover:text-[#2B2118] transition-colors"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Body Text */}
        <p className="text-xs leading-relaxed text-[#523D2B] bg-[#EAD8BE]/30 p-3.5 rounded-2xl border border-[#2B2118]/8">
          Starting a new session will clear the current diagnostic chat thread,
          uploaded photos, and repair-vs-replace calculations so you can inspect
          a new device.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-[#2B2118]/15 bg-white/80 px-4 py-2.5 text-xs font-semibold text-[#523D2B] transition-all hover:bg-[#EAD8BE] active:scale-98 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-xl bg-[#2B2118] px-5 py-2.5 text-xs font-bold text-[#F4EBDD] shadow-sm transition-all hover:bg-[#9E3E26] hover:text-white active:scale-98 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24">
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
                <span>Resetting...</span>
              </>
            ) : (
              <>
                <IconRotateCcw size={14} />
                <span>Yes, Start New Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmResetModal
