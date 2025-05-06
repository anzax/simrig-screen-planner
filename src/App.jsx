import React from 'react'
import { useSettingsStore, useUIStore } from './store/settingsStore'
import { useScreenCalculations } from './hooks/useScreenCalculations'
import SettingsPanel from './components/SettingsPanel'
import StatsDisplay from './components/StatsDisplay'
import ScreenVisualizer from './components/ScreenVisualizer'
import Footer from './components/Footer'

export default function App() {
  // Clean state access with destructuring
  const { screen, distance, layout, curvature } = useSettingsStore()
  const { inputMode, angleMode } = useUIStore()

  /* ---------- Calculations ---------- */
  const { data, view } = useScreenCalculations(
    screen.diagIn,
    screen.ratio,
    distance.distCm,
    screen.bezelMm,
    layout.setupType,
    angleMode,
    layout.manualAngle,
    inputMode,
    screen.screenWidth,
    screen.screenHeight,
    curvature.isCurved,
    curvature.curveRadius
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
