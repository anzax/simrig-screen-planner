import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../settingsStore'

describe('Settings Store', () => {
  // Reset store to initial state before each test
  beforeEach(() => {
    useSettingsStore.setState({
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
    const state = useSettingsStore.getState()

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
    const { setDiagIn, setRatio, setSetupType, setIsCurved } = useSettingsStore.getState()

    // Test updating diagonal size
    setDiagIn(27)
    expect(useSettingsStore.getState().diagIn).toBe(27)

    // Test updating aspect ratio
    setRatio('21:9')
    expect(useSettingsStore.getState().ratio).toBe('21:9')

    // Test updating setup type
    setSetupType('single')
    expect(useSettingsStore.getState().setupType).toBe('single')

    // Test toggling curved screen
    setIsCurved(true)
    expect(useSettingsStore.getState().isCurved).toBe(true)
  })

  it('should handle related state changes correctly', () => {
    const { setInputMode, setAngleMode } = useSettingsStore.getState()

    // Test changing input mode
    setInputMode('manual')
    expect(useSettingsStore.getState().inputMode).toBe('manual')

    // Test changing angle mode
    setAngleMode('manual')
    expect(useSettingsStore.getState().angleMode).toBe('manual')
  })
})
