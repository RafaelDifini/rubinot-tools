import { useState } from "react"
import { toast } from "sonner"

const CAP = 42 * 60
const ORANGE_TOP = 39 * 60

const mult = {
  orange: { offline: 3, trainer: 6, protection: 3 },
  green:  { offline: 6, trainer: 6, protection: 5 },
}

const isValidStamina = (str) => {
  if (!/^\d{1,2}:\d{2}$/.test(str)) return false
  const [, m] = str.split(":").map(Number)
  return m >= 0 && m < 60
}

const parseStamina = (v) => {
  const [h, m] = v.split(":").map(Number)
  if (isNaN(h) || isNaN(m) || m >= 60) return null
  return Math.min(h * 60 + m, CAP)
}

const splitHM = (min) => ({ h: Math.floor(min / 60), m: min % 60 })

const METHODS = [
  { key: "offline",    label: "Offline",         icon: "🌙" },
  { key: "trainer",    label: "Trainer",          icon: "⚔️" },
  { key: "protection", label: "Protection Zone",  icon: "🛡️" },
]

export default function StaminaCalculator() {
  const [current, setCurrent] = useState("39:00")
  const [target, setTarget] = useState("42:00")
  const [results, setResults] = useState(null)

  const calcFor = (cond, nowMs, curMin, tgtMin) => {
    let total = 0
    if (curMin < ORANGE_TOP) {
      const delta = Math.max(0, Math.min(ORANGE_TOP, tgtMin) - curMin)
      total += delta * mult.orange[cond]
    }
    if (tgtMin > ORANGE_TOP) {
      const delta = Math.max(0, tgtMin - Math.max(curMin, ORANGE_TOP))
      total += delta * mult.green[cond]
    }
    const finish = new Date(nowMs + total * 60_000)
    const { h, m } = splitHM(total)
    return { hours: h, minutes: m, finish: finish.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }
  }

  const calculate = () => {
    if (!isValidStamina(current) || !isValidStamina(target)) {
      toast.error("Formato HH:MM — minutos entre 00 e 59")
      return
    }
    const cur = parseStamina(current)
    const tgt = parseStamina(target)
    if (!cur || !tgt) { toast.error("Stamina inválida"); return }
    if (tgt <= cur)   { toast.error("Alvo deve ser maior que atual"); return }
    const now = Date.now()
    setResults({
      offline:    calcFor("offline",    now, cur, tgt),
      trainer:    calcFor("trainer",    now, cur, tgt),
      protection: calcFor("protection", now, cur, tgt),
    })
  }

  const pct = (v) => {
    const mins = parseStamina(v)
    return mins ? Math.min((mins / CAP) * 100, 100) : 0
  }

  const curPct = pct(current)
  const tgtPct = pct(target)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

      {/* Visual stamina bar */}
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-low)", marginBottom: 0 }}>Progresso de Stamina</span>
          <span style={{ fontSize: "0.72rem", color: "var(--text-low)" }}>
            {current} → {target} / 42:00
          </span>
        </div>
        {/* Track — full gradient, always visible as dim background */}
        <div style={{
          height: "8px",
          borderRadius: "99px",
          position: "relative",
          background: "oklch(0.16 0.018 230)",
          overflow: "visible",
        }}>
          {/* Full gradient track (dim, shows the spectrum) */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "99px",
            background: "linear-gradient(90deg, oklch(0.55 0.22 25), oklch(0.70 0.20 60) 40%, oklch(0.75 0.18 90) 65%, oklch(0.68 0.20 145) 85%, oklch(0.72 0.20 165))",
            opacity: 0.18,
          }} />

          {/* Current fill — clips to curPct, same gradient */}
          <div style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: `${curPct}%`,
            borderRadius: "99px",
            background: "linear-gradient(90deg, oklch(0.60 0.24 25), oklch(0.74 0.22 60) 40%, oklch(0.80 0.20 90) 65%, oklch(0.72 0.21 145) 85%, oklch(0.76 0.21 165))",
            transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 0 8px oklch(0.72 0.20 90 / 0.4)",
          }} />

          {/* Target fill — same gradient but translucent, clips to tgtPct */}
          <div style={{
            position: "absolute",
            left: 0, top: 0, bottom: 0,
            width: `${tgtPct}%`,
            borderRadius: "99px",
            background: "linear-gradient(90deg, oklch(0.60 0.24 25 / 0.35), oklch(0.74 0.22 60 / 0.35) 40%, oklch(0.80 0.20 90 / 0.35) 65%, oklch(0.72 0.21 145 / 0.45) 85%, oklch(0.76 0.21 165 / 0.5))",
            transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
          }} />

          {/* Current position cursor */}
          <div style={{
            position: "absolute",
            top: "-3px",
            bottom: "-3px",
            left: `${curPct}%`,
            width: "3px",
            transform: "translateX(-50%)",
            background: "oklch(0.96 0.04 80)",
            borderRadius: "2px",
            boxShadow: "0 0 6px oklch(0.96 0.10 80)",
            transition: "left 0.7s cubic-bezier(0.4,0,0.2,1)",
          }} />

          {/* 39h threshold marker */}
          <div style={{
            position: "absolute",
            top: "-4px",
            bottom: "-4px",
            left: `${(ORANGE_TOP / CAP) * 100}%`,
            width: "1.5px",
            background: "oklch(0.80 0.18 75 / 0.8)",
            borderRadius: "1px",
          }} />
        </div>

        <div style={{
          position: "relative",
          marginTop: "6px",
          fontSize: "0.63rem",
          color: "var(--text-low)",
          letterSpacing: "0.04em",
          height: "14px",
        }}>
          <span style={{ position: "absolute", left: 0 }}>0h</span>
          <span style={{
            position: "absolute",
            left: `${(ORANGE_TOP / CAP) * 100}%`,
            transform: "translateX(-50%)",
            color: "oklch(0.78 0.18 75)",
            whiteSpace: "nowrap",
          }}>39h</span>
          <span style={{ position: "absolute", right: 0 }}>42h</span>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { id: "cur", label: "Stamina Atual", value: current, set: setCurrent, placeholder: "Ex: 38:00" },
          { id: "tgt", label: "Stamina Alvo",  value: target,  set: setTarget,  placeholder: "Ex: 42:00" },
        ].map(({ id, label, value, set, placeholder }) => (
          <div key={id}>
            <label className="field-label">{label}</label>
            <input
              className="field-input"
              type="text"
              value={value}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      {/* Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn-glow" onClick={calculate}>
          Calcular
        </button>
      </div>

      {/* Results */}
      {results && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, var(--border-mid), transparent)",
            marginBottom: "4px",
          }} />

          {METHODS.map(({ key, label, icon }, i) => {
            const d = results[key]
            return (
              <div
                key={key}
                className="result-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  padding: "14px 18px",
                  background: "oklch(0.26 0.026 208 / 0.42)",
                  backdropFilter: "blur(20px) saturate(2)",
                  WebkitBackdropFilter: "blur(20px) saturate(2)",
                  border: "1px solid oklch(1 0 0 / 0.14)",
                  borderRadius: "8px",
                  gap: "12px",
                  animationDelay: `${i * 70}ms`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                  <span style={{
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: "var(--text-mid)",
                    letterSpacing: "0.02em",
                  }}>
                    {label}
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--text-high)",
                    letterSpacing: "-0.01em",
                  }}>
                    {d.hours}h {String(d.minutes).padStart(2, "0")}m
                  </span>
                  <span style={{
                    display: "block",
                    fontSize: "0.7rem",
                    color: "var(--text-low)",
                    marginTop: "2px",
                  }}>
                    pronto às {d.finish}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Legend chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
            {[
              { color: "oklch(0.78 0.16 60)", bg: "oklch(0.78 0.16 60 / 0.10)", text: "Laranja ≤ 39h — 3m/1m stamina" },
              { color: "oklch(0.72 0.18 155)", bg: "oklch(0.72 0.18 155 / 0.10)", text: "Verde > 39h — 6m/1m stamina" },
            ].map(({ color, bg, text }) => (
              <div key={text} style={{
                background: bg,
                border: `1px solid ${color}40`,
                borderRadius: "4px",
                padding: "4px 10px",
                fontSize: "0.7rem",
                color,
                letterSpacing: "0.02em",
              }}>
                {text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
