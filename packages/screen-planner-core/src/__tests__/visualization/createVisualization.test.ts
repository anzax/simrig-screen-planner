import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '../../input/screenConfig'
import { calculateResults } from '../../calculation/screenCalculations'
import { createLayout } from '../../layout/createLayout'
import { createVisualization } from '../../visualization/createVisualization'

describe('createVisualization', () => {
  it('returns visualization data with screens and viewport', () => {
    const cfg = createScreenConfigState()
    cfg.arrangement.type.value = 'triple'
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    const vis = createVisualization(layout, { width: 800, height: 600 })

    expect(vis.screens.length).toBe(3)
    expect(vis.viewport.width).toBe(800)
    expect(vis.svgProps.viewBox).toBe('0 0 800 600')
  })
})
