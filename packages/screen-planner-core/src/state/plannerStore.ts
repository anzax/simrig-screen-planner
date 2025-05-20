import { signal, computed } from '@preact/signals'
import { createScreenConfigState } from './screenConfig'

export type ConfigId = 'main' | 'comparison'
export type PlannerConfig = ReturnType<typeof createScreenConfigState>

export const createScreenPlannerState = () => {
  const configs = {
    main: createScreenConfigState(),
    comparison: signal<PlannerConfig | null>(null),
  }

  const activeConfigId = signal<ConfigId>('main')
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
