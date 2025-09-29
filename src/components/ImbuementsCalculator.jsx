import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import VoidGif from "@/assets/Powerful_Void.gif"
import StrikeGif from "@/assets/Powerful_Strike.gif"
import VampGif from "@/assets/Powerful_Vampirism.gif"

const IMAGES = {
    void: VoidGif,
    strike: StrikeGif,
    vamp: VampGif,
}

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
            { key: "tokens", label: "Só Tokens", value: tokenCost },
            { key: "items", label: "Só Itens", value: itemsCost },
            { key: "2tokens", label: "2 Tokens + Itens", value: twoTokensCost },
            { key: "4tokens", label: "4 Tokens + Itens", value: fourTokensCost },
        ]


        const best = options.reduce((min, o) => (o.value < min.value ? o : min), options[0])
        return { options, best }
    }

    const explanation = (imbue, key) => {
        if (key === "2tokens") {
            return `2 tokens substituem os ${imbue.items[0].qty}x ${imbue.items[0].name}, o resto você compra.`
        }
        if (key === "4tokens") {
            return `4 tokens substituem ${imbue.items[0].qty}x ${imbue.items[0].name} e ${imbue.items[1].qty}x ${imbue.items[1].name}, você compra só ${imbue.items[2].qty}x ${imbue.items[2].name}.`
        }
        if (key === "items") {
            return `Você compra todos os itens manualmente.`
        }
        if (key === "tokens") {
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
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold flex items-center gap-3">
                                        <img
                                            src={IMAGES[imbue.key]}
                                            alt={imbue.name}
                                            className="w-10 h-10 rounded-md"
                                        />
                                        {imbue.name}
                                    </CardTitle>
                                </CardHeader>

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
                                            placeholder="Preço por UN."
                                            onChange={(e) =>
                                                handlePriceChange(imbue.key, it.name, e.target.value)
                                            }
                                            className="bg-slate-800 text-center"
                                        />
                                    </div>
                                ))}

                                <div className="p-3 rounded bg-slate-800 space-y-2">
                                    <p className="font-semibold">
                                        Melhor opção:{" "}
                                        <Badge
                                            variant="secondary"
                                            className="bg-purple-500/20 text-purple-300 border border-purple-600 ml-1"
                                        >
                                            {result.best.label} → {result.best.value.toLocaleString()}
                                        </Badge>
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        {explanation(imbue, result.best.key)}
                                    </p>

                                    <div className="flex flex-col gap-1 mt-2">
                                        {result.options.map((o, i) => (
                                            <Badge
                                                key={o.key}
                                                variant="outline"
                                                className="justify-start bg-slate-700/40 text-slate-200"
                                            >
                                                {o.label}: {o.value.toLocaleString()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
