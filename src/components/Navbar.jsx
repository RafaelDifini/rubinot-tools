export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full px-8 py-4 flex items-center justify-between" style={{
      background: "oklch(0.10 0.015 230 / 0.75)",
      backdropFilter: "blur(28px) saturate(2)",
      WebkitBackdropFilter: "blur(28px) saturate(2)",
      borderBottom: "1px solid oklch(1 0 0 / 0.08)",
      boxShadow: "0 1px 0 oklch(1 0 0 / 0.04) inset, 0 4px 24px oklch(0 0 0 / 0.30)",
    }}>
      <span className="font-display" style={{
        fontSize: "0.9rem",
        fontWeight: 700,
        letterSpacing: "0.22em",
        color: "var(--accent)",
        textTransform: "uppercase",
      }}>
        Rubinot Tools
      </span>
      <div style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: "var(--accent)",
        boxShadow: "0 0 8px var(--accent), 0 0 16px var(--accent-glow)",
        animation: "pulseGlow 2.5s ease-in-out infinite",
      }} />
    </nav>
  )
}
