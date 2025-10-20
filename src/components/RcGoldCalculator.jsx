import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RcGoldCalculator() {
  const [rcPrice, setRcPrice] = useState("")
  const [rcAmount, setRcAmount] = useState("")
  const [goldAmount, setGoldAmount] = useState("")

  const rcToGold = rcAmount
    ? ((Number(rcAmount) * rcPrice) / 1_000_000).toFixed(2)
    : null

  const goldToRc = goldAmount
    ? ((Number(goldAmount) * 1_000_000) / rcPrice).toFixed(2)
    : null

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 text-slate-100">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Conversor RC x Gold</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* preço atual */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="rc-price" className="font-semibold">
              💎 Preço atual do Rubini Coin (em gold)
            </Label>
            <Input
              id="rc-price"
              type="number"
              value={rcPrice}
              onChange={(e) => setRcPrice(Number(e.target.value))}
              className="w-40 text-center bg-slate-800"
            />
          </div>

          {/* conversões */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RC → Gold */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="rc-amount">Converter RC → Gold (kk)</Label>
              <Input
                id="rc-amount"
                type="number"
                placeholder="Quantidade de RC"
                value={rcAmount}
                onChange={(e) => setRcAmount(e.target.value)}
                className="bg-slate-800 text-center"
              />
              {rcToGold && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-300 border border-green-600 mt-1"
                >
                  💰 {rcAmount} RC ≈ {rcToGold}kk
                </Badge>
              )}
            </div>

            {/* Gold → RC */}
            <div className="flex flex-col space-y-2">
              <Label htmlFor="gold-amount">Converter Gold (kk) → RC</Label>
              <Input
                id="gold-amount"
                type="number"
                placeholder="Quantidade em KKs"
                value={goldAmount}
                onChange={(e) => setGoldAmount(e.target.value)}
                className="bg-slate-800 text-center"
              />
              {goldToRc && (
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 border border-purple-600 mt-1"
                >
                  🔄 {goldAmount}kk ≈ {goldToRc} RC
                </Badge>
              )}
            </div>
          </div>

          <div className="pt-3">
            <Badge
              variant="outline"
              className="bg-slate-700/40 text-slate-300 border border-slate-600"
            >
              💡 1kk = 1.000.000 gold
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
