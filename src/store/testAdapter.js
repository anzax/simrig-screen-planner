// testAdapter.js - FOR TESTS ONLY
import { useSettingsStore, useUIStore } from './settingsStore'
import { useConfigStore } from './configStore'

/**
 * TEST ONLY: Set legacy flat state format for tests
 * This keeps tests working without changing main code
 */
export function setLegacyTestState(flatState) {
  // Map flat state to new structure for the settings store
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

  // Also update the new configStore for compatibility
  const configState = {
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
    ui: {
      inputMode: flatState.inputMode ?? 'diagonal',
      angleMode: flatState.angleMode ?? 'auto',
    },
    version: '1.0',
  }

  useConfigStore.setState({
    configs: {
      main: configState,
      comparison: null,
    },
    activeConfigId: 'main',
    version: '1.0',
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
  // Get state from both stores
  const { screen, distance, layout, curvature } = useSettingsStore.getState()
  const { inputMode, angleMode } = useUIStore.getState()
  const configState = useConfigStore.getState()

  // Return the state from the configStore for tests
  const mainConfig = configState.configs.main
  return {
    diagIn: mainConfig.screen.diagIn,
    ratio: mainConfig.screen.ratio,
    bezelMm: mainConfig.screen.bezelMm,
    screenWidth: mainConfig.screen.screenWidth,
    screenHeight: mainConfig.screen.screenHeight,
    distCm: mainConfig.distance.distCm,
    setupType: mainConfig.layout.setupType,
    manualAngle: mainConfig.layout.manualAngle,
    isCurved: mainConfig.curvature.isCurved,
    curveRadius: mainConfig.curvature.curveRadius,
    inputMode: mainConfig.ui?.inputMode || 'diagonal',
    angleMode: mainConfig.ui?.angleMode || 'auto',
  }
}
