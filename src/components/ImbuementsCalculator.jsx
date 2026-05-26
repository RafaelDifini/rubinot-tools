import { useState } from "react"
import VoidGif from "@/assets/Powerful_Void.gif"
import StrikeGif from "@/assets/Powerful_Strike.gif"
import VampGif from "@/assets/Powerful_Vampirism.gif"

const IMAGES = { void: VoidGif, strike: StrikeGif, vamp: VampGif }

const IMBUEMENTS = [
  {
    name: "Powerful Void",
    key: "void",
    items: [
      { name: "Rope Belt", qty: 25 },
      { name: "Silencer Claws", qty: 25 },
      { name: "Grimeleech Wings", qty: 5 },
    ],
    tokens: 6,
  },
  {
    name: "Powerful Strike",
    key: "strike",
    items: [
      { name: "Protective Charm", qty: 20 },
      { name: "Sabretooth", qty: 25 },
      { name: "Vexclaw Talon", qty: 5 },
    ],
    tokens: 6,
  },
  {
    name: "Powerful Vampirism",
    key: "vamp",
    items: [
      { name: "Vampire Teeth", qty: 25 },
      { name: "Bloody Pincers", qty: 15 },
      { name: "Piece of Dead Brain", qty: 5 },
    ],
    tokens: 6,
  },
]

const fmt = (n) => Number(n).toLocaleString("pt-BR")

export default function ImbuementsCalculator() {
  const [tokenPrice, setTokenPrice] = useState(40000)
  const [itemPrices, setItemPrices] = useState({})

  const setPrice = (imbueKey, itemName, value) =>
    setItemPrices(p => ({ ...p, [imbueKey]: { ...p[imbueKey], [itemName]: Number(value) || 0 } }))

  const calculate = (imbue) => {
    const ip = (it) => itemPrices[imbue.key]?.[it.name] || 0
    const itemsCost  = imbue.items.reduce((s, it) => s + ip(it) * it.qty, 0)
    const tokenCost  = imbue.tokens * tokenPrice
    const two  = 2 * tokenPrice + imbue.items.slice(1).reduce((s, it) => s + ip(it) * it.qty, 0)
    const four = 4 * tokenPrice + imbue.items.slice(2).reduce((s, it) => s + ip(it) * it.qty, 0)
    const options = [
      { key: "tokens", label: "Só Tokens",       value: tokenCost },
      { key: "items",  label: "Só Itens",         value: itemsCost },
      { key: "two",    label: "2 Tokens + Itens", value: two },
      { key: "four",   label: "4 Tokens + Itens", value: four },
    ]
    const best = options.reduce((m, o) => o.value < m.value ? o : m, options[0])
    return { options, best }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Token price */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 20px",
        background: "oklch(0.26 0.026 208 / 0.45)",
        backdropFilter: "blur(24px) saturate(2)",
        WebkitBackdropFilter: "blur(24px) saturate(2)",
        border: "1px solid oklch(1 0 0 / 0.16)",
        borderRadius: "10px",
      }}>
        <span style={{
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--text-low)",
          whiteSpace: "nowrap",
        }}>
          Gold Token
        </span>
        <input
          className="field-input"
          type="number"
          value={tokenPrice}
          onChange={e => setTokenPrice(Number(e.target.value))}
          style={{ maxWidth: "160px" }}
        />
        <span style={{ fontSize: "0.72rem", color: "var(--text-low)", whiteSpace: "nowrap" }}>
          gold / token
        </span>
      </div>

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}>
        {IMBUEMENTS.map((imbue) => {
          const { options, best } = calculate(imbue)
          return (
            <div
              key={imbue.key}
              style={{
                background: "oklch(0.26 0.028 207 / 0.45)",
                backdropFilter: "blur(32px) saturate(2.4)",
                WebkitBackdropFilter: "blur(32px) saturate(2.4)",
                border: "1px solid oklch(1 0 0 / 0.16)",
                boxShadow: "0 8px 32px oklch(0 0 0 / 0.28), 0 1px 0 oklch(1 0 0 / 0.12) inset",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "oklch(0.30 0.030 207 / 0.50)"
                e.currentTarget.style.borderColor = "oklch(1 0 0 / 0.26)"
                e.currentTarget.style.boxShadow = "0 8px 40px oklch(0 0 0 / 0.32), 0 1px 0 oklch(1 0 0 / 0.16) inset"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "oklch(0.26 0.028 207 / 0.45)"
                e.currentTarget.style.borderColor = "oklch(1 0 0 / 0.16)"
                e.currentTarget.style.boxShadow = "0 8px 32px oklch(0 0 0 / 0.28), 0 1px 0 oklch(1 0 0 / 0.12) inset"
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--border-mid)",
                  flexShrink: 0,
                  background: "oklch(0.12 0.018 230)",
                }}>
                  <img src={IMAGES[imbue.key]} alt={imbue.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </div>
                <span className="font-display" style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "var(--text-high)",
                }}>
                  {imbue.name}
                </span>
              </div>

              {/* Item inputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {imbue.items.map(it => (
                  <div key={it.name}>
                    <label className="field-label">{it.qty}× {it.name}</label>
                    <input
                      className="field-input"
                      type="number"
                      placeholder="Preço por un."
                      onChange={e => setPrice(imbue.key, it.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Results panel */}
              <div style={{
                background: "oklch(0.18 0.020 220 / 0.55)",
                border: "1px solid oklch(1 0 0 / 0.10)",
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}>
                {/* Best badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-low)" }}>
                    Melhor opção
                  </span>
                  <span style={{
                    background: "oklch(0.72 0.20 185 / 0.15)",
                    border: "1px solid var(--border-hi)",
                    borderRadius: "5px",
                    padding: "3px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    letterSpacing: "0.02em",
                  }}>
                    {best.label} — {fmt(best.value)}
                  </span>
                </div>

                {/* Options breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {options.map(o => (
                    <div key={o.key} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 8px",
                      borderRadius: "5px",
                      background: o.key === best.key ? "oklch(0.72 0.20 185 / 0.10)" : "transparent",
                      transition: "background 0.2s",
                    }}>
                      <span style={{
                        fontSize: "0.75rem",
                        color: o.key === best.key ? "var(--accent-dim)" : "var(--text-low)",
                        fontWeight: o.key === best.key ? 600 : 400,
                      }}>
                        {o.label}
                      </span>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: o.key === best.key ? "var(--text-high)" : "var(--text-low)",
                      }}>
                        {fmt(o.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
