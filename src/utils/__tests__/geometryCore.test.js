// src/utils/__tests__/geometryCore.test.js
import { describe, it, expect } from 'vitest'
import { calculateScreenGeometry, calculateOptimalAngle } from '../geometryCore'

describe('calculateOptimalAngle', () => {
  it('calculates optimal angle based on screen dimensions and viewing distance', () => {
    const screen = { diagIn: 27, ratio: '16:9', bezelMm: 10 }
    const distance = { distCm: 70 }

    const result = calculateOptimalAngle(screen, distance)

    // Verify the result is a number and within a reasonable range
    expect(typeof result).toBe('number')
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(90)
  })

  it('returns default angle of 60 when inputs are missing', () => {
    // Missing diagonal
    expect(calculateOptimalAngle({ ratio: '16:9', bezelMm: 10 }, { distCm: 70 })).toBe(60)

    // Missing ratio
    expect(calculateOptimalAngle({ diagIn: 27, bezelMm: 10 }, { distCm: 70 })).toBe(60)

    // Missing distance
    expect(calculateOptimalAngle({ diagIn: 27, ratio: '16:9', bezelMm: 10 }, {})).toBe(60)
  })

  it('handles different aspect ratios correctly', () => {
    const distance = { distCm: 70 }

    const result16_9 = calculateOptimalAngle({ diagIn: 27, ratio: '16:9', bezelMm: 10 }, distance)
    const result21_9 = calculateOptimalAngle({ diagIn: 34, ratio: '21:9', bezelMm: 10 }, distance)
    const result32_9 = calculateOptimalAngle({ diagIn: 49, ratio: '32:9', bezelMm: 10 }, distance)

    // Wider aspect ratios should generally result in larger optimal angles
    expect(result21_9).toBeGreaterThan(result16_9)
    expect(result32_9).toBeGreaterThan(result21_9)
  })
})

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
    // Updated to expect the new, more accurate hFOV value that correctly handles screens wrapping past the eyes
    expect(result.hFOVdeg).toBeCloseTo(183, 0)
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

  // Test hFOV calculation for curved screens
  it('calculates correct hFOV for curved screens', () => {
    // Test single curved screen
    const singleCurved = calculateScreenGeometry(
      27,
      '16:9',
      70,
      10,
      'single',
      'auto',
      60,
      'diagonal',
      700,
      400,
      true,
      1000
    )

    // Test triple curved screen
    const tripleCurved = calculateScreenGeometry(
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

    // Test with different curve radii
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

    // Single curved screen hFOV should be reasonable
    expect(singleCurved.hFOVdeg).toBeGreaterThan(20)
    // Current implementation gives ~128 degrees, which seems high
    // After fixing, we should adjust this test

    // Triple curved screen hFOV should be reasonable and not always 180
    expect(tripleCurved.hFOVdeg).toBeGreaterThan(100)
    expect(tripleCurved.hFOVdeg).toBeLessThan(270) // Should be less than 270 degrees

    // Different curve radii should result in different hFOV values
    expect(smallRadius.hFOVdeg).not.toBeCloseTo(largeRadius.hFOVdeg, 0)

    // Triple curved screen hFOV should be greater than single curved screen hFOV
    expect(tripleCurved.hFOVdeg).toBeGreaterThan(singleCurved.hFOVdeg)

    // Triple curved screen hFOV should vary with different parameters
    const differentAngle = calculateScreenGeometry(
      27,
      '16:9',
      70,
      10,
      'triple',
      'manual',
      30, // Different angle
      'diagonal',
      700,
      400,
      true,
      1000
    )
    expect(differentAngle.hFOVdeg).not.toBeCloseTo(tripleCurved.hFOVdeg, 0)
  })
})
