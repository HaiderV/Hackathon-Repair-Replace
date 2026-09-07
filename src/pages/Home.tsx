import { useNavigate } from "react-router-dom"
import {
  IconWrench,
  IconCamera,
  IconList,
  IconShield,
  IconBook,
  IconArrow,
} from "../components/Icons"
import PageLayout from "../components/PageLayout"
import Footer from "../components/Footer"

export default function Landing() {
  const navigate = useNavigate()

  const steps = [
    {
      n: "01",
      title: "Describe the problem",
      body: "Tell us what's wrong — in plain language. No technical jargon required.",
    },
    {
      n: "02",
      title: "AI diagnoses the issue",
      body: "Our model analyzes your description and photos to identify the most likely cause.",
    },
    {
      n: "03",
      title: "Follow repair steps",
      body: "Get clear, ordered instructions tailored to your specific device and problem.",
    },
  ]

  const features = [
    {
      icon: <IconCamera size={22} />,
      title: "Image-based diagnosis",
      body: "Upload photos of your device. Visual context helps pinpoint the exact failure.",
    },
    {
      icon: <IconList size={22} />,
      title: "Step-by-step guidance",
      body: "Each repair is broken into numbered, actionable steps. Nothing is left ambiguous.",
    },
    {
      icon: <IconShield size={22} />,
      title: "Safety-first warnings",
      body: "Relevant cautions are surfaced before each risky step — no surprises.",
    },
    {
      icon: <IconBook size={22} />,
      title: "Repair guides library",
      body: "Common device issues come with curated reference guides to back up the AI.",
    },
  ]

  return (
    <PageLayout>
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-28 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm mb-7 text-xs font-semibold tracking-widest uppercase"
              style={{ background: "#E6C79C", color: "#2B2118" }}
            >
              <IconWrench size={12} /> AI Repair Assistant
            </div>
            <h1
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
                lineHeight: 1.1,
                color: "#2B2118",
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
              }}
            >
              Don't replace it yet.
            </h1>
            <p
              style={{
                fontFamily: "Fraunces, serif",
                fontStyle: "italic",
                fontWeight: 300,
                fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                color: "#6C79C0",
                lineHeight: 1.3,
                marginBottom: "1.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              Diagnose it. Repair it. Keep it.
            </p>
            <p
              style={{
                color: "#7A6A58",
                lineHeight: 1.7,
                fontSize: "1.05rem",
                maxWidth: 440,
                marginBottom: "2.25rem",
              }}
            >
              Describe the problem, upload a photo, and get AI-powered repair
              guidance tailored to your device — in seconds.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/repair")}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-sm font-semibold text-sm transition-all duration-150 cursor-pointer"
                style={{
                  background: "#6C79C0",
                  color: "#fff",
                  border: "none",
                  boxShadow: "3px 3px 0 rgba(205,187,157,0.9)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5A69AE"
                  e.currentTarget.style.boxShadow =
                    "2px 2px 0 rgba(205,187,157,0.9)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#6C79C0"
                  e.currentTarget.style.boxShadow =
                    "3px 3px 0 rgba(205,187,157,0.9)"
                }}
              >
                Start Repair <IconArrow size={15} />
              </button>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-6 py-3.5 rounded-sm font-semibold text-sm transition-all duration-150"
                style={{
                  background: "transparent",
                  color: "#2B2118",
                  border: "1.5px solid rgba(90,60,20,0.25)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#6C79C0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(90,60,20,0.25)")
                }
              >
                How It Works
              </a>
            </div>
          </div>

          {/* Hero visual: product preview card */}
          <div className="hidden md:flex justify-end">
            <div className="relative" style={{ width: "100%", maxWidth: 420 }}>
              <div
                style={{
                  width: "100%",
                  borderRadius: 6,
                  border: "1.5px solid rgba(205,187,157,0.9)",
                  boxShadow: "8px 10px 32px rgba(42,31,16,0.14)",
                  overflow: "hidden",
                }}
              >
                {/* Preview header */}
                <div
                  style={{
                    background: "#241A0E",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#C0392B",
                      opacity: 0.7,
                    }}
                  />
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#E6C79C",
                      opacity: 0.7,
                    }}
                  />
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#6C79C0",
                      opacity: 0.7,
                    }}
                  />
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: "0.75rem",
                      color: "#9A8E7E",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    RepairReplace — Repair Workspace
                  </span>
                </div>
                {/* Preview body */}
                <div className="wood-card p-6">
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "#7A6550",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    Describe the issue
                  </p>
                  <div
                    style={{
                      background: "rgba(244,235,221,0.8)",
                      border: "1.5px solid #CDBB9D",
                      borderRadius: 3,
                      padding: "14px 16px",
                      marginBottom: 12,
                      minHeight: 90,
                    }}
                  >
                    <p
                      style={{
                        color: "#A09078",
                        fontSize: "0.88rem",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      "My laptop fan is making a grinding noise and the battery is
                      draining twice as fast..."
                    </p>
                  </div>
                  {/* Thumbnails */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    {[
                      { bg: "#8B7355", label: "fan" },
                      { bg: "#A08060", label: "board" },
                      { bg: "#6C79C0", label: "screen" },
                    ].map(({ bg }, i) => (
                      <div
                        key={i}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          background: bg,
                          border: "1.5px solid #CDBB9D",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.75,
                        }}
                      >
                        <IconCamera size={14} className="text-white" />
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      background: "#6C79C0",
                      color: "#fff",
                      borderRadius: 3,
                      padding: "10px 16px",
                      textAlign: "center",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "default",
                    }}
                  >
                    Diagnose & Repair →
                  </div>
                </div>
              </div>
              {/* Decorative screws */}
              {[
                { top: -10, left: -10 },
                { top: -10, right: -10 },
                { bottom: -10, left: -10 },
                { bottom: -10, right: -10 },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    ...pos,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#C9B89A",
                    border: "1.5px solid rgba(90,60,20,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 1.5,
                      background: "rgba(90,60,20,0.4)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="wood-card"
          style={{
            borderTop: "1px solid rgba(205,187,157,0.7)",
            borderBottom: "1px solid rgba(205,187,157,0.7)",
          }}
        >
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "#6C79C0",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  Process
                </p>
                <h2
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontWeight: 600,
                    fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)",
                    color: "#2B2118",
                    letterSpacing: "-0.02em",
                  }}
                >
                  How it works
                </h2>
              </div>
              <p
                style={{
                  color: "#7A6A58",
                  maxWidth: 320,
                  lineHeight: 1.65,
                  fontSize: "0.95rem",
                }}
              >
                Three steps from broken to repaired. No experience required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div
                  key={s.n}
                  className="group"
                  style={{
                    padding: "28px 24px",
                    border: "1px solid rgba(205,187,157,0.85)",
                    borderRadius: 4,
                    background: "rgba(244,235,221,0.55)",
                    transition: "border-color 0.18s, box-shadow 0.18s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = "#6C79C0"
                    el.style.boxShadow = "4px 4px 0 rgba(108,121,192,0.12)"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = "rgba(205,187,157,0.85)"
                    el.style.boxShadow = "none"
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontSize: "2.2rem",
                      fontWeight: 300,
                      color: "#E6C79C",
                      lineHeight: 1,
                      marginBottom: 14,
                    }}
                  >
                    {s.n}
                  </div>
                  <h3
                    style={{
                      fontFamily: "Fraunces, serif",
                      fontWeight: 600,
                      fontSize: "1.15rem",
                      color: "#2B2118",
                      marginBottom: 10,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.title}
                  </h3>
                  <p
                    style={{
                      color: "#7A6A58",
                      fontSize: "0.92rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <div className="mb-12">
            <p
              style={{
                fontSize: "0.72rem",
                color: "#6C79C0",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Capabilities
            </p>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "clamp(1.7rem, 3.5vw, 2.5rem)",
                color: "#2B2118",
                letterSpacing: "-0.02em",
              }}
            >
              Built for real repair
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "24px",
                  border: "1px solid rgba(205,187,157,0.7)",
                  borderRadius: 4,
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  transition: "border-color 0.18s, background 0.18s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = "#CDBB9D"
                  el.style.background = "rgba(230,199,156,0.2)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = "rgba(205,187,157,0.7)"
                  el.style.background = "transparent"
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 4,
                    background: "rgba(230,199,156,0.45)",
                    border: "1px solid rgba(205,187,157,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#2B2118",
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#2B2118",
                      marginBottom: 6,
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      color: "#7A6A58",
                      fontSize: "0.88rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Repair before replace manifesto */}
        <section
          className="workshop-dark"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-4xl mx-auto px-5 py-20 md:py-24 text-center">
            <p
              style={{
                fontSize: "0.72rem",
                color: "#E6C79C",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Our philosophy
            </p>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                color: "#F4EDE0",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: "1.25rem",
              }}
            >
              Repair before you replace.
            </h2>
            <p
              style={{
                color: "#9A8E7E",
                lineHeight: 1.75,
                fontSize: "1.05rem",
                maxWidth: 520,
                margin: "0 auto 2.5rem",
              }}
            >
              Most devices are abandoned, not because they can't be fixed, but
              because fixing them felt too hard. We're changing that — one
              repair at a time.
            </p>
            <button
              onClick={() => navigate("/repair")}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-sm font-semibold cursor-pointer"
              style={{
                background: "#E6C79C",
                color: "#2B2118",
                border: "none",
                fontSize: "0.95rem",
                transition: "all 0.18s",
                boxShadow: "3px 3px 0 rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#D4B48A"
                e.currentTarget.style.boxShadow = "2px 2px 0 rgba(0,0,0,0.3)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#E6C79C"
                e.currentTarget.style.boxShadow = "3px 3px 0 rgba(0,0,0,0.3)"
              }}
            >
              Start a Repair <IconArrow size={15} />
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </PageLayout>
  )
}
