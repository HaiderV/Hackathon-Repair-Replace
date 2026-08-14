import { IconWrench } from "./Icons"

export default function Logo({ onClick, light }: { onClick?: () => void; light?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 group cursor-pointer"
      style={{ background: "none", border: "none", padding: 0 }}
    >
      <div
        className="flex items-center justify-center rounded-sm"
        style={{
          width: 34,
          height: 34,
          background: "#6C79C0",
          boxShadow: light ? "2px 2px 0 rgba(255,255,255,0.15)" : "2px 2px 0 rgba(205,187,157,0.9)",
        }}
      >
        <IconWrench size={18} className="text-white -rotate-12" />
      </div>
      <span
        style={{
          fontFamily: "Fraunces, Georgia, serif",
          fontWeight: 600,
          fontSize: "1.05rem",
          letterSpacing: "-0.01em",
          color: light ? "#F4EDE0" : "#2B2118",
          lineHeight: 1,
        }}
      >
        Repair<span style={{ color: light ? "#E6C79C" : "#6C79C0" }}>Replace</span>
      </span>
    </button>
  )
}
