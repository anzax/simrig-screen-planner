// src/utils/__tests__/geometry.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { calculateScreenGeometry, calculateSvgLayout } from '../geometry'
import { RIG_CONSTANTS } from '../constants'

describe('calculateScreenGeometry', () => {
  // Test standard 16:9 monitor setup
  it('calculates correct geometry for 27" 16:9 monitors', () => {
    const result = calculateScreenGeometry(27, '16:9', 70, 10)

    // Check that all expected properties are returned
    expect(result).toHaveProperty('sideAngleDeg')
    expect(result).toHaveProperty('hFOVdeg')
    expect(result).toHaveProperty('vFOVdeg')
    expect(result).toHaveProperty('cm')
    expect(result).toHaveProperty('geom')

    // Verify specific values with reasonable precision
    expect(result.sideAngleDeg).toBeCloseTo(49.1, 1)
    expect(result.hFOVdeg).toBeCloseTo(142, 0)
    expect(result.vFOVdeg).toBeCloseTo(27, 0)

    // Check cm object properties
    expect(result.cm.distance).toBe(70)
    expect(result.cm.bezel).toBe(10)
    expect(result.cm.totalWidth).toBeGreaterThan(0)

    // Check geometry object properties
    expect(result.geom.pivotL.x).toBeLessThan(0)
    expect(result.geom.pivotR.x).toBeGreaterThan(0)
  })

  // Test ultrawide 21:9 monitor setup
  it('calculates correct geometry for 34" 21:9 monitors', () => {
    const result = calculateScreenGeometry(34, '21:9', 75, 15)

    expect(result.sideAngleDeg).toBeCloseTo(59.4, 1)
    expect(result.hFOVdeg).toBeGreaterThan(150)
    expect(result.vFOVdeg).toBeLessThan(30)

    // Check that total width is calculated correctly
    expect(result.cm.totalWidth).toBeGreaterThan(0)
  })

  // Test with different bezel sizes
  it('adjusts calculations based on bezel size', () => {
    const smallBezel = calculateScreenGeometry(27, '16:9', 70, 5)
    const largeBezel = calculateScreenGeometry(27, '16:9', 70, 20)

    // Smaller bezel results in wider total width
    expect(smallBezel.cm.totalWidth).toBeGreaterThan(largeBezel.cm.totalWidth)

    // Larger bezel should affect the horizontal FOV
    expect(largeBezel.hFOVdeg).toBeGreaterThan(smallBezel.hFOVdeg)
  })

  // Test with different viewing distances
  it('adjusts calculations based on viewing distance', () => {
    const closeDistance = calculateScreenGeometry(27, '16:9', 50, 10)
    const farDistance = calculateScreenGeometry(27, '16:9', 100, 10)

    // Closer distance should result in larger FOV
    expect(closeDistance.hFOVdeg).toBeGreaterThan(farDistance.hFOVdeg)
    expect(closeDistance.vFOVdeg).toBeGreaterThan(farDistance.vFOVdeg)

    // Closer distance should result in larger side angle
    expect(closeDistance.sideAngleDeg).toBeGreaterThan(farDistance.sideAngleDeg)
  })
})

describe('calculateSvgLayout', () => {
  let geomData

  beforeEach(() => {
    // Create sample geometry data for testing
    geomData = calculateScreenGeometry(27, '16:9', 70, 10).geom
  })

  it('calculates correct SVG dimensions', () => {
    const result = calculateSvgLayout(geomData, RIG_CONSTANTS)

    // Check that all expected properties are returned
    expect(result).toHaveProperty('widthPx')
    expect(result).toHaveProperty('heightPx')
    expect(result).toHaveProperty('head')
    expect(result).toHaveProperty('lines')
    expect(result).toHaveProperty('rig')

    // Verify dimensions are positive numbers
    expect(result.widthPx).toBeGreaterThan(0)
    expect(result.heightPx).toBeGreaterThan(0)

    // Check head circle properties
    expect(result.head).toHaveProperty('cx')
    expect(result.head).toHaveProperty('cy')
    expect(result.head).toHaveProperty('r')
    expect(result.head.r).toBe(20)

    // Check lines array
    expect(result.lines).toHaveLength(3)
    result.lines.forEach(line => {
      expect(line).toHaveProperty('x1')
      expect(line).toHaveProperty('y1')
      expect(line).toHaveProperty('x2')
      expect(line).toHaveProperty('y2')
    })

    // Check rig rectangle properties
    expect(result.rig).toHaveProperty('x')
    expect(result.rig).toHaveProperty('y')
    expect(result.rig).toHaveProperty('w')
    expect(result.rig).toHaveProperty('h')
  })

  it('scales SVG layout correctly', () => {
    const result = calculateSvgLayout(geomData, RIG_CONSTANTS)

    // Check that rig dimensions are scaled correctly
    // Scale factor is 8 as defined in the function
    const scale = 8
    expect(result.rig.w).toBeCloseTo((RIG_CONSTANTS.RIG_W_CM / 2.54) * scale, 1)
    expect(result.rig.h).toBeCloseTo((RIG_CONSTANTS.RIG_L_CM / 2.54) * scale, 1)
  })

  it('handles different rig constants', () => {
    const customRigConstants = {
      RIG_W_CM: 80,
      RIG_L_CM: 180,
      HEAD_OFFSET_CM: 15,
    }

    const defaultResult = calculateSvgLayout(geomData, RIG_CONSTANTS)
    const customResult = calculateSvgLayout(geomData, customRigConstants)

    // Custom rig should be wider and longer
    expect(customResult.rig.w).toBeGreaterThan(defaultResult.rig.w)
    expect(customResult.rig.h).toBeGreaterThan(defaultResult.rig.h)
  })
})
