import { describe, it, expect, beforeEach } from 'vitest'
import { useConfigStore, defaultConfigState } from '../configStore'

describe('Config Store', () => {
  // Reset store to initial state before each test
  beforeEach(() => {
    const store = useConfigStore.getState()
    useConfigStore.setState({
      configs: {
        main: { ...defaultConfigState },
        comparison: null,
      },
      activeConfigId: 'main',
      version: '1.0',
    })
  })

  it('should initialize with correct default values', () => {
    const state = useConfigStore.getState()
    
    // Test initial structure
    expect(state.configs.main).toEqual(defaultConfigState)
    expect(state.configs.comparison).toBeNull()
    expect(state.activeConfigId).toBe('main')
    expect(state.version).toBe('1.0')
    
    // Test initial active config
    expect(state.getActiveConfig()).toEqual(defaultConfigState)
    expect(state.hasComparisonConfig()).toBe(false)
  })

  it('should add a comparison configuration', () => {
    const { addComparisonConfig } = useConfigStore.getState()
    
    // Add comparison config
    addComparisonConfig()
    
    const state = useConfigStore.getState()
    
    // Test comparison config was added
    expect(state.configs.comparison).not.toBeNull()
    expect(state.activeConfigId).toBe('comparison')
    expect(state.hasComparisonConfig()).toBe(true)
    
    // Verify some expected differences in the comparison config
    const main = state.configs.main
    const comparison = state.configs.comparison
    
    // Screen size should be different
    expect(comparison.screen.diagIn).not.toBe(main.screen.diagIn)
    
    // Ratio should be different if main is 16:9
    if (main.screen.ratio === '16:9') {
      expect(comparison.screen.ratio).toBe('21:9')
    } else {
      expect(comparison.screen.ratio).toBe('16:9')
    }
    
    // Curvature should be toggled
    expect(comparison.curvature.isCurved).toBe(!main.curvature.isCurved)
  })

  it('should remove a comparison configuration', () => {
    const { addComparisonConfig, removeComparisonConfig } = useConfigStore.getState()
    
    // Add and then remove comparison config
    addComparisonConfig()
    removeComparisonConfig()
    
    const state = useConfigStore.getState()
    
    // Test comparison config was removed
    expect(state.configs.comparison).toBeNull()
    expect(state.activeConfigId).toBe('main')
    expect(state.hasComparisonConfig()).toBe(false)
  })

  it('should switch active configuration', () => {
    const { addComparisonConfig, setActiveConfigId } = useConfigStore.getState()
    
    // Add comparison config
    addComparisonConfig()
    
    // Switch back to main
    setActiveConfigId('main')
    
    const state = useConfigStore.getState()
    
    // Test active config changed
    expect(state.activeConfigId).toBe('main')
    expect(state.getActiveConfig()).toEqual(state.configs.main)
    
    // Switch back to comparison
    setActiveConfigId('comparison')
    expect(useConfigStore.getState().activeConfigId).toBe('comparison')
  })

  it('should update active configuration properties', () => {
    const { setDiagIn, setRatio, setDistCm, setIsCurved } = useConfigStore.getState()
    
    // Update main config properties
    setDiagIn(27)
    setRatio('21:9')
    setDistCm(80)
    setIsCurved(true)
    
    const mainConfig = useConfigStore.getState().configs.main
    
    // Verify updates
    expect(mainConfig.screen.diagIn).toBe(27)
    expect(mainConfig.screen.ratio).toBe('21:9')
    expect(mainConfig.distance.distCm).toBe(80)
    expect(mainConfig.curvature.isCurved).toBe(true)
    
    // Add comparison and update it
    useConfigStore.getState().addComparisonConfig()
    setDiagIn(35)
    setRatio('32:9')
    
    const comparisonConfig = useConfigStore.getState().configs.comparison
    
    // Verify only comparison was updated
    expect(comparisonConfig.screen.diagIn).toBe(35)
    expect(comparisonConfig.screen.ratio).toBe('32:9')
    expect(mainConfig.screen.diagIn).toBe(27)
    expect(mainConfig.screen.ratio).toBe('21:9')
  })
})
