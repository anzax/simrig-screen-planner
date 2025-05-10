import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { clone } from '../utils/helpers'

// Current store version - increment when breaking changes occur
const STORE_VERSION = '1.0'

// Default domain state structure - keeping this directly in configStore for simplicity
export const defaultConfigState = {
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
  ui: {
    inputMode: 'diagonal',
    angleMode: 'auto',
  },
  version: STORE_VERSION,
}

// Default configs state with main configuration
const defaultConfigsState = {
  configs: {
    main: { ...defaultConfigState },
    comparison: null,
  },
  activeConfigId: 'main',
  version: STORE_VERSION,
}

/**
 * Store for managing multiple screen configurations
 */
export const useConfigStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Configs state
        ...defaultConfigsState,

        // Getters
        getActiveConfig: () => {
          const { configs, activeConfigId } = get()
          return configs[activeConfigId] || configs.main
        },

        hasComparisonConfig: () => {
          const { configs } = get()
          return configs.comparison !== null
        },

        // Actions
        setActiveConfigId: (configId) => {
          const { configs } = get()
          if (configs[configId]) {
            set({ activeConfigId: configId })
          }
        },

        addComparisonConfig: () => {
          try {
            // Create a comparison config with some differences to highlight the comparison
            const { configs } = get()
            const baseConfig = clone(configs.main)
            
            // Make some interesting differences to highlight comparison
            const comparisonConfig = {
              ...baseConfig,
              screen: {
                ...baseConfig.screen,
                diagIn: 40, // Fixed value to make tests predictable
                ratio: baseConfig.screen.ratio === '16:9' ? '21:9' : '16:9', // Different ratio
              },
              curvature: {
                ...baseConfig.curvature,
                isCurved: true, // Always true for comparison
              },
              ui: { ...baseConfig.ui } // Clone UI settings
            }
            
            set({
              configs: { ...configs, comparison: comparisonConfig },
              activeConfigId: 'comparison',
            })
            console.log('Added comparison config')
          } catch (error) {
            console.error('Error adding comparison:', error)
          }
        },

        removeComparisonConfig: () => {
          try {
            set(state => {
              console.log('Removing comparison config');
              return {
                configs: { ...state.configs, comparison: null },
                activeConfigId: 'main',
              };
            });
          } catch (error) {
            console.error('Error removing comparison:', error);
          }
        },

        // Individual property setters for active config
        setScreenProperty: (property, value) => {
          const { configs, activeConfigId } = get()
          set({
            configs: {
              ...configs,
              [activeConfigId]: {
                ...configs[activeConfigId],
                screen: {
                  ...configs[activeConfigId].screen,
                  [property]: value,
                }
              }
            }
          })
        },

        setDistanceProperty: (property, value) => {
          const { configs, activeConfigId } = get()
          set({
            configs: {
              ...configs,
              [activeConfigId]: {
                ...configs[activeConfigId],
                distance: {
                  ...configs[activeConfigId].distance,
                  [property]: value,
                }
              }
            }
          })
        },

        setLayoutProperty: (property, value) => {
          const { configs, activeConfigId } = get()
          set({
            configs: {
              ...configs,
              [activeConfigId]: {
                ...configs[activeConfigId],
                layout: {
                  ...configs[activeConfigId].layout,
                  [property]: value,
                }
              }
            }
          })
        },

        setCurvatureProperty: (property, value) => {
          const { configs, activeConfigId } = get()
          set({
            configs: {
              ...configs,
              [activeConfigId]: {
                ...configs[activeConfigId],
                curvature: {
                  ...configs[activeConfigId].curvature,
                  [property]: value,
                }
              }
            }
          })
        },

        // UI property setters
        setUIProperty: (property, value) => {
          const { configs, activeConfigId } = get();
          set({
            configs: {
              ...configs,
              [activeConfigId]: {
                ...configs[activeConfigId],
                ui: {
                  ...configs[activeConfigId].ui,
                  [property]: value,
                },
              },
            },
          });
        },

        // Specific setter functions for common properties
        setDiagIn: (value) => get().setScreenProperty('diagIn', value),
        setRatio: (value) => get().setScreenProperty('ratio', value),
        setBezelMm: (value) => get().setScreenProperty('bezelMm', value),
        setScreenWidth: (value) => get().setScreenProperty('screenWidth', value),
        setScreenHeight: (value) => get().setScreenProperty('screenHeight', value),
        setDistCm: (value) => get().setDistanceProperty('distCm', value),
        setSetupType: (value) => get().setLayoutProperty('setupType', value),
        setManualAngle: (value) => get().setLayoutProperty('manualAngle', value),
        setIsCurved: (value) => get().setCurvatureProperty('isCurved', value),
        setCurveRadius: (value) => get().setCurvatureProperty('curveRadius', value),
        setInputMode: (value) => get().setUIProperty('inputMode', value),
        setAngleMode: (value) => get().setUIProperty('angleMode', value),
      }),
      {
        name: 'simrig-screen-configs',
        onRehydrateStorage: () => {
          // Just use defaults if there's any issue with stored state
          return defaultConfigsState
        },
      }
    )
  )
)
