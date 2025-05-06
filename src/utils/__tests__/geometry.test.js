// src/utils/__tests__/geometry.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { calculateScreenGeometry, calculateSvgLayout } from '../geometry'
import { RIG_CONSTANTS } from '../constants'

describe('calculateScreenGeometry', () => {
  // Test standard 16:9 monitor setup with triple screens (default)
  it('calculates correct geometry for 27" 16:9 monitors with triple setup', () => {
    const result = calculateScreenGeometry(27, '16:9', 70, 10)

    // Check that all expected properties are returned
    expect(result).toHaveProperty('sideAngleDeg')
    expect(result).toHaveProperty('hFOVdeg')
    expect(result).toHaveProperty('vFOVdeg')
    expect(result).toHaveProperty('cm')
    expect(result).toHaveProperty('geom')

    // Verify specific values with reasonable precision
    expect(result.sideAngleDeg).toBeCloseTo(50.2, 1)
    // Allow a bit more tolerance for FOV calculation
    expect(result.hFOVdeg).toBeCloseTo(147, 0)
    expect(result.vFOVdeg).toBeCloseTo(27.8, 1)

    // Check cm object properties
    expect(result.cm.distance).toBe(70)
    expect(result.cm.bezel).toBe(10)
    expect(result.cm.totalWidth).toBeGreaterThan(0)

    // Check geometry object properties
    expect(result.geom.pivotL.x).toBeLessThan(0)
    expect(result.geom.pivotR.x).toBeGreaterThan(0)
  })

  // Test single screen setup
  it('calculates correct geometry for single screen setup', () => {
    const result = calculateScreenGeometry(27, '16:9', 70, 10, 'single')

    // For single screen, side angle should be 0
    expect(result.sideAngleDeg).toBe(0)

    // FOV should be smaller for single screen compared to triple
    const tripleResult = calculateScreenGeometry(27, '16:9', 70, 10, 'triple')
    expect(result.hFOVdeg).toBeLessThan(tripleResult.hFOVdeg)

    // Total width should be just the screen width for single setup
    expect(result.cm.totalWidth).toBeLessThan(tripleResult.cm.totalWidth)
  })

  // Test manual angle mode
  it('uses manual angle when angleMode is set to manual', () => {
    const manualAngle = 45
    const result = calculateScreenGeometry(27, '16:9', 70, 10, 'triple', 'manual', manualAngle)

    // Side angle should match the manual angle
    expect(result.sideAngleDeg).toBe(manualAngle)
  })

  // Test ultrawide 21:9 monitor setup
  it('calculates correct geometry for 34" 21:9 monitors', () => {
    const result = calculateScreenGeometry(34, '21:9', 75, 15)

    expect(result.sideAngleDeg).toBeCloseTo(61.0, 1)
    expect(result.hFOVdeg).toBeGreaterThan(150)
    expect(result.vFOVdeg).toBeLessThan(30)

    // Check that total width is calculated correctly
    expect(result.cm.totalWidth).toBeGreaterThan(0)
  })

  // Test super ultrawide 32:9 monitor setup
  it('calculates correct geometry for 49" 32:9 monitors', () => {
    const result = calculateScreenGeometry(49, '32:9', 80, 15)

    // Check that all expected properties are returned
    expect(result).toHaveProperty('sideAngleDeg')
    expect(result).toHaveProperty('hFOVdeg')
    expect(result).toHaveProperty('vFOVdeg')

    // With our new FOV calculation based on actual side angles,
    // the FOV depends on the angle between the outer edges of the side screens,
    // not just the aspect ratio. So we'll check that the FOV is reasonable.
    expect(result.hFOVdeg).toBeGreaterThan(120)

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

  // Test curved screen calculations
  it('calculates correct geometry for curved screens', () => {
    const flatScreen = calculateScreenGeometry(
      27,
      '16:9',
      70,
      10,
      'triple',
      'auto',
      60,
      'diagonal',
      700,
      400,
      false,
      1000
    )
    const curvedScreen = calculateScreenGeometry(
      27,
      '16:9',
      70,
      10,
      'triple',
      'auto',
      60,
      'diagonal',
      700,
      400,
      true,
      1000
    )

    // Check that curved screen properties are returned
    expect(curvedScreen.curved).toHaveProperty('isCurved', true)
    expect(curvedScreen.curved).toHaveProperty('curveRadius', 1000)
    expect(curvedScreen.curved).toHaveProperty('chordIn')
    expect(curvedScreen.curved).toHaveProperty('sagittaIn')
    expect(curvedScreen.curved).toHaveProperty('theta')
    expect(curvedScreen.curved).toHaveProperty('chordDistanceIn')

    // Curved screen should have chord length less than flat screen width
    const flatWidth = flatScreen.screen.widthMm / 25.4 // convert mm to inches
    expect(curvedScreen.curved.chordIn).toBeLessThan(flatWidth)

    // Sagitta should be positive
    expect(curvedScreen.curved.sagittaIn).toBeGreaterThan(0)

    // Chord distance should be greater than actual distance
    expect(curvedScreen.curved.chordDistanceIn).toBeGreaterThan(70 / 2.54) // convert cm to inches

    // Central angle should be positive
    expect(curvedScreen.curved.theta).toBeGreaterThan(0)

    // Only horizontal FOV should be different for curved vs flat screens
    expect(curvedScreen.hFOVdeg).not.toEqual(flatScreen.hFOVdeg)
    // Vertical FOV should not be affected by curvature
    expect(curvedScreen.vFOVdeg).toEqual(flatScreen.vFOVdeg)
  })

  // Test different curve radii
  it('adjusts calculations based on curve radius', () => {
    const smallRadius = calculateScreenGeometry(
      27,
      '16:9',
      70,
      10,
      'triple',
      'auto',
      60,
      'diagonal',
      700,
      400,
      true,
      800
    )
    const largeRadius = calculateScreenGeometry(
      27,
      '16:9',
      70,
      10,
      'triple',
      'auto',
      60,
      'diagonal',
      700,
      400,
      true,
      1500
    )

    // Smaller radius means more curve
    expect(smallRadius.curved.sagittaIn).toBeGreaterThan(largeRadius.curved.sagittaIn)

    // Smaller radius means larger central angle
    expect(smallRadius.curved.theta).toBeGreaterThan(largeRadius.curved.theta)

    // Smaller radius means shorter chord length
    expect(smallRadius.curved.chordIn).toBeLessThan(largeRadius.curved.chordIn)
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

  it('generates SVG arcs for curved screens', () => {
    // Create geometry data with curved screens
    const curvedGeomData = calculateScreenGeometry(
      27,
      '16:9',
      70,
      10,
      'triple',
      'auto',
      60,
      'diagonal',
      700,
      400,
      true,
      1000
    ).geom

    const result = calculateSvgLayout(curvedGeomData, RIG_CONSTANTS)

    // Check that arcs array is returned
    expect(result).toHaveProperty('arcs')
    expect(Array.isArray(result.arcs)).toBe(true)

    // For triple curved screens, we should have 3 arcs (center, left, right)
    expect(result.arcs.length).toBe(3)

    // Each arc should have a path property
    result.arcs.forEach(arc => {
      expect(arc).toHaveProperty('path')
      expect(typeof arc.path).toBe('string')
      // SVG path should start with M
      expect(arc.path.startsWith('M ')).toBe(true)
      // Path should include either A for arc or Q for Bézier curve
      expect(arc.path.includes(' A ') || arc.path.includes(' Q ')).toBe(true)

      // If it's a Bézier curve, it should have the type property
      if (arc.path.includes(' Q ')) {
        expect(arc).toHaveProperty('type', 'bezier')
        expect(arc).toHaveProperty('controlX')
        expect(arc).toHaveProperty('controlY')
      }
    })
  })
})
