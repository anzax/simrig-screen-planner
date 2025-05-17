// src/store/calculationStore.js
import { create } from 'zustand'
import { calculateScreenGeometry } from '../utils/geometryCore'
import { calculateSvgLayout } from '../utils/geometryUI'
import { useConfigStore } from './configStore'
import { RIG_CONSTANTS } from '../utils/constants'

// Default objects for fallback cases
const defaultGeometryData = {
  sideAngleDeg: 60,
  hFOVdeg: 0,
  vFOVdeg: 0,
  cm: { totalWidth: 0 },
}

const defaultSvgView = {
  widthPx: 800,
  heightPx: 400,
  screenEdges: [],
  lines: [],
  arcs: [],
}

/**
 * Store for calculating and storing derived state from configuration
 */
export const useCalculationStore = create((set, get) => ({
  // Calculated results
  mainData: defaultGeometryData,
  mainView: defaultSvgView,
  comparisonData: null,
  comparisonView: null,
  isAnimating: false,

  // Animation controls
  setIsAnimating: value => set({ isAnimating: value }),

  // Main calculation function
  calculateConfig: config => {
    try {
      // If any required property is missing, return defaults
      if (!config || !config.screen || !config.distance) {
        return { data: defaultGeometryData, view: defaultSvgView }
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
      return { data: defaultGeometryData, view: defaultSvgView }
    }
  },

  // Recalculate all results when configurations change
  recalculateAll: () => {
    const configStore = useConfigStore.getState()
    const { configs, hasComparisonConfig } = configStore

    // Calculate main config
    const mainResult = get().calculateConfig(configs.main)

    // Calculate comparison if it exists
    let comparisonResult = null
    if (hasComparisonConfig()) {
      comparisonResult = get().calculateConfig(configs.comparison)
    }

    // Update state with calculated results
    set({
      mainData: mainResult.data,
      mainView: mainResult.view,
      comparisonData: comparisonResult?.data || null,
      comparisonView: comparisonResult?.view || null,
    })
  },

  // Subscribe to config store changes to auto-recalculate
  setupSubscriptions: () => {
    // This should be called once when the app initializes
    const unsubscribe = useConfigStore.subscribe(
      () => {
        get().recalculateAll()
      },
      // Only run when these specific properties change
      state => [state.configs.main, state.configs.comparison, state.activeConfigId]
    )
    return unsubscribe // Return unsubscribe function for cleanup
  },
}))

// Set up the initial calculation and subscriptions
let subscriptionInitialized = false
export function initializeCalculationStore() {
  if (!subscriptionInitialized) {
    const calculationStore = useCalculationStore.getState()
    calculationStore.recalculateAll()
    calculationStore.setupSubscriptions()
    subscriptionInitialized = true
  }
}
