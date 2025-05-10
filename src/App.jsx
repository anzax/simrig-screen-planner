import React, { useState, useEffect } from 'react'
import { useConfigStore } from './store/configStore'
import { useScreenCalculations } from './hooks/useScreenCalculations'
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
  
  // Get configs for calculations and display
  const mainConfig = useConfigStore(state => state.configs.main)
  const comparisonConfig = useConfigStore(state => state.configs.comparison)
  
  // Get active configuration - no longer need separate UI state
  const activeConfig = useConfigStore(state => {
    const { configs, activeConfigId } = state;
    return configs[activeConfigId] || configs.main;
  });
  
  // Animation state for UI feedback
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Debug effect to log state changes during add/remove
  useEffect(() => {
    console.log('Config change detected:', {
      hasComparison: hasComparisonConfig,
      activeConfigId,
    });
  }, [hasComparisonConfig, activeConfigId]);

  // Handle animation when active config changes
  useEffect(() => {
    if (hasComparisonConfig) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [activeConfigId, hasComparisonConfig])

  // Calculate main configuration
  const { data: mainData, view: mainView } = useScreenCalculations(
    mainConfig.screen.diagIn,
    mainConfig.screen.ratio,
    mainConfig.distance.distCm,
    mainConfig.screen.bezelMm,
    mainConfig.layout.setupType,
    mainConfig.ui?.angleMode || 'auto',
    mainConfig.layout.manualAngle,
    mainConfig.ui?.inputMode || 'diagonal',
    mainConfig.screen.screenWidth,
    mainConfig.screen.screenHeight,
    mainConfig.curvature.isCurved,
    mainConfig.curvature.curveRadius
  )
  
  // Calculate comparison configuration if it exists
  let comparisonData = null;
  let comparisonView = null;
  
  if (comparisonConfig) {
    try {
      const result = useScreenCalculations(
        comparisonConfig.screen.diagIn,
        comparisonConfig.screen.ratio,
        comparisonConfig.distance.distCm,
        comparisonConfig.screen.bezelMm,
        comparisonConfig.layout.setupType,
        comparisonConfig.ui?.angleMode || 'auto',
        comparisonConfig.layout.manualAngle,
        comparisonConfig.ui?.inputMode || 'diagonal',
        comparisonConfig.screen.screenWidth,
        comparisonConfig.screen.screenHeight,
        comparisonConfig.curvature.isCurved,
        comparisonConfig.curvature.curveRadius
      );
      comparisonData = result.data;
      comparisonView = result.view;
    } catch (error) {
      console.error('Error calculating comparison:', error);
      comparisonData = null;
      comparisonView = null;
    }
  }

  // Use the active config's view for visualization
  const activeView = activeConfigId === 'main' ? mainView : (comparisonView || mainView)

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

      <ScreenVisualizer view={activeView} />

      <Footer />
    </div>
  )
}
