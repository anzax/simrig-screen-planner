import React, { useState } from 'react'
import { useScreenCalculations } from './hooks/useScreenCalculations'
import SettingsPanel from './components/SettingsPanel'
import StatsDisplay from './components/StatsDisplay'
import ScreenVisualizer from './components/ScreenVisualizer'
import Footer from './components/Footer'

export default function App() {
  /* ---------- Inputs ---------- */
  const [diagIn, setDiagIn] = useState(32)
  const [ratio, setRatio] = useState('16:9')
  const [distCm, setDistCm] = useState(60)
  const [bezelMm, setBezelMm] = useState(0)

  /* ---------- Enhanced Inputs ---------- */
  const [inputMode, setInputMode] = useState('diagonal')
  const [setupType, setSetupType] = useState('triple')
  const [angleMode, setAngleMode] = useState('auto')
  const [manualAngle, setManualAngle] = useState(60)
  const [screenWidth, setScreenWidth] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  /* ---------- Calculations ---------- */
  const { data, view } = useScreenCalculations(
    diagIn,
    ratio,
    distCm,
    bezelMm,
    setupType,
    angleMode,
    manualAngle
  )

  /* ---------- UI ---------- */
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">
        Triple‑Screen Planner <span className="text-sm font-normal">(Sim‑Racing)</span>
      </h1>

      <SettingsPanel
        diagIn={diagIn}
        setDiagIn={setDiagIn}
        ratio={ratio}
        setRatio={setRatio}
        distCm={distCm}
        setDistCm={setDistCm}
        bezelMm={bezelMm}
        setBezelMm={setBezelMm}
        inputMode={inputMode}
        setInputMode={setInputMode}
        setupType={setupType}
        setSetupType={setSetupType}
        angleMode={angleMode}
        setAngleMode={setAngleMode}
        manualAngle={manualAngle}
        setManualAngle={setManualAngle}
        screenWidth={screenWidth}
        setScreenWidth={setScreenWidth}
        screenHeight={screenHeight}
        setScreenHeight={setScreenHeight}
      />

      <StatsDisplay data={data} />

      <ScreenVisualizer view={view} />

      <Footer />
    </div>
  )
}
