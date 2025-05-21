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
    const parts = vis.svgProps.viewBox.split(' ').map(Number)
    expect(parts.length).toBe(4)
  })

  it('projects rig base', () => {
    const cfg = createScreenConfigState()
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    const vis = createVisualization(layout, { width: 800, height: 600 })
    expect(vis.rigBase.width).toBeGreaterThan(0)
    expect(vis.rigBase.corners.length).toBe(4)
  })
})
