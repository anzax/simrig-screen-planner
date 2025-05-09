import React, { useState, useEffect } from 'react'
import { useSettingsStore, useUIStore } from './store/settingsStore'
import { useScreenCalculations } from './hooks/useScreenCalculations'
import SettingsPanel from './components/SettingsPanel'
import StatsDisplay from './components/StatsDisplay'
import ScreenVisualizer from './components/ScreenVisualizer'
import Footer from './components/Footer'

export default function App() {
  // State for configurations
  const [hasSecondConfig, setHasSecondConfig] = useState(false)
  const [activeConfig, setActiveConfig] = useState('main')

  // Debug log for state changes
  useEffect(() => {
    console.log('App state:', { hasSecondConfig, activeConfig })
  }, [hasSecondConfig, activeConfig])

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
  // Handle adding the second configuration
  const addSecondConfig = () => {
    setHasSecondConfig(true)
    setActiveConfig('second')

    // In a real implementation, this would populate default values
    // For this stub, we'll just simulate the state change
    console.log('Added second config and switched active configuration to second')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">
        SimRig Screen Planner <span className="text-sm font-normal">(Sim‑Racing)</span>
      </h1>

      <SettingsPanel
        hasSecondConfig={hasSecondConfig}
        setHasSecondConfig={setHasSecondConfig}
        activeConfig={activeConfig}
      />

      <StatsDisplay
        data={data}
        secondConfig={
          hasSecondConfig
            ? {
                // Demo data for second config
                sideAngleDeg: 45.0,
                hFOVdeg: 160.5,
                vFOVdeg: 28.7,
                cm: { totalWidth: 167.3 },
              }
            : undefined
        }
        onAddConfig={addSecondConfig}
        activeConfig={activeConfig}
        setActiveConfig={setActiveConfig}
      />

      <ScreenVisualizer view={view} />

      <Footer />
    </div>
  )
}
