import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '../../input/screenConfig'
import { createLayout } from '../../layout/createLayout'
import { calculateResults } from '../../calculation/screenCalculations'

function baseConfig() {
  const cfg = createScreenConfigState()
  cfg.size.diagonal.value = 27
  cfg.arrangement.type.value = 'single'
  return cfg
}

describe('createLayout', () => {
  it('creates layout for single screen', () => {
    const cfg = baseConfig()
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    expect(layout.screens.length).toBe(1)
    expect(layout.viewPoint).toBeDefined()
    expect(layout.rigBase).toBeDefined()
    expect(layout.bounds).toBeDefined()
  })

  it('creates layout for triple screen', () => {
    const cfg = baseConfig()
    cfg.arrangement.type.value = 'triple'
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    expect(layout.screens.length).toBe(3)
    expect(layout.rigBase.width).toBeGreaterThan(0)
  })
})
