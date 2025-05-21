import { signal, computed, effect } from '@preact/signals'
import { createScreenConfigState } from '../input/screenConfig'
import {
  ConfigId,
  loadScreenPlannerData,
  saveScreenPlannerData,
  serializeScreenConfig,
  deserializeScreenConfig,
  PERSISTENCE_VERSION,
  type ScreenPlannerData,
} from './persistence'

export type PlannerConfig = ReturnType<typeof createScreenConfigState>

export const createScreenPlannerState = () => {
  const stored = loadScreenPlannerData()

  const configs = {
    main: stored ? deserializeScreenConfig(stored.configs.main) : createScreenConfigState(),
    comparison: signal<PlannerConfig | null>(null),
  }

  if (stored?.configs.comparison) {
    configs.comparison.value = deserializeScreenConfig(stored.configs.comparison)
  }

  const activeConfigId = signal<ConfigId>(stored?.activeConfigId ?? 'main')
  const hasComparison = computed(() => configs.comparison.value !== null)

  const activeConfig = computed(() => {
    if (activeConfigId.value === 'comparison' && configs.comparison.value) {
      return configs.comparison.value
    }
    return configs.main
  })

  const setActiveConfigId = (id: ConfigId) => {
    if (id === 'comparison' && !configs.comparison.value) return
    activeConfigId.value = id
  }

  const addComparisonConfig = () => {
    if (!configs.comparison.value) {
      configs.comparison.value = createScreenConfigState()
    }
    activeConfigId.value = 'comparison'
  }

  const removeComparisonConfig = () => {
    configs.comparison.value = null
    activeConfigId.value = 'main'
  }

  effect(() => {
    const data: ScreenPlannerData = {
      version: PERSISTENCE_VERSION,
      activeConfigId: activeConfigId.value,
      configs: {
        main: serializeScreenConfig(configs.main),
        comparison: configs.comparison.value
          ? serializeScreenConfig(configs.comparison.value)
          : null,
      },
    }
    saveScreenPlannerData(data)
  })

  return {
    configs,
    activeConfigId,
    activeConfig,
    hasComparison,
    setActiveConfigId,
    addComparisonConfig,
    removeComparisonConfig,
  }
}

export const screenPlanner = createScreenPlannerState()
