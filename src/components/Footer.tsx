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
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="flex items-center justify-center rounded-sm"
              style={{ width: 30, height: 30, background: "#6C79C0" }}
            >
              <IconWrench size={15} className="text-white -rotate-12" />
            </div>
            <span
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#F4EDE0",
              }}
            >
              Repair<span style={{ color: "#E6C79C" }}>Replace</span>
            </span>
          </div>
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
              href="mailto:25bca076@caias.in"
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
              <IconMail size={15} /> 25bca076@caias.in
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
