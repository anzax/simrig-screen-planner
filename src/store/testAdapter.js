// testAdapter.js - FOR TESTS ONLY
import { useSettingsStore } from './settingsStore'
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

  // UI state is now set directly in configStore, no separate UI store needed
}

/**
 * TEST ONLY: Get legacy flat state format for assertions
 */
export function getLegacyTestState() {
  // Get state from configStore only (settings store retained for backward compatibility)
  // const { screen, distance, layout, curvature } = useSettingsStore.getState()
  const configState = useConfigStore.getState()
  // Get UI state from configStore instead
  // These variables are not used anymore, we directly extract them below
  // const { inputMode, angleMode } = configState.configs.main.ui || {
  //   inputMode: 'diagonal',
  //   angleMode: 'auto',
  // }

  // Return the state from the configStore for tests
  const mainConfig = configState.configs.main
  const { screen, distance, layout, curvature } = mainConfig
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
    inputMode: mainConfig.ui?.inputMode || 'diagonal',
    angleMode: mainConfig.ui?.angleMode || 'auto',
  }
}
