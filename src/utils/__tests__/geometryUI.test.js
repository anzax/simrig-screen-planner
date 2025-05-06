// src/utils/__tests__/geometryUI.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { calculateSvgLayout } from '../geometryUI'
import { calculateScreenGeometry } from '../geometryCore'
import { RIG_CONSTANTS } from '../constants'

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

  it('handles empty or missing svgArcs', () => {
    // Create a copy of geomData without svgArcs
    const geomDataWithoutArcs = { ...geomData, svgArcs: [] }

    // Should not throw an error
    expect(() => calculateSvgLayout(geomDataWithoutArcs, RIG_CONSTANTS)).not.toThrow()

    // Result should have an empty arcs array
    const result = calculateSvgLayout(geomDataWithoutArcs, RIG_CONSTANTS)
    expect(result.arcs).toEqual([])
  })

  it('correctly transforms coordinates', () => {
    const result = calculateSvgLayout(geomData, RIG_CONSTANTS)

    // Head should be at a positive position after transformation
    expect(result.head.cx).toBeGreaterThan(0)
    expect(result.head.cy).toBeGreaterThan(0)

    // All lines should have positive coordinates
    result.lines.forEach(line => {
      expect(line.x1).toBeGreaterThanOrEqual(0)
      expect(line.y1).toBeGreaterThanOrEqual(0)
      expect(line.x2).toBeGreaterThanOrEqual(0)
      expect(line.y2).toBeGreaterThanOrEqual(0)
    })
  })
})
