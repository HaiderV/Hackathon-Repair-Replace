import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { IconX, IconMenu, IconWrench } from "./Icons"

export default function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const currentPath = location.pathname

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
  ]

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          borderBottom: "1px solid rgba(205,187,157,0.7)",
          backdropFilter: "blur(14px)",
          backgroundColor: "rgba(244,235,221,0.92)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 group"
            style={{
              textDecoration: "none",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl shrink-0 aspect-square"
              style={{
                width: 36,
                height: 36,
                background: "#6C79C0",
                boxShadow: "2px 2px 0 rgba(205,187,157,0.9)",
              }}
            >
              <IconWrench size={19} className="text-white -rotate-12" />
            </div>
            <span
              style={{
                fontFamily: "Fraunces, Georgia, serif",
                fontWeight: 700,
                fontSize: "1.45rem",
                letterSpacing: "-0.01em",
                color: "#2B2118",
                lineHeight: 1,
              }}
            >
              Repair<span style={{ color: "#6C79C0" }}>Replace</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium transition-colors duration-150"
                style={{
                  color: currentPath === link.path ? "#6C79C0" : "#7A6A58",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/repair"
              className="text-sm font-medium px-4 py-2 rounded-sm transition-all duration-150"
              style={{
                background: "#6C79C0",
                color: "#fff",
                textDecoration: "none",
                boxShadow: "2px 2px 0 rgba(205,187,157,1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#5A69AE")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#6C79C0")}
            >
              Start Repair
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-[#2B2118] p-1.5 rounded-sm hover:bg-[rgba(205,187,157,0.2)] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {open ? <IconX size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop (Fixed to Viewport) */}
      <div
        className={`fixed inset-0 z-50 bg-[#2B2118]/30 backdrop-blur-xs md:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer (Fixed Light Design) */}
      <aside
        className={`fixed top-0 right-0 h-full w-[280px] z-50 md:hidden flex flex-col p-6 transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"
          }`}
        style={{
          backgroundColor: "#F4EBDD",
          borderLeft: "1px solid rgba(205,187,157,0.85)",
          boxShadow: "-4px 0 24px rgba(43,33,24,0.08)",
        }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between pb-4 mb-6"
          style={{ borderBottom: "1px solid rgba(205,187,157,0.6)" }}
        >
          <button
            onClick={() => setOpen(false)}
            className="text-[#7A6A58] hover:text-[#2B2118] p-1 transition-colors"
            aria-label="Close menu"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <IconX size={22} />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className="text-base font-medium py-3 px-4 rounded-sm transition-all duration-150 text-left"
                style={{
                  color: isActive ? "#6C79C0" : "#7A6A58",
                  backgroundColor: isActive
                    ? "rgba(108,121,192,0.1)"
                    : "transparent",
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: "none",
                  borderLeft: isActive ? "3px solid #6C79C0" : "3px solid transparent",
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Action Button */}
        <div className="mt-6">
          <Link
            to="/repair"
            onClick={() => setOpen(false)}
            className="w-full text-center py-3 rounded-sm font-semibold transition-all duration-150"
            style={{
              background: "#6C79C0",
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.95rem",
              display: "block",
              boxShadow: "2px 2px 0 rgba(205,187,157,0.9)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#5A69AE")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#6C79C0")}
          >
            Start Repair
          </Link>
        </div>

        {/* Footer */}
        <div
          className="mt-auto text-xs text-[#7A6A58] text-center pt-4"
          style={{ borderTop: "1px solid rgba(205,187,157,0.5)" }}
        >
          © 2026 RepairReplace
        </div>
      </aside>
    </>
  )
}