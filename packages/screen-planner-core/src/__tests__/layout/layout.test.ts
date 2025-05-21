import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '../../input/screenConfig'
import { createLayout } from '../../layout/createLayout'
import { createScreen } from '../../layout/entityFactory'
import { generateScreenDebugPoints, aggregateBounds } from '../../layout/debug'
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

  it('places side screens at roughly eye distance', () => {
    const cfg = baseConfig()
    cfg.arrangement.type.value = 'triple'
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    const d = cfg.distance.eye.value
    const left = layout.screens[1]
    const right = layout.screens[2]
    const distL = Math.hypot(left.position.x, left.position.z)
    const distR = Math.hypot(right.position.x, right.position.z)
    expect(distL).toBeCloseTo(d, 1)
    expect(distR).toBeCloseTo(d, 1)
  })

  it('rotates debug points with screen rotation', () => {
    const screen = createScreen({
      position: { x: 0, y: 0, z: -500 },
      rotation: { x: 0, y: 45, z: 0 },
      width: 600,
      height: 300,
      bezelWidth: 0,
      isCurved: false,
    })
    const points = generateScreenDebugPoints(screen)
    // rotated point should differ from axis-aligned expectation
    expect(points[0].position.x).not.toBeCloseTo(-300)
    expect(points[0].position.z).not.toBeCloseTo(-500)
  })

  it('aggregates bounds correctly', () => {
    const screen = createScreen({
      position: { x: 0, y: 0, z: -500 },
      rotation: { x: 0, y: 30, z: 0 },
      width: 600,
      height: 300,
      bezelWidth: 0,
      isCurved: false,
    })
    const points = generateScreenDebugPoints(screen)
    const eye = { x: 0, y: 0, z: 0 }
    const expected = aggregateBounds(points.map(p => p.position).concat(eye))
    expect(expected.min.x).toBeLessThan(expected.max.x)
    expect(expected.min.z).toBeLessThan(expected.max.z)
  })
})
