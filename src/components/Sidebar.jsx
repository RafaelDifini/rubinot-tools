import { useState } from "react"
import { Calculator, Menu } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

export default function Sidebar({ onSelect }) {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState("calculadoras")

  const handleSelect = (key) => {
    setActive(key)
    onSelect(key)
  }

  return (
    <aside
      style={{
        width: open ? "13rem" : "3.5rem",
        background: "oklch(0.11 0.015 230 / 0.70)",
        backdropFilter: "blur(28px) saturate(2.0)",
        WebkitBackdropFilter: "blur(28px) saturate(2.0)",
        borderRight: "1px solid oklch(1 0 0 / 0.08)",
        flexShrink: 0,
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px",
        gap: "8px",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          alignSelf: "flex-start",
          background: "transparent",
          border: "1px solid var(--border-mid)",
          color: "var(--text-mid)",
          borderRadius: "6px",
          padding: "7px",
          cursor: "pointer",
          lineHeight: 0,
          marginBottom: "8px",
          transition: "color 0.2s, border-color 0.2s, background 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "var(--accent)"
          e.currentTarget.style.borderColor = "var(--border-hi)"
          e.currentTarget.style.background = "oklch(0.72 0.20 185 / 0.08)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "var(--text-mid)"
          e.currentTarget.style.borderColor = "var(--border-mid)"
          e.currentTarget.style.background = "transparent"
        }}
      >
        <Menu size={18} />
      </button>

      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={() => handleSelect("calculadoras")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              justifyContent: open ? "flex-start" : "center",
              padding: "9px 10px",
              borderRadius: "7px",
              cursor: "pointer",
              background: active === "calculadoras"
                ? "oklch(0.72 0.20 185 / 0.14)"
                : "transparent",
              border: active === "calculadoras"
                ? "1px solid var(--border-hi)"
                : "1px solid transparent",
              color: active === "calculadoras" ? "var(--accent)" : "var(--text-mid)",
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              boxShadow: active === "calculadoras"
                ? "0 0 16px oklch(0.72 0.20 185 / 0.12)"
                : "none",
            }}
            onMouseEnter={e => {
              if (active !== "calculadoras") {
                e.currentTarget.style.background = "oklch(0.72 0.20 185 / 0.07)"
                e.currentTarget.style.color = "var(--text-high)"
              }
            }}
            onMouseLeave={e => {
              if (active !== "calculadoras") {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "var(--text-mid)"
              }
            }}
          >
            <Calculator size={18} style={{ flexShrink: 0 }} />
            {open && (
              <span style={{
                fontSize: "0.83rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
              }}>
                Calculadoras
              </span>
            )}
          </div>
        </TooltipTrigger>
        {!open && (
          <TooltipContent side="right" style={{
            background: "var(--bg-float)",
            border: "1px solid var(--border-mid)",
            color: "var(--text-high)",
            fontSize: "0.8rem",
          }}>
            Calculadoras
          </TooltipContent>
        )}
      </Tooltip>
    </aside>
  )
}
