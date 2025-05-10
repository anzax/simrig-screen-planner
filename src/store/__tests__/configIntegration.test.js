import { describe, it, expect, beforeEach } from 'vitest'
import { useConfigStore, defaultConfigState } from '../configStore'
// No longer need to import useUIStore
import { useScreenCalculations } from '../../hooks/useScreenCalculations'

// Mock the useScreenCalculations hook
vi.mock('../../hooks/useScreenCalculations', () => ({
  useScreenCalculations: vi
    .fn()
    .mockImplementation(
      (
        diagIn,
        ratio,
        distCm,
        bezelMm,
        setupType,
        angleMode,
        manualAngle,
        inputMode,
        screenWidth,
        screenHeight,
        isCurved,
        curveRadius
      ) => {
        // Return simplified mock data for testing
        return {
          data: {
            sideAngleDeg: 45,
            hFOVdeg: 120,
            vFOVdeg: 45,
            cm: { totalWidth: 150 },
          },
          view: {
            /* mock view data */
          },
        }
      }
    ),
}))

describe('Config Store Integration', () => {
  // Reset store to initial state before each test
  beforeEach(() => {
    const configStore = useConfigStore.getState()
    useConfigStore.setState({
      configs: {
        main: { ...defaultConfigState },
        comparison: null,
      },
      activeConfigId: 'main',
      version: '1.0',
    })

    // UI settings are now in the configStore.configs.main.ui

    // Clear mocks
    vi.clearAllMocks()
  })

  it('should integrate with useScreenCalculations for main config', () => {
    // Get the main config
    const mainConfig = useConfigStore.getState().configs.main
    const uiState = mainConfig.ui || { inputMode: 'diagonal', angleMode: 'auto' }

    // Calculate using main config
    const { data, view } = useScreenCalculations(
      mainConfig.screen.diagIn,
      mainConfig.screen.ratio,
      mainConfig.distance.distCm,
      mainConfig.screen.bezelMm,
      mainConfig.layout.setupType,
      uiState.angleMode,
      mainConfig.layout.manualAngle,
      uiState.inputMode,
      mainConfig.screen.screenWidth,
      mainConfig.screen.screenHeight,
      mainConfig.curvature.isCurved,
      mainConfig.curvature.curveRadius
    )

    // Verify calculation was called correctly
    expect(useScreenCalculations).toHaveBeenCalledWith(
      32, // diagIn
      '16:9', // ratio
      60, // distCm
      0, // bezelMm
      'triple', // setupType
      'auto', // angleMode
      60, // manualAngle
      'diagonal', // inputMode
      700, // screenWidth
      400, // screenHeight
      false, // isCurved
      1000 // curveRadius
    )

    // Verify we got the expected results
    expect(data.sideAngleDeg).toBe(45)
    expect(data.hFOVdeg).toBe(120)
  })

  it('should support multiple configurations for comparison', () => {
    // Add a comparison config
    useConfigStore.getState().addComparisonConfig()

    // Get both configs
    const { configs, activeConfigId } = useConfigStore.getState()

    // Verify we have both configs and comparison is active
    expect(configs.main).toBeDefined()
    expect(configs.comparison).toBeDefined()
    expect(activeConfigId).toBe('comparison')

    // Modify the comparison config FIRST
    useConfigStore.getState().setDiagIn(40)
    useConfigStore.getState().setIsCurved(true)

    // Reset the mock to ensure we capture only the calls after our changes
    vi.clearAllMocks()

    // Calculate using comparison config - AFTER modifying it
    const comparisonConfig = useConfigStore.getState().configs.comparison // Get fresh config
    const uiState = comparisonConfig.ui || { inputMode: 'diagonal', angleMode: 'auto' }

    const { data } = useScreenCalculations(
      comparisonConfig.screen.diagIn,
      comparisonConfig.screen.ratio,
      comparisonConfig.distance.distCm,
      comparisonConfig.screen.bezelMm,
      comparisonConfig.layout.setupType,
      uiState.angleMode,
      comparisonConfig.layout.manualAngle,
      uiState.inputMode,
      comparisonConfig.screen.screenWidth,
      comparisonConfig.screen.screenHeight,
      comparisonConfig.curvature.isCurved,
      comparisonConfig.curvature.curveRadius
    )

    // Verify calculation was called with updated params
    expect(useScreenCalculations).toHaveBeenCalledWith(
      40, // diagIn (updated)
      expect.any(String), // ratio
      expect.any(Number), // distCm
      expect.any(Number), // bezelMm
      expect.any(String), // setupType
      expect.any(String), // angleMode
      expect.any(Number), // manualAngle
      expect.any(String), // inputMode
      expect.any(Number), // screenWidth
      expect.any(Number), // screenHeight
      true, // isCurved (updated)
      expect.any(Number) // curveRadius
    )

    // Switch back to main config
    useConfigStore.getState().setActiveConfigId('main')
    expect(useConfigStore.getState().activeConfigId).toBe('main')

    // Make changes to main config while comparison exists
    useConfigStore.getState().setDistCm(80)

    // Verify only main was updated
    expect(useConfigStore.getState().configs.main.distance.distCm).toBe(80)
    expect(useConfigStore.getState().configs.comparison.distance.distCm).not.toBe(80)

    // Remove comparison config
    useConfigStore.getState().removeComparisonConfig()
    expect(useConfigStore.getState().configs.comparison).toBeNull()
    expect(useConfigStore.getState().activeConfigId).toBe('main')
  })
})
