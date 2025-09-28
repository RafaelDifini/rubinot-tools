import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const IMBUEMENTS = [
  {
    name: "Powerful Void",
    key: "void",
    items: [
      { name: "Rope Belt", qty: 25 },
      { name: "Silencer Claws", qty: 25 },
      { name: "Some Grimeleech Wings", qty: 5 },
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

export default function ImbuementsCalculator() {
  const [tokenPrice, setTokenPrice] = useState(40000)
  const [itemPrices, setItemPrices] = useState({})

  const handlePriceChange = (imbueKey, itemName, value) => {
    setItemPrices((prev) => ({
      ...prev,
      [imbueKey]: {
        ...prev[imbueKey],
        [itemName]: Number(value) || 0,
      },
    }))
  }

  const calculate = (imbue) => {
    const tokenCost = imbue.tokens * tokenPrice

    // custo só com itens
    const itemsCost = imbue.items.reduce((sum, it) => {
      const price = itemPrices[imbue.key]?.[it.name] || 0
      return sum + price * it.qty
    }, 0)

    // 2 tokens → substitui o 1º item
    const twoTokenItems = imbue.items.slice(1)
    const twoTokensCost =
      2 * tokenPrice +
      twoTokenItems.reduce(
        (sum, it) => sum + (itemPrices[imbue.key]?.[it.name] || 0) * it.qty,
        0
      )

    // 4 tokens → substitui os 2 primeiros itens
    const fourTokenItems = imbue.items.slice(2)
    const fourTokensCost =
      4 * tokenPrice +
      fourTokenItems.reduce(
        (sum, it) => sum + (itemPrices[imbue.key]?.[it.name] || 0) * it.qty,
        0
      )

    const options = [
      { label: "Só Tokens", value: tokenCost },
      { label: "Só Itens", value: itemsCost },
      { label: "2 Tokens + Itens", value: twoTokensCost },
      { label: "4 Tokens + Itens", value: fourTokensCost },
    ]

    const best = options.reduce((min, o) => (o.value < min.value ? o : min), options[0])
    return { options, best }
  }

  const explanation = (imbue, label) => {
    if (label === "2 Tokens + Itens") {
      return `2 tokens substituem os ${imbue.items[0].qty}x ${imbue.items[0].name}, o resto você compra.`
    }
    if (label === "4 Tokens + Itens") {
      return `4 tokens substituem ${imbue.items[0].qty}x ${imbue.items[0].name} e ${imbue.items[1].qty}x ${imbue.items[1].name}, você compra só ${imbue.items[2].qty}x ${imbue.items[2].name}.`
    }
    if (label === "Só Itens") {
      return `Você compra todos os itens manualmente.`
    }
    if (label === "Só Tokens") {
      return `Você paga tudo apenas com tokens (mais simples, mas geralmente mais caro).`
    }
    return ""
  }

  return (
    <div className="space-y-6">
      {/* Input global do Token */}
      <Card className="bg-slate-900 text-slate-100">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Configurações Globais</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Label htmlFor="token-price" className="font-semibold">
            Preço do Gold Token
          </Label>
          <Input
            id="token-price"
            type="number"
            value={tokenPrice}
            onChange={(e) => setTokenPrice(Number(e.target.value))}
            className="w-40 text-center bg-slate-800"
          />
        </CardContent>
      </Card>

      {/* Cards de Imbuements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {IMBUEMENTS.map((imbue) => {
          const result = calculate(imbue)
          return (
            <Card key={imbue.key} className="bg-slate-900 text-slate-100">
              <CardHeader>
                <CardTitle className="text-lg font-bold">{imbue.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imbue.items.map((it) => (
                  <div key={it.name} className="flex flex-col space-y-1">
                    <Label htmlFor={`${imbue.key}-${it.name}`}>
                      {it.qty}x {it.name}
                    </Label>
                    <Input
                      id={`${imbue.key}-${it.name}`}
                      type="number"
                      placeholder="Preço"
                      onChange={(e) =>
                        handlePriceChange(imbue.key, it.name, e.target.value)
                      }
                      className="bg-slate-800 text-center"
                    />
                  </div>
                ))}

                <div className="p-3 rounded bg-slate-800">
                  <p className="font-semibold">
                    Melhor opção: {result.best.label} →{" "}
                    {result.best.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {explanation(imbue, result.best.label)}
                  </p>
                  <ul className="text-sm text-slate-400 mt-2 space-y-1">
                    {result.options.map((o, i) => (
                      <li key={i}>
                        {o.label}: {o.value.toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
