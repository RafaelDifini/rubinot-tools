import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import StaminaCalculator from "@/components/StaminaCalculator"
import ImbuementsCalculator from "@/components/ImbuementsCalculator"

export default function CalculatorsPage() {
    return (
        <div className="w-full">
            {/* Header com cor corrigida */}
            <h1 className="text-3xl font-bold mb-6 text-purple-300">
                Centro de Calculadoras
            </h1>

            {/* Tabs */}
            <Tabs defaultValue="stamina" className="w-full">
                <TabsList className="bg-slate-800">
                    <TabsTrigger value="stamina">Stamina</TabsTrigger>
                    <TabsTrigger value="imbuements">Imbuements</TabsTrigger>
                </TabsList>

                <TabsContent value="stamina">
                    <div className="bg-slate-800 text-slate-100 rounded-lg shadow-md p-6">
                        <StaminaCalculator />
                    </div>
                </TabsContent>

                <TabsContent value="imbuements">
                    <div className="bg-slate-800 text-slate-100 rounded-lg shadow-md p-6">
                        <ImbuementsCalculator />
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    )
}
