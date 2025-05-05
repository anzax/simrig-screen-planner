import React from 'react'
import { useSettingsStore } from './store/settingsStore'
import { useScreenCalculations } from './hooks/useScreenCalculations'
import SettingsPanel from './components/SettingsPanel'
import StatsDisplay from './components/StatsDisplay'
import ScreenVisualizer from './components/ScreenVisualizer'
import Footer from './components/Footer'

export default function App() {
  // Get all settings from the store
  const {
    diagIn,
    ratio,
    distCm,
    bezelMm,
    inputMode,
    setupType,
    angleMode,
    manualAngle,
    screenWidth,
    screenHeight,
    isCurved,
    curveRadius,
  } = useSettingsStore()

  /* ---------- Calculations ---------- */
  const { data, view } = useScreenCalculations(
    diagIn,
    ratio,
    distCm,
    bezelMm,
    setupType,
    angleMode,
    manualAngle,
    inputMode,
    screenWidth,
    screenHeight,
    isCurved,
    curveRadius
  )

  /* ---------- UI ---------- */
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">
        Triple‑Screen Planner <span className="text-sm font-normal">(Sim‑Racing)</span>
      </h1>

      <SettingsPanel />

      <StatsDisplay data={data} />

      <ScreenVisualizer view={view} />

      <Footer />
    </div>
  )
}
