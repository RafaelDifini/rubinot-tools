import { useState, useRef, useEffect } from "react"

const fmt = (n, digits = 2) =>
  Number(n).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits })

function AnimatedNumber({ value, digits = 2 }) {
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
      if (ref.current) ref.current.textContent = fmt(cur, digits)
      if (t < 1) requestAnimationFrame(step)
      else prev.current = end
    }

    requestAnimationFrame(step)
  }, [value, digits])

  return <span ref={ref}>{fmt(0, digits)}</span>
}

export default function KkPriceCalculator() {
  const [rubiniPrice, setRubiniPrice] = useState("")
  const [rcInGold, setRcInGold]       = useState("")
  const [kkAmount, setKkAmount]       = useState("")

  const rubini = Number(rubiniPrice)
  const rcGold = Number(rcInGold)

  const pricePerRc = rubini > 0 ? rubini / 1000 : null
  const pricePerKk = pricePerRc && rcGold > 0 ? pricePerRc / (rcGold / 1_000_000) : null

  const kkAmountValue = Number(kkAmount)
  const totalPrice = pricePerKk && kkAmountValue > 0 ? pricePerKk * kkAmountValue : null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Crimson+Pro:ital,wght@0,400;1,300&display=swap');

        .kk-divider {
          display: flex; align-items: center; gap: 14px; margin: 4px 0;
        }
        .kk-divider::before, .kk-divider::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-mid), transparent);
        }
        .kk-section-label {
          font-family: 'Cinzel', serif;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--text-low);
        }
        .kk-input {
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
        .kk-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
          background: oklch(0.13 0.016 225 / 0.95);
        }
        .kk-input::placeholder { color: oklch(0.38 0.006 230); font-style: italic; }
        .kk-input::-webkit-inner-spin-button,
        .kk-input::-webkit-outer-spin-button { -webkit-appearance: none; }

        .kk-label {
          font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--text-low);
          display: block; margin-bottom: 7px;
        }

        .kk-input-block {
          background: oklch(0.26 0.026 208 / 0.45);
          backdrop-filter: blur(28px) saturate(2.2);
          -webkit-backdrop-filter: blur(28px) saturate(2.2);
          border: 1px solid oklch(1 0 0 / 0.16);
          border-radius: 10px;
          padding: 18px 22px;
          display: flex; align-items: center; gap: 16px;
          box-shadow: 0 4px 24px oklch(0 0 0 / 0.25), 0 1px 0 oklch(1 0 0 / 0.07) inset;
        }

        .kk-result-panel {
          background: oklch(0.25 0.026 208 / 0.45);
          backdrop-filter: blur(28px) saturate(2.2);
          -webkit-backdrop-filter: blur(28px) saturate(2.2);
          border: 1px solid oklch(1 0 0 / 0.16);
          border-radius: 8px;
          padding: 24px 22px;
          position: relative; overflow: hidden;
          min-height: 100px;
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          transition: border-color 0.25s, box-shadow 0.25s;
          box-shadow: 0 4px 24px oklch(0 0 0 / 0.30), 0 1px 0 oklch(1 0 0 / 0.07) inset;
        }
        .kk-result-panel.has-value {
          border-color: oklch(0.72 0.20 185 / 0.55);
          box-shadow: 0 0 28px oklch(0.72 0.20 185 / 0.22), 0 4px 24px oklch(0 0 0 / 0.30), inset 0 1px 0 oklch(1 0 0 / 0.10);
        }
        .kk-corner {
          position: absolute; width: 10px; height: 10px;
          border-color: var(--border-hi); border-style: solid;
        }
        .kk-corner-tl { top: 5px; left: 5px; border-width: 1px 0 0 1px; }
        .kk-corner-tr { top: 5px; right: 5px; border-width: 1px 1px 0 0; }
        .kk-corner-bl { bottom: 5px; left: 5px; border-width: 0 0 1px 1px; }
        .kk-corner-br { bottom: 5px; right: 5px; border-width: 0 1px 1px 0; }

        .kk-value {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          font-weight: 900;
          color: var(--accent);
          line-height: 1;
          letter-spacing: -0.02em;
          text-shadow: 0 0 20px var(--accent-glow);
        }
        .kk-unit {
          font-family: 'Crimson Pro', serif;
          font-size: 0.88rem; font-style: italic;
          color: oklch(0.55 0.008 230);
          margin-top: 6px; letter-spacing: 0.04em;
        }
        .kk-empty {
          font-family: 'Crimson Pro', serif;
          font-size: 0.88rem; font-style: italic;
          color: oklch(0.35 0.006 230);
          text-align: center; letter-spacing: 0.03em;
        }
        .kk-footnote {
          font-family: 'Crimson Pro', serif;
          font-size: 0.75rem; font-style: italic;
          color: var(--text-low); letter-spacing: 0.03em;
        }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Inputs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div className="kk-input-block">
            <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>💵</span>
            <div style={{ flex: 1 }}>
              <label className="kk-label">1.000 Rubini Coins</label>
              <input
                className="kk-input"
                type="number"
                value={rubiniPrice}
                onChange={e => setRubiniPrice(e.target.value)}
                placeholder="ex: 90"
              />
            </div>
            <span className="kk-footnote" style={{ alignSelf: "flex-end" }}>R$</span>
          </div>

          <div className="kk-input-block">
            <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>💎</span>
            <div style={{ flex: 1 }}>
              <label className="kk-label">Preço do RC no servidor</label>
              <input
                className="kk-input"
                type="number"
                value={rcInGold}
                onChange={e => setRcInGold(e.target.value)}
                placeholder="ex: 94600"
              />
            </div>
            <span className="kk-footnote" style={{ alignSelf: "flex-end" }}>gold / RC</span>
          </div>
        </div>

        {/* Divider */}
        <div className="kk-divider">
          <span className="kk-section-label">Preço Justo do KK</span>
        </div>

        {/* Result */}
        <div className={`kk-result-panel ${pricePerKk !== null ? "has-value" : ""}`}>
          <div className="kk-corner kk-corner-tl" />
          <div className="kk-corner kk-corner-tr" />
          <div className="kk-corner kk-corner-bl" />
          <div className="kk-corner kk-corner-br" />
          {pricePerKk !== null ? (
            <>
              <div className="kk-value">R$ <AnimatedNumber value={pricePerKk} digits={4} /></div>
              <div className="kk-unit">por 1 kk de gold</div>
            </>
          ) : (
            <div className="kk-empty">— informe os dois valores acima —</div>
          )}
        </div>

        {/* Divider */}
        <div className="kk-divider">
          <span className="kk-section-label">Simular Quantidade</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label className="kk-label">Quantidade de gold (kk)</label>
          <input
            className="kk-input"
            type="number"
            value={kkAmount}
            onChange={e => setKkAmount(e.target.value)}
            placeholder="ex: 500"
            disabled={pricePerKk === null}
          />
          <div className={`kk-result-panel ${totalPrice !== null ? "has-value" : ""}`}>
            <div className="kk-corner kk-corner-tl" />
            <div className="kk-corner kk-corner-tr" />
            <div className="kk-corner kk-corner-bl" />
            <div className="kk-corner kk-corner-br" />
            {totalPrice !== null ? (
              <>
                <div className="kk-value">R$ <AnimatedNumber value={totalPrice} /></div>
                <div className="kk-unit">custo total estimado</div>
              </>
            ) : (
              <div className="kk-empty">— aguardando —</div>
            )}
          </div>
        </div>

        {/* Footnote */}
        <div className="kk-divider">
          <span className="kk-footnote">preço/kk = (preço de 1000 RC ÷ 1000) ÷ (preço do RC em gold ÷ 1.000.000)</span>
        </div>

      </div>
    </>
  )
}
