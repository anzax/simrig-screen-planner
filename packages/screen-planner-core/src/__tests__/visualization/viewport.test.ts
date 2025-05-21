import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '../../input/screenConfig'
import { calculateResults } from '../../calculation/screenCalculations'
import { createLayout } from '../../layout/createLayout'
import { createViewport } from '../../visualization/viewport'

function buildLayout() {
  const cfg = createScreenConfigState()
  cfg.arrangement.type.value = 'single'
  const calc = calculateResults(cfg)
  return createLayout(cfg, calc)
}

describe('createViewport', () => {
  it('fits layout with margin', () => {
    const layout = buildLayout()
    const viewport = createViewport(layout, { width: 800, height: 600 })

    const minX = Math.min(layout.bounds.min.x, layout.bounds.max.x)
    const maxX = Math.max(layout.bounds.min.x, layout.bounds.max.x)
    const minY = Math.min(-layout.bounds.max.z, -layout.bounds.min.z)
    const maxY = Math.max(-layout.bounds.max.z, -layout.bounds.min.z)
    const width = maxX - minX
    const height = maxY - minY

    const expectedScale = Math.min(800 / (width * 1.1), 600 / (height * 1.1))
    const expectedCenter = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }

    expect(viewport.scale).toBeCloseTo(expectedScale, 5)
    expect(viewport.center.x).toBeCloseTo(expectedCenter.x, 5)
    expect(viewport.center.y).toBeCloseTo(expectedCenter.y, 5)
  })
})
