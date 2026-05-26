import { useState } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import CalculatorsPage from "@/pages/CalculatorsPage"
import { Toaster } from "sonner"

function App() {
  const [selected, setSelected] = useState("calculadoras")

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Ambient background glow */}
      <div style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 20% 10%, oklch(0.72 0.20 185 / 0.07) 0%, transparent 70%),
          radial-gradient(ellipse 40% 50% at 80% 80%, oklch(0.65 0.18 200 / 0.05) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar onSelect={setSelected} />
          <main style={{
            flex: 1,
            padding: "40px 48px",
            overflowY: "auto",
            color: "var(--text-high)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
            {selected === "calculadoras" && <CalculatorsPage />}
          </main>
        </div>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
