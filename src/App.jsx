import React, { useState, useEffect, useMemo } from 'react'
import { useConfigStore } from './store/configStore'
import SettingsPanel from './components/SettingsPanel'
import StatsDisplay from './components/StatsDisplay'
import ScreenVisualizer from './components/ScreenVisualizer'
import Footer from './components/Footer'

// Import the direct calculation functions
import { calculateScreenGeometry } from './utils/geometryCore'
import { calculateSvgLayout } from './utils/geometryUI'
import { RIG_CONSTANTS } from './utils/constants'

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
    const { configs, activeConfigId } = state
    return configs[activeConfigId] || configs.main
  })

  // Animation state for UI feedback
  const [isAnimating, setIsAnimating] = useState(false)

  // Debug effect to log state changes during add/remove
  useEffect(() => {
    console.log('Config change detected:', {
      hasComparison: hasComparisonConfig,
      activeConfigId,
    })
  }, [hasComparisonConfig, activeConfigId])

  // Handle animation when active config changes
  useEffect(() => {
    if (hasComparisonConfig) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [activeConfigId, hasComparisonConfig])

  // Memoize default objects to prevent unnecessary re-renders
  const defaultView = useMemo(
    () => ({
      widthPx: 800,
      heightPx: 400,
      rig: { x: 400, y: 350, w: 40, h: 40 },
      head: { x: 400, y: 350, r: 15 },
      screenEdges: [],
      lines: [],
      arcs: [],
    }),
    []
  )

  const defaultData = useMemo(
    () => ({
      sideAngleDeg: 60,
      hFOVdeg: 0,
      vFOVdeg: 0,
      cm: { totalWidth: 0 },
    }),
    []
  )

  // Create a stable calculation key that changes only when important values change
  const configKey = useMemo(() => {
    // Create a string key that captures all relevant values
    return JSON.stringify({
      main: {
        diagIn: mainConfig?.screen?.diagIn,
        ratio: mainConfig?.screen?.ratio,
        distCm: mainConfig?.distance?.distCm,
        bezelMm: mainConfig?.screen?.bezelMm,
        setupType: mainConfig?.layout?.setupType,
        manualAngle: mainConfig?.layout?.manualAngle,
        screenWidth: mainConfig?.screen?.screenWidth,
        screenHeight: mainConfig?.screen?.screenHeight,
        isCurved: mainConfig?.curvature?.isCurved,
        curveRadius: mainConfig?.curvature?.curveRadius,
        angleMode: mainConfig?.ui?.angleMode,
        inputMode: mainConfig?.ui?.inputMode,
      },
      comparison: comparisonConfig
        ? {
            diagIn: comparisonConfig?.screen?.diagIn,
            ratio: comparisonConfig?.screen?.ratio,
            distCm: comparisonConfig?.distance?.distCm,
            bezelMm: comparisonConfig?.screen?.bezelMm,
            setupType: comparisonConfig?.layout?.setupType,
            manualAngle: comparisonConfig?.layout?.manualAngle,
            screenWidth: comparisonConfig?.screen?.screenWidth,
            screenHeight: comparisonConfig?.screen?.screenHeight,
            isCurved: comparisonConfig?.curvature?.isCurved,
            curveRadius: comparisonConfig?.curvature?.curveRadius,
            angleMode: comparisonConfig?.ui?.angleMode,
            inputMode: comparisonConfig?.ui?.inputMode,
          }
        : null,
      hasComparisonConfig,
    })
  }, [mainConfig, comparisonConfig, hasComparisonConfig])

  // Fix hooks consistency with useMemo for calculations
  const [calculationResults, setCalculationResults] = useState({
    mainData: defaultData,
    mainView: defaultView,
    comparisonData: null,
    comparisonView: null,
  })

  // Direct calculation function that doesn't use hooks
  const calculateConfig = useMemo(() => {
    return config => {
      try {
        // If any required property is missing, return defaults
        if (!config || !config.screen || !config.distance) {
          return { data: defaultData, view: defaultView }
        }

        // Extract configuration with default fallbacks
        const {
          screen: { diagIn, ratio, bezelMm, screenWidth, screenHeight },
          distance: { distCm },
          layout: { setupType, manualAngle },
          curvature: { isCurved, curveRadius },
          ui,
        } = config

        // Calculate geometry data
        const data = calculateScreenGeometry({
          diagIn,
          ratio,
          distCm,
          bezelMm,
          setupType,
          angleMode: ui?.angleMode || 'auto',
          manualAngle,
          inputMode: ui?.inputMode || 'diagonal',
          screenWidth,
          screenHeight,
          isCurved,
          curveRadius,
        })

        // Calculate SVG layout for visualization
        const view = calculateSvgLayout(data.geom, RIG_CONSTANTS)

        return { data, view }
      } catch (error) {
        console.error('Calculation error:', error)
        return { data: defaultData, view: defaultView }
      }
    }
  }, [defaultData, defaultView])

  // Calculate configurations when configs change
  useEffect(() => {
    try {
      // Calculate main configuration
      const mainResult = calculateConfig(mainConfig)

      // Calculate comparison if it exists
      let comparisonResult = null
      if (comparisonConfig) {
        try {
          comparisonResult = calculateConfig(comparisonConfig)
        } catch (error) {
          console.error('Error calculating comparison:', error)
        }
      }

      // Update state with calculation results, preserving defaults if calculation fails
      setCalculationResults({
        mainData: mainResult?.data || defaultData,
        mainView: mainResult?.view || defaultView,
        comparisonData: comparisonResult?.data || null,
        comparisonView: comparisonResult?.view || null,
      })
    } catch (error) {
      console.error('Error in calculations:', error)
      // Don't update state on error to keep the default/previous values
    }
    // Only use configKey as dependency which will update when configs change
  }, [configKey, calculateConfig])

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
        mainData={calculationResults.mainData}
        comparisonData={calculationResults.comparisonData}
        mainConfig={mainConfig}
        comparisonConfig={comparisonConfig}
        onAddComparisonConfig={addComparisonConfig}
        activeConfigId={activeConfigId}
        setActiveConfigId={setActiveConfigId}
        isAnimating={isAnimating}
        removeComparisonConfig={removeComparisonConfig}
      />

      <ScreenVisualizer
        view={calculationResults.mainView}
        comparisonView={hasComparisonConfig ? calculationResults.comparisonView : null}
      />

      <Footer />
    </div>
  )
}
