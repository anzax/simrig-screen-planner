import React, { useState } from "react";
import { useScreenCalculations } from "./hooks/useScreenCalculations";
import SettingsPanel from "./components/SettingsPanel";
import StatsDisplay from "./components/StatsDisplay";
import ScreenVisualizer from "./components/ScreenVisualizer";
import Footer from "./components/Footer";

export default function App() {
    /* ---------- Inputs ---------- */
    const [diagIn, setDiagIn] = useState(32);
    const [ratio, setRatio] = useState("16:9");
    const [distCm, setDistCm] = useState(60);
    const [bezelMm, setBezelMm] = useState(0);

    /* ---------- Calculations ---------- */
    const { data, view } = useScreenCalculations(diagIn, ratio, distCm, bezelMm);

    /* ---------- UI ---------- */
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-semibold">Triple‑Screen Planner <span
                className="text-sm font-normal">(Sim‑Racing)</span></h1>

            <SettingsPanel 
                diagIn={diagIn} 
                setDiagIn={setDiagIn}
                ratio={ratio} 
                setRatio={setRatio}
                distCm={distCm} 
                setDistCm={setDistCm}
                bezelMm={bezelMm} 
                setBezelMm={setBezelMm}
            />

            <StatsDisplay data={data} />

            <ScreenVisualizer view={view} />

            <Footer />
        </div>
    );
}
