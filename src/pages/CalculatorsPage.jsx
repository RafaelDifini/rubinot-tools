import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import StaminaCalculator from "@/components/StaminaCalculator"
import ImbuementsCalculator from "@/components/ImbuementsCalculator"
import RcGoldCalculator from "@/components/RcGoldCalculator"

const TABS = [
  { value: "stamina",    label: "Stamina",    icon: "⚡" },
  { value: "imbuements", label: "Imbuements", icon: "🧪" },
  { value: "rcgold",     label: "RC × Gold",  icon: "💎" },
]

export default function CalculatorsPage() {
  return (
    <div style={{ width: "100%", maxWidth: "980px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 className="font-display" style={{
          fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)",
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: "var(--text-high)",
          textTransform: "uppercase",
          lineHeight: 1.1,
          marginBottom: "6px",
        }}>
          Centro de Calculadoras
        </h1>
        <p style={{
          fontSize: "0.82rem",
          color: "var(--text-low)",
          letterSpacing: "0.04em",
        }}>
          Ferramentas para otimizar seu progresso em Tibia
        </p>
      </div>

      <Tabs defaultValue="stamina">
        {/* Tab bar */}
        <TabsList style={{
          display: "inline-flex",
          gap: "4px",
          background: "oklch(0.14 0.022 220 / 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--border-sub)",
          borderRadius: "10px",
          padding: "4px",
          marginBottom: "20px",
        }}>
          {TABS.map(({ value, label, icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 20px",
                borderRadius: "7px",
                fontSize: "0.82rem",
                fontWeight: 500,
                letterSpacing: "0.03em",
                border: "1px solid transparent",
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
                color: "var(--text-low)",
                background: "transparent",
                outline: "none",
              }}
              className="
                data-[state=active]:!bg-[oklch(0.72_0.20_185_/_0.16)]
                data-[state=active]:!border-[oklch(0.72_0.20_185_/_0.42)]
                data-[state=active]:!text-[oklch(0.92_0.12_185)]
                data-[state=active]:!shadow-[0_0_18px_oklch(0.72_0.20_185_/_0.22)]
                hover:!text-[oklch(0.82_0.08_200)]
                hover:!bg-[oklch(0.72_0.20_185_/_0.07)]
              "
            >
              <span>{icon}</span>
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab panels */}
        {[
          { value: "stamina",    Component: StaminaCalculator },
          { value: "imbuements", Component: ImbuementsCalculator },
          { value: "rcgold",     Component: RcGoldCalculator },
        ].map(({ value, Component }) => (
          <TabsContent key={value} value={value}>
            <div style={{
              background: "oklch(0.24 0.026 208 / 0.48)",
              backdropFilter: "blur(36px) saturate(2.4)",
              WebkitBackdropFilter: "blur(36px) saturate(2.4)",
              border: "1px solid oklch(1 0 0 / 0.18)",
              borderRadius: "16px",
              padding: "36px",
              boxShadow: "0 12px 48px oklch(0 0 0 / 0.35), 0 1px 0 oklch(1 0 0 / 0.14) inset, 0 0 80px oklch(0.72 0.20 185 / 0.04)",
            }}>
              <Component />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
