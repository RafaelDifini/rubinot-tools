import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import StaminaCalculator from "@/components/StaminaCalculator"
import ImbuementsCalculator from "@/components/ImbuementsCalculator"
import RcGoldCalculator from "@/components/RcGoldCalculator" 

export default function CalculatorsPage() {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold mb-6 text-purple-300">
                Centro de Calculadoras
            </h1>

            <Tabs defaultValue="stamina" className="w-full">
                <TabsList className="flex bg-slate-900/70 rounded-xl p-1 border border-slate-700 shadow-md">
                    {["stamina", "imbuements", "rcgold"].map((value) => (
                        <TabsTrigger
                            key={value}
                            value={value}
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-800
                   data-[state=active]:text-white data-[state=active]:shadow-lg
                   hover:bg-slate-800/60 hover:text-purple-300
                   text-slate-300 transition-all duration-200 ease-out
                   px-6 py-2 rounded-lg font-medium tracking-wide"
                        >
                            {value === "stamina" && "⚡ Stamina"}
                            {value === "imbuements" && "🧪 Imbuements"}
                            {value === "rcgold" && "💎 RC x Gold"}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-4">
                    <TabsContent value="stamina">
                        <div className="bg-slate-800 text-slate-100 rounded-lg shadow-lg p-6 border border-slate-700/50">
                            <StaminaCalculator />
                        </div>
                    </TabsContent>

                    <TabsContent value="imbuements">
                        <div className="bg-slate-800 text-slate-100 rounded-lg shadow-lg p-6 border border-slate-700/50">
                            <ImbuementsCalculator />
                        </div>
                    </TabsContent>

                    <TabsContent value="rcgold">
                        <div className="bg-slate-800 text-slate-100 rounded-lg shadow-lg p-6 border border-slate-700/50">
                            <RcGoldCalculator />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>

        </div>
    )
}
