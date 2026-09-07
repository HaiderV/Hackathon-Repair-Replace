import { Link } from "react-router-dom"
import { IconWrench, IconMail, IconGithub, IconLinkedin } from "./Icons"

export default function Footer() {
  return (
    <footer
      className="workshop-dark text-white"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto px-5 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Link
            to="/"
            className="flex items-center gap-2.5 group mb-3"
            style={{
              textDecoration: "none",
              background: "none",
              border: "none",
              padding: 0,
              display: "inline-flex",
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0 aspect-square"
              style={{
                width: 34,
                height: 34,
                background: "#6C79C0",
                boxShadow: "2px 2px 0 rgba(255,255,255,0.15)",
              }}
            >
              <IconWrench size={18} className="text-white -rotate-12" />
            </div>
            <span
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontWeight: 700,
                fontSize: "1.35rem",
                letterSpacing: "-0.01em",
                color: "#F4EDE0",
                lineHeight: 1,
              }}
            >
              Repair<span style={{ color: "#6C79C0" }}>Replace</span>
            </span>
          </Link>
          <p
            style={{
              color: "#9A8E7E",
              fontSize: "0.88rem",
              lineHeight: 1.65,
              maxWidth: 240,
            }}
          >
            AI-powered device repair guidance. Diagnose the problem. Follow the
            steps. Keep your device.
          </p>
        </div>

        <div>
          <p
            className="text-sm font-semibold mb-4"
            style={{
              color: "#E6C79C",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
            }}
          >
            Navigation
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              style={{
                color: "#9A8E7E",
                fontSize: "0.88rem",
                textAlign: "left",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F4EDE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9A8E7E")}
            >
              Home
            </Link>
            <Link
              to="/repair"
              style={{
                color: "#9A8E7E",
                fontSize: "0.88rem",
                textAlign: "left",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F4EDE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9A8E7E")}
            >
              Repair Assistant
            </Link>
            <Link
              to="/about"
              style={{
                color: "#9A8E7E",
                fontSize: "0.88rem",
                textAlign: "left",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F4EDE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9A8E7E")}
            >
              About
            </Link>
          </div>
        </div>

        <div>
          <p
            className="text-sm font-semibold mb-4"
            style={{
              color: "#E6C79C",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "0.75rem",
            }}
          >
            Contact
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:haidervadgamwal2@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5"
              style={{
                color: "#9A8E7E",
                textDecoration: "none",
                fontSize: "0.88rem",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F4EDE0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9A8E7E")}
            >
              <IconMail size={15} /> haidervadgamwal2@gmail.com
            </a>
            <div className="flex gap-3 mt-1">
              <a
                href="https://github.com/HaiderV"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#9A8E7E" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F4EDE0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9A8E7E")}
              >
                <IconGithub size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/haider-vadgamwala-220728281/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#9A8E7E" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F4EDE0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9A8E7E")}
              >
                <IconLinkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 20px",
          textAlign: "center",
          color: "#5A5048",
          fontSize: "0.8rem",
        }}
      >
        © 2026 RepairReplace — Built at a hackathon. By the team CodeCrackers
      </div>
    </footer>
  )
}
