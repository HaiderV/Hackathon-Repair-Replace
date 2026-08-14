import { useState, useRef, useCallback } from "react"
import { IconWrench, IconCamera, IconUpload, IconX } from "../components/Icons"
import PageLayout from "../components/PageLayout"

interface UploadedImage {
  id: string
  url: string
  name: string
}

const EXAMPLE_PROMPTS = [
  "Laptop suddenly shuts down under load",
  "Phone screen is not responding to touch",
  "Fan is making a grinding noise",
  "Battery drains to 0% in under 2 hours",
]

export default function Home() {
  const [focused, setFocused] = useState(false)
  const [text, setText] = useState("")
  const [images, setImages] = useState<UploadedImage[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLTextAreaElement>(null)

  const handleFocus = () => setFocused(true)

  const handleExampleClick = (example: string) => {
    setText(example)
    setFocused(true)
    setTimeout(() => textRef.current?.focus(), 10)
  }

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files) return
      const newImgs: UploadedImage[] = []
      Array.from(files)
        .slice(0, 5 - images.length)
        .forEach((file) => {
          newImgs.push({
            id: Math.random().toString(36).slice(2),
            url: URL.createObjectURL(file),
            name: file.name,
          })
        })
      setImages((prev) => [...prev, ...newImgs].slice(0, 5))
      setFocused(true)
    },
    [images],
  )

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const isActive = focused || text.length > 0 || images.length > 0

  return (
    <PageLayout>
      <main className="min-h-[calc(100vh-56px)] flex flex-col">
        {/* Page header */}
        <div
          className="wood-card"
          style={{
            borderBottom: "1px solid rgba(205,187,157,0.7)",
            padding: "16px 20px",
          }}
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <h1
                style={{
                  fontFamily: "Fraunces, serif",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  color: "#2B2118",
                  letterSpacing: "-0.01em",
                }}
              >
                Repair Workspace
              </h1>
              <p
                style={{ color: "#7A6A58", fontSize: "0.83rem", marginTop: 2 }}
              >
                Describe the problem — text, photos, or both.
              </p>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex items-start justify-center px-4 py-10 md:py-16">
          <div
            style={{
              width: "100%",
              maxWidth: 680,
            }}
          >
            {/* Example prompts (shown when not focused) */}
            {!isActive && (
              <div className="mb-8 text-center">
                <p
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
                    color: "#2B2118",
                    letterSpacing: "-0.02em",
                    marginBottom: "0.75rem",
                    lineHeight: 1.2,
                  }}
                >
                  What's wrong with your device?
                </p>
                <p
                  style={{
                    color: "#7A6A58",
                    fontSize: "0.95rem",
                    marginBottom: "2rem",
                  }}
                >
                  Describe the problem or upload photos — we'll figure out the
                  rest.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLE_PROMPTS.map((e) => (
                    <button
                      key={e}
                      onClick={() => handleExampleClick(e)}
                      style={{
                        background: "rgba(230,199,156,0.35)",
                        border: "1px solid rgba(205,187,157,0.9)",
                        borderRadius: 3,
                        padding: "7px 14px",
                        color: "#5A4030",
                        fontSize: "0.83rem",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(230,199,156,0.6)"
                        e.currentTarget.style.borderColor =
                          "rgba(90,60,20,0.35)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(230,199,156,0.35)"
                        e.currentTarget.style.borderColor =
                          "rgba(205,187,157,0.9)"
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main input card */}
            <div
              className="wood-card"
              style={{
                border: isActive
                  ? "1.5px solid #6C79C0"
                  : "1.5px solid rgba(205,187,157,0.9)",
                borderRadius: 5,
                boxShadow: isActive
                  ? "0 0 0 3px rgba(108,121,192,0.12), 6px 8px 24px rgba(42,31,16,0.1)"
                  : "4px 6px 18px rgba(42,31,16,0.08)",
                transition: "border-color 0.2s, box-shadow 0.2s",
                overflow: "hidden",
              }}
            >
              {/* Workbench label */}
              <div
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid rgba(205,187,157,0.55)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(43,33,24,0.07)",
                }}
              >
                <IconWrench size={14} className="text-[#7A6A58]" />
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#7A6A58",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Repair Request
                </span>
                {isActive && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "0.72rem",
                      color: "#6C79C0",
                      fontWeight: 600,
                    }}
                  >
                    Active
                  </span>
                )}
              </div>

              {/* Textarea */}
              <div style={{ position: "relative" }}>
                <textarea
                  ref={textRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={handleFocus}
                  placeholder={
                    isActive ? "" : "Describe the issue with your device..."
                  }
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "18px 20px",
                    background: "transparent",
                    border: "none",
                    resize: "none",
                    fontSize: "1rem",
                    color: "#2B2118",
                    lineHeight: 1.7,
                    fontFamily: "DM Sans, sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              {/* Image thumbnails */}
              {images.length > 0 && (
                <div
                  style={{
                    padding: "4px 16px 12px",
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {images.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        position: "relative",
                        width: 72,
                        height: 72,
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1.5px solid rgba(205,187,157,0.9)",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() => removeImage(img.id)}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "rgba(42,31,16,0.7)",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#fff",
                        }}
                      >
                        <IconX size={10} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 3,
                        border: "1.5px dashed rgba(90,60,20,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#7A6A58",
                        gap: 2,
                        flexShrink: 0,
                        position: "relative",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e.target.files)}
                        style={{ display: "none" }}
                      />
                      <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>
                        +
                      </span>
                      <span
                        style={{ fontSize: "0.65rem", textAlign: "center" }}
                      >
                        Add photo
                      </span>
                    </label>
                  )}
                </div>
              )}

              {/* Bottom toolbar */}
              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid rgba(205,187,157,0.55)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    color: "#5A4530",
                    fontSize: "0.83rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    position: "relative",
                    padding: "7px 12px",
                    borderRadius: 3,
                    border: "1px solid #CDBB9D",
                    background: "#F4EBDD",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#B8A280"
                    e.currentTarget.style.background = "#EAD8BE"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#CDBB9D"
                    e.currentTarget.style.background = "#F4EBDD"
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files)}
                    style={{ display: "none" }}
                  />
                  <IconCamera size={15} />
                  Upload photos
                  {images.length > 0 && (
                    <span
                      style={{
                        marginLeft: 2,
                        background: "#6C79C0",
                        color: "#fff",
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                      }}
                    >
                      {images.length}
                    </span>
                  )}
                </label>

                <button
                  disabled={!text.trim() && images.length === 0}
                  onClick={() => setFocused(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 20px",
                    borderRadius: 3,
                    border: "none",
                    background:
                      text.trim() || images.length > 0
                        ? "#6C79C0"
                        : "rgba(205,187,157,0.55)",
                    color:
                      text.trim() || images.length > 0 ? "#fff" : "#B0A090",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    cursor:
                      text.trim() || images.length > 0
                        ? "pointer"
                        : "not-allowed",
                    transition: "all 0.18s",
                    boxShadow:
                      text.trim() || images.length > 0
                        ? "2px 2px 0 rgba(205,187,157,1)"
                        : "none",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (text.trim() || images.length > 0) {
                      e.currentTarget.style.background = "#5A69AE"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (text.trim() || images.length > 0) {
                      e.currentTarget.style.background = "#6C79C0"
                    }
                  }}
                >
                  <IconUpload size={15} />
                  Diagnose &amp; Repair
                </button>
              </div>
            </div>

            {/* Context hint */}
            <p
              style={{
                textAlign: "center",
                color: "#7A6A58",
                fontSize: "0.78rem",
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              Supports text descriptions, multiple photos, and device context.
              {images.length === 0 && " "}
              {images.length === 0 && (
                <span>Upload photos for more accurate diagnosis.</span>
              )}
            </p>

            {/* Device context chips */}
            {!isActive && (
              <div className="mt-10">
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#9A8E7E",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  Common issues
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { device: "Laptop", issue: "Won't turn on" },
                    { device: "Smartphone", issue: "Cracked screen" },
                    { device: "Tablet", issue: "Battery swollen" },
                    { device: "Headphones", issue: "Audio in one ear only" },
                  ].map((c) => (
                    <button
                      key={c.device + c.issue}
                      onClick={() =>
                        handleExampleClick(`${c.device}: ${c.issue}`)
                      }
                      style={{
                        padding: "12px 14px",
                        border: "1px solid rgba(205,187,157,0.85)",
                        borderRadius: 4,
                        background: "rgba(244,235,221,0.55)",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#CDBB9D"
                        e.currentTarget.style.background =
                          "rgba(230,199,156,0.25)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(205,187,157,0.85)"
                        e.currentTarget.style.background =
                          "rgba(244,235,221,0.55)"
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#6C79C0",
                          marginBottom: 3,
                        }}
                      >
                        {c.device}
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "#2B2118" }}>
                        {c.issue}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
