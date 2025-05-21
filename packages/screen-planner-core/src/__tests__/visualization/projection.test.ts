import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '../../input/screenConfig'
import { calculateResults } from '../../calculation/screenCalculations'
import { createLayout } from '../../layout/createLayout'
import {
  projectScreen,
  projectViewPoint,
  projectRigBase,
} from '../../visualization/projections/topDown'

describe('topDown projection', () => {
  it('projects single screen and viewpoint', () => {
    const cfg = createScreenConfigState()
    cfg.arrangement.type.value = 'single'
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    const screenData = projectScreen(layout.screens[0])
    const viewData = projectViewPoint(layout.viewPoint)

    expect(screenData.centerPoint.x).toBeCloseTo(layout.screens[0].position.x, 5)
    expect(screenData.centerPoint.y).toBeCloseTo(layout.screens[0].position.z, 5)
    expect(screenData.rotation).toBeCloseTo(layout.screens[0].rotation.y, 5)
    expect(viewData.position.x).toBeCloseTo(layout.viewPoint.position.x, 5)
    expect(viewData.position.y).toBeCloseTo(layout.viewPoint.position.z, 5)
  })

  it('projects triple screen rotations', () => {
    const cfg = createScreenConfigState()
    cfg.arrangement.type.value = 'triple'
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    expect(layout.screens.length).toBe(3)
    const left = projectScreen(layout.screens[1])
    const center = projectScreen(layout.screens[0])
    const right = projectScreen(layout.screens[2])
    expect(left.rotation).toBeGreaterThan(0)
    expect(center.rotation).toBe(0)
    expect(right.rotation).toBeLessThan(0)
  })

  it('projects rig base corners', () => {
    const cfg = createScreenConfigState()
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    const base = projectRigBase(layout.rigBase)
    expect(base.corners.length).toBe(4)
    expect(base.centerPoint.x).toBeCloseTo(layout.rigBase.position.x, 5)
    expect(base.centerPoint.y).toBeCloseTo(layout.rigBase.position.z, 5)
  })

  it('orders screen corners sequentially', () => {
    const cfg = createScreenConfigState()
    const calc = calculateResults(cfg)
    const layout = createLayout(cfg, calc)
    const proj = projectScreen(layout.screens[0])
    const { width } = layout.screens[0]
    const hw = width / 2
    const expectedX = [-hw, hw, hw, -hw]
    const rel = proj.corners.map(c => ({
      x: c.x - proj.centerPoint.x,
      y: c.y - proj.centerPoint.y,
    }))
    expectedX.forEach((x, i) => {
      expect(rel[i].x).toBeCloseTo(x, 5)
      expect(rel[i].y).toBeCloseTo(0, 5)
    })
  })
})
