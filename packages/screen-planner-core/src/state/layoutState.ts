import { computed, signal } from '@preact/signals'
import type { ScreenConfigState } from '../input/types'
import { createLayout } from '../layout/createLayout'
import { createCalculationState } from './calculationState'
import { isDevelopment } from '../utils/environment'

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

export function createLayoutState(config: ScreenConfigState) {
  const calculations = createCalculationState(config)
  const debugEnabled = signal(
    isDevelopment && isLocalStorageAvailable()
      ? localStorage.getItem('simrigDebug') === 'true'
      : false
  )

  const toggleDebug = () => {
    if (!isDevelopment) return
    debugEnabled.value = !debugEnabled.value
    if (isLocalStorageAvailable()) {
      localStorage.setItem('simrigDebug', debugEnabled.value.toString())
    }
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
