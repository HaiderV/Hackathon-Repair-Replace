import { IconSparkles } from "../Icons"

interface TypingIndicatorProps {
  statusText?: string
  stage?: "stage1" | "stage2" | string
  customMessage?: string
}

export default function TypingIndicator({
  statusText,
  stage,
  customMessage,
}: TypingIndicatorProps) {
  const displayText =
    customMessage ||
    statusText ||
    (stage === "stage2"
      ? "Calculating parts, labor & replacement comparison..."
      : "Analyzing your problem...")

  return (
    <div className="flex items-start gap-3 my-4 animate-fade-in">
      {/* Avatar */}
      <div
        className="w-8 h-8 shrink-0 aspect-square min-w-[32px] min-h-[32px] rounded-xl flex items-center justify-center"
        style={{
          background: "#6C79C0",
          color: "#fff",
          boxShadow: "1px 1px 0 rgba(43,33,24,0.15)",
        }}
      >
        <IconSparkles size={16} />
      </div>

      {/* Bubble */}
      <div
        className="wood-card px-4 py-3 rounded-sm flex items-center gap-3"
        style={{
          border: "1px solid rgba(205,187,157,0.85)",
          boxShadow: "2px 3px 10px rgba(43,33,24,0.06)",
        }}
      >
        <span
          style={{
            color: "#5A4030",
            fontSize: "0.86rem",
            fontWeight: 500,
          }}
        >
          {displayText}
        </span>

        {/* Animated dots */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "#6C79C0",
              animationDelay: "0ms",
              animationDuration: "1s",
            }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "#6C79C0",
              animationDelay: "200ms",
              animationDuration: "1s",
            }}
          />
          <span
            className="w-2 h-2 rounded-full animate-bounce"
            style={{
              backgroundColor: "#6C79C0",
              animationDelay: "400ms",
              animationDuration: "1s",
            }}
          />
        </div>
      </div>
    </div>
  )
}
