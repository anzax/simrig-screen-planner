import { computed } from '@preact/signals'
import type { ScreenConfigState } from '../input/types'
import { calculateResults } from '../calculation/screenCalculations'

export function createCalculationState(config: ScreenConfigState) {
  const results = computed(() => calculateResults(config))
  return {
    results,
    dimensions: computed(() => results.value.dimensions),
    angles: computed(() => results.value.angles),
    fov: computed(() => results.value.fov),
    footprint: computed(() => results.value.footprint),
    curvature: computed(() => results.value.curvature),
  }
}
