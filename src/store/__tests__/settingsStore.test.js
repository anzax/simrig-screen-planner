import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../settingsStore'
import { useConfigStore } from '../configStore'
import { setLegacyTestState, getLegacyTestState } from '../testAdapter'

describe('Settings Store', () => {
  // Reset store to initial state before each test
  beforeEach(() => {
    setLegacyTestState({
      diagIn: 32,
      ratio: '16:9',
      distCm: 60,
      bezelMm: 0,
      inputMode: 'diagonal',
      setupType: 'triple',
      angleMode: 'auto',
      manualAngle: 60,
      screenWidth: 700,
      screenHeight: 400,
      isCurved: false,
      curveRadius: 1000,
    })
  })

  it('should initialize with correct default values', () => {
    const state = getLegacyTestState()

    // Test basic inputs
    expect(state.diagIn).toBe(32)
    expect(state.ratio).toBe('16:9')
    expect(state.distCm).toBe(60)
    expect(state.bezelMm).toBe(0)

    // Test enhanced inputs
    expect(state.inputMode).toBe('diagonal')
    expect(state.setupType).toBe('triple')
    expect(state.angleMode).toBe('auto')

    // Test curved screen options
    expect(state.isCurved).toBe(false)
  })

  it('should update state when actions are called', () => {
    const settingsStore = useSettingsStore.getState()
    const configStore = useConfigStore.getState()

    // Test updating diagonal size through configStore instead
    configStore.setDiagIn(27)
    expect(getLegacyTestState().diagIn).toBe(27)

    // Test updating aspect ratio
    configStore.setRatio('21:9')
    expect(getLegacyTestState().ratio).toBe('21:9')

    // Test updating setup type
    configStore.setSetupType('single')
    expect(getLegacyTestState().setupType).toBe('single')

    // Test toggling curved screen
    configStore.setIsCurved(true)
    expect(getLegacyTestState().isCurved).toBe(true)
  })

  it('should handle related state changes correctly', () => {
    // Set UI state directly in the configStore
    useConfigStore.setState(state => ({
      ...state,
      configs: {
        ...state.configs,
        main: {
          ...state.configs.main,
          ui: {
            ...state.configs.main.ui,
            inputMode: 'manual',
            angleMode: 'manual',
          },
        },
      },
    }))

    // Verify it was updated
    const configState = useConfigStore.getState()
    expect(configState.configs.main.ui.inputMode).toBe('manual')
    expect(configState.configs.main.ui.angleMode).toBe('manual')
  })
})
