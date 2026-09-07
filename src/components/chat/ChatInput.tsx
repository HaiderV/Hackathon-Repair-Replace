import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  type KeyboardEvent,
} from "react"
import { IconCamera, IconSend, IconX } from "../Icons"

export interface ChatInputHandle {
  focusInput: () => void
  triggerUpload: () => void
}

interface ChatInputProps {
  onSend: (payload: {
    description?: string
    image?: File
    imagePreviewUrl?: string
  }) => void
  disabled?: boolean
  placeholder?: string
}

export const ChatInput = forwardRef<ChatInputHandle, ChatInputProps>(
  (
    {
      onSend,
      disabled = false,
      placeholder = "Describe what's wrong with your item...",
    },
    ref,
  ) => {
    const [text, setText] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Expose focus and upload trigger via ref
    useImperativeHandle(ref, () => ({
      focusInput: () => {
        textareaRef.current?.focus()
        textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      },
      triggerUpload: () => {
        fileInputRef.current?.click()
      },
    }))

    // Handle image selection
    const handleFileSelect = (file: File | null) => {
      if (!file) return
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }

    const handleRemoveImage = () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
      setImageFile(null)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }

    // Auto-resize textarea
    const adjustHeight = () => {
      const el = textareaRef.current
      if (el) {
        el.style.height = "auto"
        const newHeight = Math.min(el.scrollHeight, 180)
        el.style.height = `${newHeight}px`
      }
    }

    useEffect(() => {
      adjustHeight()
    }, [text])

    // Submit message
    const handleSend = useCallback(() => {
      if (disabled) return
      const trimmed = text.trim()
      if (!trimmed && !imageFile) return

      onSend({
        description: trimmed || undefined,
        image: imageFile || undefined,
        imagePreviewUrl: imagePreview || undefined,
      })

      // Reset composer
      setText("")
      handleRemoveImage()
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }, [text, imageFile, imagePreview, disabled, onSend])

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }

    const canSend = (text.trim().length > 0 || imageFile !== null) && !disabled

    return (
      <div
        className="wood-card rounded-2xl shadow-sm transition-all duration-200"
        style={{
          border: "1.5px solid rgba(205,187,157,0.9)",
          boxShadow: "2px 4px 16px rgba(42,31,16,0.06)",
        }}
      >
        {/* Image Preview Area */}
        {imagePreview && (
          <div className="px-4 pt-3 pb-2 flex items-center gap-3 border-b border-[rgba(205,187,157,0.5)]">
            <div className="relative group w-14 h-14 rounded-xl overflow-hidden border border-[#CDBB9D] flex-shrink-0 bg-black/5 shadow-xs">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                type="button"
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-black transition-colors"
                title="Remove image"
              >
                <IconX size={11} />
              </button>
            </div>
            <div className="text-xs text-[#7A6A58] truncate">
              <p className="font-semibold text-[#2B2118] truncate">
                {imageFile?.name}
              </p>
              <p className="text-[11px]">
                {((imageFile?.size || 0) / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        )}

        {/* Input row */}
        <div className="flex items-end gap-1.5 sm:gap-2 p-1.5 sm:p-2.5">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            style={{ display: "none" }}
          />

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl text-[#7A6A58] hover:text-[#2B2118] hover:bg-[#EAD8BE] transition-colors shrink-0 aspect-square flex items-center justify-center cursor-pointer disabled:opacity-50"
            title="Upload photo of item or damage"
          >
            <IconCamera size={18} />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 min-w-0 bg-transparent border-none resize-none text-sm sm:text-base text-[#2B2118] placeholder-[#9A8E7E] placeholder:text-xs sm:placeholder:text-sm focus:outline-none py-2 px-1 max-h-44 leading-relaxed font-sans"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl font-semibold transition-all duration-150 shrink-0 aspect-square flex items-center justify-center shadow-xs active:scale-95"
            style={{
              background: canSend ? "#6C79C0" : "rgba(205,187,157,0.45)",
              color: canSend ? "#FFFFFF" : "#A89888",
              cursor: canSend ? "pointer" : "not-allowed",
              boxShadow: canSend ? "1px 1px 0 rgba(205,187,157,1)" : "none",
            }}
            title="Send message (Enter)"
          >
            <IconSend size={16} />
          </button>
        </div>
      </div>
    )
  },
)

ChatInput.displayName = "ChatInput"

export default ChatInput
