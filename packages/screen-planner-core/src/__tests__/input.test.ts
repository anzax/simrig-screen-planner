import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '../input/screenConfig'

describe('createScreenConfigState', () => {
  it('initializes with default values', () => {
    const cfg = createScreenConfigState()
    expect(cfg.size.diagonal.value).toBe(32)
    expect(cfg.size.aspectRatio.value).toBe('16:9')
    expect(cfg.bezel.width.value).toBe(0)
    expect(cfg.distance.eye.value).toBe(600)
    expect(cfg.arrangement.type.value).toBe('triple')
  })

  it('signals update correctly', () => {
    const cfg = createScreenConfigState()
    cfg.size.diagonal.value = 27
    cfg.arrangement.manualAngle.value = 45
    expect(cfg.size.diagonal.value).toBe(27)
    expect(cfg.arrangement.manualAngle.value).toBe(45)
  })
})
