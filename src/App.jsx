import React, { useEffect, useState } from 'react'
import { useConfigStore } from './store/configStore'
import { useCalculationStore, initializeCalculationStore } from './store/calculationStore'
import SettingsPanel from './components/SettingsPanel'
import StatsDisplay from './components/StatsDisplay'
import ScreenVisualizer from './components/ScreenVisualizer'
import Footer from './components/Footer'

export default function App() {
  // Get configuration state from configStore
  const activeConfigId = useConfigStore(state => state.activeConfigId)
  const setActiveConfigId = useConfigStore(state => state.setActiveConfigId)
  const hasComparisonConfig = useConfigStore(state => state.hasComparisonConfig())
  const addComparisonConfig = useConfigStore(state => state.addComparisonConfig)
  const removeComparisonConfig = useConfigStore(state => state.removeComparisonConfig)

  // Get configs for display
  const mainConfig = useConfigStore(state => state.configs.main)
  const comparisonConfig = useConfigStore(state => state.configs.comparison)

  // Get calculated results from calculationStore
  const { mainData, mainView, comparisonData, comparisonView } = useCalculationStore()

  // UI state for animation
  const [isAnimating, setIsAnimating] = useState(false)

  // Initialize calculation store on first render and clean up on unmount
  useEffect(() => {
    const unsubscribe = useCalculationStore.getState().setupSubscriptions()
    initializeCalculationStore()

    // Clean up subscription when component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  // Handle animation when active config changes
  useEffect(() => {
    if (hasComparisonConfig) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [activeConfigId, hasComparisonConfig, setIsAnimating])

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
        hasComparisonConfig={hasComparisonConfig}
        activeConfigId={activeConfigId}
        isAnimating={isAnimating}
      />

      <StatsDisplay
        mainData={mainData}
        comparisonData={comparisonData}
        mainConfig={mainConfig}
        comparisonConfig={comparisonConfig}
        onAddComparisonConfig={addComparisonConfig}
        activeConfigId={activeConfigId}
        setActiveConfigId={setActiveConfigId}
        isAnimating={isAnimating}
        removeComparisonConfig={removeComparisonConfig}
      />

      <ScreenVisualizer
        view={mainView}
        comparisonView={hasComparisonConfig ? comparisonView : null}
      />

      <Footer />
    </div>
  )
}
