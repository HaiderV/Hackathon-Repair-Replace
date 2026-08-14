import { useNavigate } from "react-router-dom"
import {
  IconArrow,
  IconMail,
  IconGithub,
  IconLinkedin,
} from "../components/Icons"
import PageLayout from "../components/PageLayout"
import Footer from "../components/Footer"

const TEAM = [
  { initials: "HV", name: "Haider Vadgamwala", color: "#6C79C0", rollno: "25bca076" },
  { initials: "NC", name: "N Chaitanya", color: "#8B7355", rollno: "25bca090" },
  { initials: "BG", name: "Bharath Gowda", color: "#C0906C", rollno: "25bca067" },
  { initials: "AV", name: "Arya Veer", color: "#87A87D", rollno: "25bca066" },
]


interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

export default function About() {
  const navigate = useNavigate()

  const contactItems: ContactItem[] = [
    {
      icon: <IconMail size={20} />,
      label: "Email",
      value: "25bca076@caias.in",
      href: "https://mail.google.com/mail/?view=cm&fs=1&to=25bca076@caias.in",
    },
    {
      icon: <IconGithub size={20} />,
      label: "GitHub",
      value: "https://github.com/HaiderV",
      href: "https://github.com/HaiderV",
    },
    {
      icon: <IconLinkedin size={20} />,
      label: "LinkedIn",
      value: "https://www.linkedin.com/in/haider-vadgamwala-220728281/",
      href: "https://www.linkedin.com/in/haider-vadgamwala-220728281/",
    },
  ];

  return (
    <PageLayout>
      <main>
        {/* Header */}
        <section
          className="wood-card"
          style={{ borderBottom: "1px solid rgba(205,187,157,0.7)" }}
        >
          <div className="max-w-4xl mx-auto px-5 py-16 md:py-20">
            <p
              style={{
                fontSize: "0.72rem",
                color: "#6C79C0",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              About
            </p>
            <h1
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#2B2118",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
              }}
            >
              AI that helps you
              <br />
              <span style={{ color: "#6C79C0" }}>fix what's broken.</span>
            </h1>
            <p
              style={{
                color: "#7A6A58",
                lineHeight: 1.75,
                fontSize: "1.05rem",
                maxWidth: 540,
              }}
            >
              RepairReplace is an AI-powered repair assistant designed to help
              people understand what's wrong with their devices and guide them
              through possible repairs — instead of heading straight for the
              bin.
            </p>
          </div>
        </section>

        {/* Why we built it */}
        <section className="max-w-4xl mx-auto px-5 py-14 md:py-18 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                color: "#6C79C0",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Motivation
            </p>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "1.9rem",
                color: "#2B2118",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Why we built it
            </h2>
            <p
              style={{
                color: "#7A6A58",
                lineHeight: 1.75,
                fontSize: "0.95rem",
                marginBottom: "1rem",
              }}
            >
              Every year, hundreds of millions of devices are replaced because
              their owners couldn't diagnose a fixable problem. A loose
              connection. A dead battery. A clogged fan.
            </p>
            <p
              style={{
                color: "#7A6A58",
                lineHeight: 1.75,
                fontSize: "0.95rem",
              }}
            >
              Repair knowledge exists — but it's scattered, jargon-heavy, and
              device-specific. We wanted to put it in one place, wrapped in an
              interface anyone can use.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                stat: "50M+",
                label: "Devices discarded annually that were repairable",
              },
              {
                stat: "68%",
                label:
                  'Of users cite "didn\'t know how" as the reason for replacing',
              },
              {
                stat: "< 3 min",
                label:
                  "Average time to get a repair diagnosis with RepairReplace",
              },
            ].map((s) => (
              <div
                key={s.stat}
                style={{
                  padding: "16px 20px",
                  border: "1px solid rgba(205,187,157,0.85)",
                  borderRadius: 4,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "Fraunces, serif",
                    fontWeight: 600,
                    fontSize: "1.6rem",
                    color: "#6C79C0",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  {s.stat}
                </div>
                <p
                  style={{
                    color: "#7A6A58",
                    fontSize: "0.85rem",
                    lineHeight: 1.55,
                  }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works flow */}
        <section
          className="wood-card"
          style={{
            borderTop: "1px solid rgba(205,187,157,0.7)",
            borderBottom: "1px solid rgba(205,187,157,0.7)",
          }}
        >
          <div className="max-w-4xl mx-auto px-5 py-14">
            <p
              style={{
                fontSize: "0.72rem",
                color: "#6C79C0",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Under the hood
            </p>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "1.9rem",
                color: "#2B2118",
                letterSpacing: "-0.02em",
                marginBottom: "2rem",
              }}
            >
              The repair pipeline
            </h2>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0">
              {[
                {
                  label: "User Input",
                  desc: "Text + photos of the broken device",
                },
                {
                  label: "AI Analysis",
                  desc: "Multimodal model identifies failure",
                },
                {
                  label: "Repair Plan",
                  desc: "Step-by-step instructions generated",
                },
                {
                  label: "Guided Fix",
                  desc: "User completes the repair safely",
                },
              ].map((step, i, arr) => (
                <div
                  key={step.label}
                  className="flex md:flex-row flex-col items-start md:items-center gap-0 flex-1"
                >
                  <div
                    style={{
                      padding: "14px 16px",
                      border: "1px solid rgba(205,187,157,0.85)",
                      borderRadius: 4,
                      background: "rgba(244,235,221,0.55)",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#6C79C0",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {step.label}
                    </p>
                    <p
                      style={{
                        fontSize: "0.82rem",
                        color: "#7A6A58",
                        lineHeight: 1.5,
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className="my-2 md:my-0 md:mx-2 self-center"
                      style={{ color: "#E6C79C", flexShrink: 0 }}
                    >
                      <IconArrow size={18} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="max-w-4xl mx-auto px-5 py-14">
          <p
            style={{
              fontSize: "0.72rem",
              color: "#6C79C0",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Team
          </p>
          <h2
            style={{
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: "1.9rem",
              color: "#2B2118",
              letterSpacing: "-0.02em",
              marginBottom: "2rem",
            }}
          >
            Built by
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {TEAM.map((member) => (
              <div
                key={member.name}
                style={{
                  padding: "24px",
                  border: "1px solid rgba(205,187,157,0.7)",
                  borderRadius: 4,
                  transition: "border-color 0.18s",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(108,121,192,0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(205,187,157,0.7)")
                }
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 4,
                    background: member.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                    fontFamily: "Fraunces, serif",
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#fff",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {member.initials}
                </div>
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "#2B2118",
                    marginBottom: 3,
                  }}
                >
                  {member.name}
                </h3>
                <p style={{ fontSize: "0.82rem", color: "#7A6A58" }}>
                  {member.rollno}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          className="wood-card"
          style={{ borderTop: "1px solid rgba(205,187,157,0.7)" }}
        >
          <div className="max-w-4xl mx-auto px-5 py-14">
            <p
              style={{
                fontSize: "0.72rem",
                color: "#6C79C0",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              Contact
            </p>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "1.9rem",
                color: "#2B2118",
                letterSpacing: "-0.02em",
                marginBottom: "2rem",
              }}
            >
              Get in touch
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {contactItems.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "18px 20px",
                    border: "1px solid rgba(205,187,157,0.85)",
                    borderRadius: 4,
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    textDecoration: "none",
                    transition: "all 0.18s",
                    background: "rgba(244,235,221,0.5)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6C79C0";
                    e.currentTarget.style.background = "rgba(108,121,192,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(205,187,157,0.85)";
                    e.currentTarget.style.background = "rgba(244,235,221,0.5)";
                  }}
                >
                  <div
                    style={{
                      color: "#6C79C0",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {c.icon}
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#7A6A58",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 3,
                      }}
                    >
                      {c.label}
                    </p>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#2B2118",
                        wordBreak: "break-all",
                      }}
                    >
                      {c.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm font-semibold text-sm cursor-pointer"
                style={{
                  background: "#6C79C0",
                  color: "#fff",
                  border: "none",
                  boxShadow: "3px 3px 0 rgba(205,187,157,0.9)",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5A69AE";
                  e.currentTarget.style.boxShadow =
                    "2px 2px 0 rgba(205,187,157,0.9)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#6C79C0";
                  e.currentTarget.style.boxShadow =
                    "3px 3px 0 rgba(205,187,157,0.9)";
                }}
              >
                Try the Repair Assistant <IconArrow size={14} />
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </PageLayout>
  )
}
