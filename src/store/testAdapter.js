// testAdapter.js - FOR TESTS ONLY
import { useSettingsStore, useUIStore } from './settingsStore'

/**
 * TEST ONLY: Set legacy flat state format for tests
 * This keeps tests working without changing main code
 */
export function setLegacyTestState(flatState) {
  // Map flat state to new structure
  useSettingsStore.setState({
    screen: {
      diagIn: flatState.diagIn ?? 32,
      ratio: flatState.ratio ?? '16:9',
      bezelMm: flatState.bezelMm ?? 0,
      screenWidth: flatState.screenWidth ?? 700,
      screenHeight: flatState.screenHeight ?? 400,
    },
    distance: {
      distCm: flatState.distCm ?? 60,
    },
    layout: {
      setupType: flatState.setupType ?? 'triple',
      manualAngle: flatState.manualAngle ?? 60,
    },
    curvature: {
      isCurved: flatState.isCurved ?? false,
      curveRadius: flatState.curveRadius ?? 1000,
    },
    version: '2.0',
  })

  // Set UI state if provided
  if (flatState.inputMode || flatState.angleMode) {
    useUIStore.setState({
      inputMode: flatState.inputMode ?? 'diagonal',
      angleMode: flatState.angleMode ?? 'auto',
      version: '2.0',
    })
  }
}

/**
 * TEST ONLY: Get legacy flat state format for assertions
 */
export function getLegacyTestState() {
  const { screen, distance, layout, curvature } = useSettingsStore.getState()
  const { inputMode, angleMode } = useUIStore.getState()

  return {
    diagIn: screen.diagIn,
    ratio: screen.ratio,
    bezelMm: screen.bezelMm,
    screenWidth: screen.screenWidth,
    screenHeight: screen.screenHeight,
    distCm: distance.distCm,
    setupType: layout.setupType,
    manualAngle: layout.manualAngle,
    isCurved: curvature.isCurved,
    curveRadius: curvature.curveRadius,
    inputMode,
    angleMode,
  }
}
