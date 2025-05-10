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
  const [isAnimating, setIsAnimating] = useState(false)

  // Effect to handle animation when config changes
  useEffect(() => {
    if (hasSecondConfig) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000) // Animation duration
      return () => clearTimeout(timer)
    }
  }, [activeConfig, hasSecondConfig])

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

  // Handle removing the second configuration
  const removeSecondConfig = () => {
    setHasSecondConfig(false)
    setActiveConfig('main')
    console.log('Removed second config and switched back to main configuration')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center h-10 mb-2">
        <a
          href="https://simrigbuild.com"
          className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          SimRigBuild.com
        </a>
        <span className="mx-2 text-gray-400">/</span>
        <h1 className="text-xl font-medium">Screen Planner</h1>
      </header>

      <SettingsPanel
        hasSecondConfig={hasSecondConfig}
        setHasSecondConfig={setHasSecondConfig}
        activeConfig={activeConfig}
        isAnimating={isAnimating}
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
        isAnimating={isAnimating}
        removeSecondConfig={removeSecondConfig}
      />

      <ScreenVisualizer view={view} />

      <Footer />
    </div>
  )
}
