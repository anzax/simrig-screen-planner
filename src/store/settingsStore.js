import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

// Current store version - increment when breaking changes occur
const STORE_VERSION = '2.0'

// Default domain state structure
export const defaultDomainState = {
  screen: {
    diagIn: 32,
    ratio: '16:9',
    bezelMm: 0,
    screenWidth: 700,
    screenHeight: 400,
  },
  distance: {
    distCm: 60,
  },
  layout: {
    setupType: 'triple',
    manualAngle: 60,
  },
  curvature: {
    isCurved: false,
    curveRadius: 1000,
  },
  // Version tracking
  version: STORE_VERSION,
}

// Note: UI state is now maintained in configStore.js per-configuration

/**
 * Main domain data store for screen configuration
 */
export const useSettingsStore = create(
  devtools(
    persist(
      set => ({
        // Domain state
        ...defaultDomainState,

        // Group-level setters
        setScreen: updates =>
          set(state => ({
            screen: { ...state.screen, ...updates },
          })),

        setDistance: updates =>
          set(state => ({
            distance: { ...state.distance, ...updates },
          })),

        setLayout: updates =>
          set(state => ({
            layout: { ...state.layout, ...updates },
          })),

        setCurvature: updates =>
          set(state => ({
            curvature: { ...state.curvature, ...updates },
          })),

        // Individual property setters
        setDiagIn: value =>
          set(state => ({
            screen: { ...state.screen, diagIn: value },
          })),

        setRatio: value =>
          set(state => ({
            screen: { ...state.screen, ratio: value },
          })),

        setBezelMm: value =>
          set(state => ({
            screen: { ...state.screen, bezelMm: value },
          })),

        setScreenWidth: value =>
          set(state => ({
            screen: { ...state.screen, screenWidth: value },
          })),

        setScreenHeight: value =>
          set(state => ({
            screen: { ...state.screen, screenHeight: value },
          })),

        setDistCm: value =>
          set(state => ({
            distance: { ...state.distance, distCm: value },
          })),

        setSetupType: value =>
          set(state => ({
            layout: { ...state.layout, setupType: value },
          })),

        setManualAngle: value =>
          set(state => ({
            layout: { ...state.layout, manualAngle: value },
          })),

        setIsCurved: value =>
          set(state => ({
            curvature: { ...state.curvature, isCurved: value },
          })),

        setCurveRadius: value =>
          set(state => ({
            curvature: { ...state.curvature, curveRadius: value },
          })),
      }),
      {
        name: 'triple-screen-settings',
        onRehydrateStorage: state => {
          // Reset to defaults if version mismatch
          if (!state || state.version !== STORE_VERSION) {
            return defaultDomainState
          }
          return state
        },
      }
    )
  )
)
