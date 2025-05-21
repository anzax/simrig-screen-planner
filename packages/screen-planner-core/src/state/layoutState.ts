import { computed, signal } from '@preact/signals'
import type { ScreenConfigState } from '../input/types'
import { createLayout } from '../layout/createLayout'
import { createCalculationState } from './calculationState'
import { isDevelopment } from '../utils/environment'

export function createLayoutState(config: ScreenConfigState) {
  const calculations = createCalculationState(config)
  const debugEnabled = signal(
    isDevelopment ? localStorage.getItem('simrigDebug') === 'true' : false
  )

  const toggleDebug = () => {
    if (!isDevelopment) return
    debugEnabled.value = !debugEnabled.value
    localStorage.setItem('simrigDebug', debugEnabled.value.toString())
  }

  const layout = computed(() => {
    const baseLayout = createLayout(config, calculations.results.value)
    if (isDevelopment && debugEnabled.value) {
      return { ...baseLayout, debug: { ...baseLayout.debug, enabled: true } }
    }
    return { ...baseLayout, debug: { ...baseLayout.debug, enabled: false } }
  })

  return {
    layout,
    debugEnabled,
    toggleDebug,
  }
}
