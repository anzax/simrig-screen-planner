import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '../input/screenConfig'
import { calculateResults, calculateScreenDimensions } from '../calculation/screenCalculations'

function defaultConfig() {
  const cfg = createScreenConfigState()
  cfg.size.diagonal.value = 27
  cfg.size.aspectRatio.value = '16:9'
  cfg.bezel.width.value = 10
  cfg.distance.eye.value = 700
  return cfg
}

describe('calculation functions', () => {
  it('calculates dimensions from diagonal', () => {
    const cfg = defaultConfig()
    const dims = calculateScreenDimensions(cfg)
    expect(dims.panel.width).toBeGreaterThan(500)
    expect(dims.panel.height).toBeGreaterThan(280)
  })

  it('calculates results with manual angle', () => {
    const cfg = defaultConfig()
    cfg.arrangement.angleMode.value = 'manual'
    cfg.arrangement.manualAngle.value = 30
    const result = calculateResults(cfg)
    expect(result.angles.actualSideAngle).toBe(30)
    expect(result.fov.horizontal).toBeGreaterThan(0)
  })

  it('includes curvature results when curved', () => {
    const cfg = defaultConfig()
    cfg.curvature.isCurved.value = true
    cfg.curvature.radius.value = 1000
    const result = calculateResults(cfg)
    expect(result.curvature).toBeDefined()
    expect(result.curvature?.radius).toBe(1000)
  })
})
