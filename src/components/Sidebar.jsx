import { useState } from "react"
import { Calculator, Menu } from "lucide-react"
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip"

export default function Sidebar({ onSelect }) {
    const [open, setOpen] = useState(true)

    return (
        <aside
            className={`${open ? "w-56" : "w-16"
                } bg-slate-800 h-screen p-4 pt-6 transition-all duration-300 flex flex-col`}
        >
            {/* Toggle button */}
            <button className="text-white mb-6" onClick={() => setOpen(!open)}>
                <Menu size={24} />
            </button>

            {/* Calculadoras item */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={`flex items-center gap-3 cursor-pointer hover:bg-slate-800 p-2 rounded-md transition ${!open ? "justify-center" : ""
                            }`}
                        onClick={() => onSelect("calculadoras")}
                    >
                        <Calculator size={22} className="text-white" />
                        {open && <span className="text-sm font-medium text-white">Calculadoras</span>}
                    </div>
                </TooltipTrigger>

                {/* Conteúdo do tooltip: só aparece quando closed */}
                <TooltipContent side="right" className="bg-foreground text-background">
                    <span>Calculadoras</span>
                </TooltipContent>
            </Tooltip>
        </aside>
    )
}
