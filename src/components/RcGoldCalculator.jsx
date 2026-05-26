import { useState, useRef, useEffect } from "react"

const fmt = (n) =>
  Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function AnimatedNumber({ value }) {
  const ref = useRef(null)
  const prev = useRef(0)

  useEffect(() => {
    if (!ref.current) return
    const start = prev.current
    const end = Number(value)
    if (isNaN(end)) return

    const duration = 500
    const startTime = performance.now()

    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      const cur = start + (end - start) * eased
      if (ref.current) ref.current.textContent = fmt(cur)
      if (t < 1) requestAnimationFrame(step)
      else prev.current = end
    }

    requestAnimationFrame(step)
  }, [value])

  return <span ref={ref}>{fmt(0)}</span>
}

export default function RcGoldCalculator() {
  const [rcPrice, setRcPrice]     = useState("")
  const [rcAmount, setRcAmount]   = useState("")
  const [goldAmount, setGoldAmount] = useState("")

  const price    = Number(rcPrice)
  const rcToGold = rcAmount && price ? (Number(rcAmount) * price) / 1_000_000 : null
  const goldToRc = goldAmount && price ? (Number(goldAmount) * 1_000_000) / price : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Crimson+Pro:ital,wght@0,400;1,300&display=swap');

        .rc-divider {
          display: flex; align-items: center; gap: 14px; margin: 4px 0;
        }
        .rc-divider::before, .rc-divider::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-mid), transparent);
        }
        .rc-section-label {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--text-low);
        }
        .rc-input {
          background: oklch(0.10 0.012 235 / 0.90);
          backdrop-filter: blur(10px);
          border: 1px solid oklch(1 0 0 / 0.14);
          color: oklch(0.97 0.005 240);
          font-size: 1rem;
          padding: 11px 16px;
          border-radius: 6px;
          width: 100%; outline: none;
          text-align: center;
          letter-spacing: 0.04em;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .rc-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
          background: oklch(0.13 0.016 225 / 0.95);
        }
        .rc-input::placeholder { color: oklch(0.38 0.006 230); font-style: italic; }
        .rc-input::-webkit-inner-spin-button,
        .rc-input::-webkit-outer-spin-button { -webkit-appearance: none; }

        .rc-label {
          font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text-low);
          display: block; margin-bottom: 7px;
        }

        .rc-result-panel {
          background: oklch(0.25 0.026 208 / 0.45);
          backdrop-filter: blur(28px) saturate(2.2);
          -webkit-backdrop-filter: blur(28px) saturate(2.2);
          border: 1px solid oklch(1 0 0 / 0.16);
          border-radius: 8px;
          padding: 20px 22px;
          position: relative; overflow: hidden;
          min-height: 88px;
          display: flex; flex-direction: column; justify-content: center;
          transition: border-color 0.25s, box-shadow 0.25s;
          box-shadow: 0 4px 24px oklch(0 0 0 / 0.30), 0 1px 0 oklch(1 0 0 / 0.07) inset;
        }
        .rc-result-panel.has-value {
          border-color: oklch(0.72 0.20 185 / 0.55);
          box-shadow: 0 0 28px oklch(0.72 0.20 185 / 0.22), 0 4px 24px oklch(0 0 0 / 0.30), inset 0 1px 0 oklch(1 0 0 / 0.10);
        }
        .rc-result-panel::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, oklch(1 0 0 / 0.03) 0%, transparent 50%);
          pointer-events: none;
        }
        .rc-corner {
          position: absolute; width: 10px; height: 10px;
          border-color: var(--border-hi); border-style: solid;
          transition: border-color 0.2s;
        }
        .rc-corner-tl { top: 5px; left: 5px; border-width: 1px 0 0 1px; }
        .rc-corner-tr { top: 5px; right: 5px; border-width: 1px 1px 0 0; }
        .rc-corner-bl { bottom: 5px; left: 5px; border-width: 0 0 1px 1px; }
        .rc-corner-br { bottom: 5px; right: 5px; border-width: 0 1px 1px 0; }

        .rc-value {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.6rem, 3.5vw, 2.2rem);
          font-weight: 900;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -0.02em;
          text-shadow: 0 0 20px var(--accent-glow);
        }
        .rc-unit {
          font-family: 'Crimson Pro', serif;
          font-size: 0.82rem; font-style: italic;
          color: oklch(0.55 0.008 230);
          margin-top: 5px; letter-spacing: 0.04em;
        }
        .rc-empty {
          font-family: 'Crimson Pro', serif;
          font-size: 0.88rem; font-style: italic;
          color: oklch(0.35 0.006 230);
          text-align: center; letter-spacing: 0.03em;
        }

        .rc-price-block {
          background: oklch(0.26 0.026 208 / 0.45);
          backdrop-filter: blur(28px) saturate(2.2);
          -webkit-backdrop-filter: blur(28px) saturate(2.2);
          border: 1px solid oklch(1 0 0 / 0.16);
          border-radius: 10px;
          padding: 18px 22px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 4px 24px oklch(0 0 0 / 0.25), 0 1px 0 oklch(1 0 0 / 0.07) inset;
        }

        .rc-footnote {
          font-family: 'Crimson Pro', serif;
          font-size: 0.75rem; font-style: italic;
          color: var(--text-low); letter-spacing: 0.03em;
        }

        .rc-grid {
          display: grid;
          grid-template-columns: 1fr 36px 1fr;
          align-items: start;
          gap: 0;
        }
        .rc-arrow-col {
          display: flex; align-items: center; justify-content: center;
          padding-top: 30px;
          font-size: 1.3rem;
          color: var(--accent-dim);
          opacity: 0.6;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Price */}
        <div className="rc-price-block">
          <svg viewBox="0 0 40 40" fill="none" style={{ width: 40, height: 40, flexShrink: 0 }}>
            <polygon points="20,2 35,13 30,36 10,36 5,13"
              fill="oklch(0.40 0.18 185)"
              stroke="oklch(0.72 0.20 185)"
              strokeWidth="1.2" />
            <polygon points="20,2 35,13 20,9"
              fill="oklch(0.62 0.18 185)" opacity="0.75" />
            <polygon points="20,9 35,13 30,36 10,36 5,13"
              fill="oklch(0.32 0.15 185)" opacity="0.6" />
            <line x1="20" y1="9" x2="20" y2="36"
              stroke="oklch(0.72 0.20 185)" strokeWidth="0.6" opacity="0.4" />
            <line x1="5" y1="13" x2="35" y2="13"
              stroke="oklch(0.72 0.20 185)" strokeWidth="0.6" opacity="0.3" />
          </svg>
          <div style={{ flex: 1 }}>
            <label className="rc-label">Preço do Rubini Coin</label>
            <input
              className="rc-input"
              type="number"
              value={rcPrice}
              onChange={e => setRcPrice(e.target.value)}
              placeholder="ex: 12500"
            />
          </div>
          <span className="rc-footnote" style={{ alignSelf: "flex-end" }}>em gold</span>
        </div>

        {/* Divider */}
        <div className="rc-divider">
          <span className="rc-section-label">Conversão</span>
        </div>

        {/* Conversions */}
        <div className="rc-grid">

          {/* RC → Gold */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="rc-label">RC → Gold (kk)</label>
            <input
              className="rc-input"
              type="number"
              value={rcAmount}
              onChange={e => setRcAmount(e.target.value)}
              placeholder="qtd. de RC"
            />
            <div className={`rc-result-panel ${rcToGold !== null ? "has-value" : ""}`}>
              <div className="rc-corner rc-corner-tl" />
              <div className="rc-corner rc-corner-tr" />
              <div className="rc-corner rc-corner-bl" />
              <div className="rc-corner rc-corner-br" />
              {rcToGold !== null ? (
                <>
                  <div className="rc-value"><AnimatedNumber value={rcToGold} /></div>
                  <div className="rc-unit">kk em gold</div>
                </>
              ) : (
                <div className="rc-empty">— aguardando —</div>
              )}
            </div>
          </div>

          <div className="rc-arrow-col">⇄</div>

          {/* Gold → RC */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label className="rc-label">Gold (kk) → RC</label>
            <input
              className="rc-input"
              type="number"
              value={goldAmount}
              onChange={e => setGoldAmount(e.target.value)}
              placeholder="qtd. em kk"
            />
            <div className={`rc-result-panel ${goldToRc !== null ? "has-value" : ""}`}>
              <div className="rc-corner rc-corner-tl" />
              <div className="rc-corner rc-corner-tr" />
              <div className="rc-corner rc-corner-bl" />
              <div className="rc-corner rc-corner-br" />
              {goldToRc !== null ? (
                <>
                  <div className="rc-value"><AnimatedNumber value={goldToRc} /></div>
                  <div className="rc-unit">Rubini Coins</div>
                </>
              ) : (
                <div className="rc-empty">— aguardando —</div>
              )}
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="rc-divider">
          <span className="rc-footnote">1 kk = 1.000.000 gold</span>
        </div>

      </div>
    </>
  )
}
