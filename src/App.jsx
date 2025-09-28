import { useState } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import CalculatorsPage from "@/pages/CalculatorsPage"
import { Toaster } from "sonner"

function App() {
  const [selected, setSelected] = useState("calculadoras")

  return (
  <div className="flex flex-col min-h-screen bg-slate-900">
      {/* Navbar fixa no topo */}
      <Navbar />

      {/* Corpo com sidebar + conteúdo */}
      <div className="flex flex-1">
        {/* Sidebar com tom diferente */}
        <Sidebar onSelect={setSelected} className="bg-slate-800" />

        {/* Área de conteúdo */}
        <main className="flex-1 p-6 overflow-y-auto text-slate-100">
          {selected === "calculadoras" && <CalculatorsPage />}
        </main>
      </div>

      {/* Toast container */}
      <Toaster richColors position="top-right" />
    </div>
  )
}

export default App
