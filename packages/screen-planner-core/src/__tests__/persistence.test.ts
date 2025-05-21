import { describe, it, expect, beforeEach } from 'vitest'
import { STORAGE_KEY, PERSISTENCE_VERSION, serializeScreenConfig } from '../state/persistence'
import { createScreenPlannerState } from '../state/plannerStore'
import { createScreenConfigState } from '../input/screenConfig'

function defaultSerialized() {
  const cfg = createScreenConfigState()
  cfg.size.diagonal.value = 27
  return {
    version: PERSISTENCE_VERSION,
    activeConfigId: 'main' as const,
    configs: {
      main: serializeScreenConfig(cfg),
      comparison: null,
    },
  }
}

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads state from localStorage', () => {
    const data = defaultSerialized()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    const state = createScreenPlannerState()
    expect(state.configs.main.size.diagonal.value).toBe(27)
  })

  it('saves state on change', () => {
    const state = createScreenPlannerState()
    state.configs.main.size.diagonal.value = 40
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(saved.configs.main.size.diagonal).toBe(40)
  })
})
