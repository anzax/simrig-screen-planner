import React, { useState } from "react";
import { useScreenCalculations } from "./hooks/useScreenCalculations";
import Card from "./components/Card";
import Slider from "./components/Slider";
import Input from "./components/Input";

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

            <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-4 items-start">
                <Slider label={`Screen size (in): ${diagIn}`} min={17} max={77} val={diagIn} setVal={setDiagIn}/>
                <div>
                    <label className="block text-sm font-medium mb-1">Aspect ratio</label>
                    <select className="w-full border rounded p-2" value={ratio}
                            onChange={e => setRatio(e.target.value)}>
                        <option value="16:9">16×9</option>
                        <option value="21:9">21×9</option>
                    </select>
                </div>
                <Slider label={`Eye‑to‑screen (cm): ${distCm}`} min={50} max={150} val={distCm} setVal={setDistCm}/>
                <Slider label={`Bezel (mm): ${bezelMm}`} min={0} max={50} val={bezelMm} setVal={setBezelMm}/>
            </div>

            <div className="grid sm:grid-cols-6 gap-4 text-center">
                <Card v={`${data.sideAngleDeg.toFixed(1)}°`} l="Side screen angle"/>
                <Card v={`${data.hFOVdeg.toFixed(1)}°`} l="Horizontal FOV"/>
                <Card v={`${data.vFOVdeg.toFixed(1)}°`} l="Vertical FOV"/>
                <Card v={`${data.cm.distance.toFixed(1)} cm`} l="Eye‑to‑screen"/>
                <Card v={`${Math.round(data.cm.bezel)} mm`} l="Bezel size"/>
                <Card v={`${data.cm.totalWidth.toFixed(1)} cm`} l="Total width"/>
            </div>

            <div className="bg-white rounded shadow p-2 overflow-auto" style={{maxHeight: '70vh'}}>
                <svg width={view.widthPx} height={view.heightPx}>
                    <rect x={view.rig.x} y={view.rig.y} width={view.rig.w} height={view.rig.h} fill="#CBD5E0"
                          fillOpacity={0.4}/>
                    {view.lines.map((l, i) => (
                        <line key={i} {...l} stroke="#000" strokeWidth={4} strokeLinecap="round"/>))}
                    <circle {...view.head} fill="none" stroke="#EF4444" strokeWidth={3}/>
                </svg>
            </div>

            <div className="bg-gray-50 p-4 rounded text-sm text-gray-700 space-y-2">
                <p>Use the sliders to dial in your actual setup—screen diagonal, aspect ratio, eye-to-screen distance
                    (measure from your eyes to the centre of your main screen), and bezel size. The planner then finds
                    the perfect angle so distances to all screen edges are the same.</p>
                <p><strong>Horizontal FOV</strong> shows your in-game side-to-side field of view, while <strong>Vertical
                    FOV</strong> tells you how much screen height you cover—useful for seeing your dash and brake
                    markers.</p>
                <p><strong>Total width</strong> is the straight-line distance between the outer edges of your side
                    screens, so you know exactly how much floor space to reserve.</p>
                <p>The <strong>light-grey box</strong> represents a standard sim cockpit: 60 cm × 150 cm with your head
                    (red circle) 10 cm from the back edge of the rig.</p>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4">
                Built with 🏎️🏁. <a href="https://github.com/anzax/triple-screen-planner"
                                   className="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">View
                on GitHub</a>. Found a bug or have feedback? <a
                href="https://github.com/anzax/triple-screen-planner/issues" className="underline hover:text-blue-600"
                target="_blank" rel="noopener noreferrer">Open an issue</a>.
            </div>
        </div>
    );
}
