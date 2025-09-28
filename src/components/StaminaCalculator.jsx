import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const CAP = 42 * 60
const ORANGE_TOP = 39 * 60

const mult = {
    orange: { offline: 3, trainer: 6, protection: 3 },
    green: { offline: 6, trainer: 6, protection: 5 },
}

// valida formato HH:MM (com minutos de 00 até 59)
const isValidStamina = (str) => {
    if (!/^\d{1,2}:\d{2}$/.test(str)) return false
    const [h, m] = str.split(":").map(Number)
    return m >= 0 && m < 60
}

const parseStamina = (v) => {
    const [h, m] = v.split(":").map(Number)
    if (isNaN(h) || isNaN(m) || m >= 60) return null // inválido
    let total = h * 60 + m
    if (total > CAP) total = CAP
    return total
}


const splitHM = (min) => ({ h: Math.floor(min / 60), m: min % 60 })

export default function StaminaCalculator() {
    const [current, setCurrent] = useState("39:00")
    const [target, setTarget] = useState("42:00")
    const [results, setResults] = useState(null)

    const calcFor = (cond, nowMs, curMin, tgtMin) => {
        let total = 0
        if (curMin < ORANGE_TOP) {
            const to = Math.min(ORANGE_TOP, tgtMin)
            const delta = Math.max(0, to - curMin)
            total += delta * mult.orange[cond]
        }
        if (tgtMin > ORANGE_TOP) {
            const from = Math.max(curMin, ORANGE_TOP)
            const delta = Math.max(0, tgtMin - from)
            total += delta * mult.green[cond]
        }
        const finish = new Date(nowMs + total * 60_000)
        const { h, m } = splitHM(total)
        return { hours: h, minutes: m, finish: finish.toLocaleString() }
    }

    const calculate = () => {
        if (!isValidStamina(current) || !isValidStamina(target)) {
            toast.error("Digite a stamina no formato HH:MM (com minutos entre 00 e 59)")
            return
        }

        const cur = parseStamina(current)
        const tgt = parseStamina(target)

        if (cur === null || tgt === null) {
            toast.error("Valor de stamina inválido.")
            return
        }

        if (tgt <= cur) {
            toast.error("A stamina alvo deve ser maior que a atual")
            return
        }

        const now = Date.now()
        setResults({
            offline: calcFor("offline", now, cur, tgt),
            trainer: calcFor("trainer", now, cur, tgt),
            protection: calcFor("protection", now, cur, tgt),
        })

    }


    return (
        <div className="bg-slate-800 text-slate-100 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Calculadora de Stamina</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col space-y-1">
                    <Label htmlFor="current-stamina">Stamina Atual</Label>
                    <Input
                        id="current-stamina"
                        type="text"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                        placeholder="Ex: 38:00"
                        className="bg-slate-900 border border-slate-700 text-slate-100 text-center"
                    />
                </div>
                <div className="flex flex-col space-y-1">
                    <Label htmlFor="target-stamina">Stamina Alvo</Label>
                    <Input
                        id="target-stamina"
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="Ex: 42:00"
                        className="bg-slate-900 border border-slate-700 text-slate-100 text-center"
                    />
                </div>
            </div>

            <div className="flex justify-center mt-4">
                <Button
                    onClick={calculate}
                    className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 
             hover:from-purple-700 hover:via-purple-800 hover:to-purple-900
             text-white font-semibold text-lg 
             px-12 py-4 rounded-lg shadow-lg transition w-2/4"
                >
                    Calcular
                </Button>
            </div>

            {results && (
                <div className="mt-6 border-t border-slate-700 pt-4 space-y-2">
                    <p>
                        <b>Offline/Dormindo:</b> {results.offline.hours}h {results.offline.minutes}m →{" "}
                        {results.offline.finish}
                    </p>
                    <p>
                        <b>Trainer:</b> {results.trainer.hours}h {results.trainer.minutes}m →{" "}
                        {results.trainer.finish}
                    </p>
                    <p>
                        <b>Protection Zone:</b> {results.protection.hours}h {results.protection.minutes}m →{" "}
                        {results.protection.finish}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border border-orange-600">
                            🔸 Laranja (≤ 39:00): 1 stamina a cada 3m Offline/Protection, 6m Trainer
                        </Badge>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border border-green-600">
                            🟩 Verde (&gt; 39:00): 1 stamina a cada 6m Offline/Trainer, 5m Protection
                        </Badge>
                    </div>
                </div>
            )}

        </div>
    )
}
