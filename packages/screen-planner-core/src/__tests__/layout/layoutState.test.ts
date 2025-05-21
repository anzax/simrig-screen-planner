import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '../../input/screenConfig'
import { createLayoutState } from '../../state/layoutState'

describe('createLayoutState', () => {
  it('toggles debug mode', () => {
    const cfg = createScreenConfigState()
    const state = createLayoutState(cfg)
    const initial = state.debugEnabled.value
    state.toggleDebug()
    expect(state.debugEnabled.value).not.toBe(initial)
  })
})
