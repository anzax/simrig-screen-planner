// Curved screen geometry calculations
// This module contains functions for calculating the geometry of curved screens

/**
 * Calculates the geometry of a curved screen using a circular arc
 * @param {number} chordW - Width of the chord (screen width)
 * @param {number} centerY - Y-coordinate of the center of the chord
 * @param {number} sagittaIn - Depth of the curve (sagitta)
 * @param {number} yawDeg - Yaw angle in degrees (for side screens)
 * @param {boolean} mirror - Whether to mirror the screen (for side screens)
 * @param {number} pivotX - X-coordinate of the pivot point (for side screens)
 * @returns {Object} - Object containing the geometry of the curved screen
 */
export function calculateCurvedScreenGeometry(
  chordW,
  centerY,
  sagittaIn,
  yawDeg = 0,
  mirror = false,
  pivotX = 0,
  apexShiftMultiplier = 1.0
) {
  const half = chordW / 2
  let p0 = { x: -half, y: centerY }

  // Store the actual deepest point for debugging (without multiplier)
  let actualDeepestPoint = { x: 0, y: centerY - sagittaIn }

  // Pull the midpoint *toward* the viewer (y closer to 0 -> less negative)
  // Apply the apex shift multiplier to pull the curve apex closer to the correct arc apex
  let p1 = { x: 0, y: centerY - sagittaIn * apexShiftMultiplier }
  let p2 = { x: half, y: centerY }

  // Calculate ideal points on the true circle BEFORE rotation and mirroring
  // For a circular arc, we need to determine the center and radius
  // The center is at (pivotX, centerY + r) where r is the radius
  // The radius can be calculated from the chord width and sagitta
  const radius = (half * half + sagittaIn * sagittaIn) / (2 * sagittaIn)

  // For the original circle (before rotation/mirroring), center is at (0, centerY + radius - sagittaIn)
  const originalCircleCenterX = 0
  const originalCircleCenterY = centerY + radius - sagittaIn

  // Calculate start and end angles for the original circle
  const originalStartAngle = Math.atan2(p0.y - originalCircleCenterY, p0.x - originalCircleCenterX)
  const originalEndAngle = Math.atan2(p2.y - originalCircleCenterY, p2.x - originalCircleCenterX)

  // Calculate angles for points at 25% and 75% along the original arc
  const originalA1 = originalStartAngle + 0.25 * (originalEndAngle - originalStartAngle)
  const originalA2 = originalStartAngle + 0.75 * (originalEndAngle - originalStartAngle)

  // Calculate ideal points on the original circle
  let idealPoint1 = {
    x: originalCircleCenterX + radius * Math.cos(originalA1),
    y: originalCircleCenterY + radius * Math.sin(originalA1),
  }

  let idealPoint2 = {
    x: originalCircleCenterX + radius * Math.cos(originalA2),
    y: originalCircleCenterY + radius * Math.sin(originalA2),
  }

  // rotate points by yaw around pivotX, centerY
  // Negative sign flips rotation so side panels bow toward the user
  const ang = (-yawDeg * Math.PI) / 180
  const cos = Math.cos(ang)
  const sin = Math.sin(ang)
  const rot = ({ x, y }) => {
    const relX = x - pivotX
    const relY = y - centerY // subtract pivotY as well
    return {
      x: pivotX + cos * relX - sin * relY,
      y: centerY + sin * relX + cos * relY,
    }
  }

  // Rotate the Bezier points
  p0 = rot(p0)
  p1 = rot(p1)
  p2 = rot(p2)

  // Rotate the ideal points
  idealPoint1 = rot(idealPoint1)
  idealPoint2 = rot(idealPoint2)

  // Rotate the actual deepest point
  actualDeepestPoint = rot(actualDeepestPoint)

  // Mirror if needed
  if (mirror) {
    p0.x = 2 * pivotX - p0.x
    p1.x = 2 * pivotX - p1.x
    p2.x = 2 * pivotX - p2.x

    // Mirror the ideal points too
    idealPoint1.x = 2 * pivotX - idealPoint1.x
    idealPoint2.x = 2 * pivotX - idealPoint2.x

    // Mirror the actual deepest point
    actualDeepestPoint.x = 2 * pivotX - actualDeepestPoint.x
  }

  // Create the circle center point
  let circleCenter = {
    x: originalCircleCenterX,
    y: originalCircleCenterY,
  }

  // Rotate the circle center
  circleCenter = rot(circleCenter)

  // Mirror the circle center if needed
  if (mirror) {
    circleCenter.x = 2 * pivotX - circleCenter.x
  }

  // Use the rotated and mirrored circle center
  const circleCenterX = circleCenter.x
  const circleCenterY = circleCenter.y

  // Calculate the final start and end angles based on the rotated/mirrored points
  const startAngle = Math.atan2(p0.y - circleCenterY, p0.x - circleCenterX)
  const endAngle = Math.atan2(p2.y - circleCenterY, p2.x - circleCenterX)

  return {
    // Bezier curve points
    startPoint: p0,
    controlPoint: p1,
    endPoint: p2,

    // Circle geometry
    radius,
    circleCenterX,
    circleCenterY,
    startAngle,
    endAngle,

    // Ideal points on the true circle
    idealPoints: [
      [idealPoint1.x, idealPoint1.y],
      [idealPoint2.x, idealPoint2.y],
    ],

    // Actual deepest point (for debugging)
    actualDeepestPoint: [actualDeepestPoint.x, actualDeepestPoint.y],

    // Additional metadata
    isRotated: yawDeg !== 0,
    isMirrored: mirror,
    yawDeg,
    pivotX,
    apexShiftMultiplier,
  }
}

/**
 * Creates a Bezier curve representation of a curved screen
 * @param {Object} geometry - The geometry of the curved screen
 * @returns {Object} - Object containing the Bezier curve representation
 */
export function createBezierArc(geometry) {
  const {
    startPoint: p0,
    controlPoint: p1,
    endPoint: p2,
    idealPoints,
    actualDeepestPoint,
  } = geometry

  return {
    type: 'bezier',
    startX: p0.x,
    startY: p0.y,
    controlX: p1.x,
    controlY: p1.y,
    endX: p2.x,
    endY: p2.y,
    path: `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`,
    idealPoints,
    actualDeepestPoint,
    // Extract the y-coordinate for compatibility with calculateSvgLayout
    actualDeepestY: actualDeepestPoint ? actualDeepestPoint[1] : undefined,
  }
}

/**
 * Generates SVG arcs for curved screens
 * @param {number} screenW - Width of the screen
 * @param {number} centerY - Y-coordinate of the center of the screen
 * @param {number} depth - Depth of the curve
 * @param {number} sideAngleDeg - Angle of the side screens in degrees
 * @param {string} setupType - Type of setup ('single' or 'triple')
 * @param {number} pivotDistance - Distance between the pivot points
 * @returns {Array} - Array of SVG arcs
 */
export function generateCurvedScreenArcs(
  screenW,
  centerY,
  depth,
  sideAngleDeg,
  setupType,
  pivotDistance,
  apexShiftMultiplier = 1.0
) {
  const svgArcs = []

  if (setupType === 'single') {
    // Calculate geometry for a single screen
    const geometry = calculateCurvedScreenGeometry(
      screenW,
      centerY,
      depth,
      0,
      false,
      0,
      apexShiftMultiplier
    )
    svgArcs.push(createBezierArc(geometry))
  } else {
    // Calculate geometry for center screen
    const centerGeometry = calculateCurvedScreenGeometry(
      screenW,
      centerY,
      depth,
      0,
      false,
      0,
      apexShiftMultiplier
    )
    svgArcs.push(createBezierArc(centerGeometry))

    // Calculate geometry for right screen
    const rightGeometry = calculateCurvedScreenGeometry(
      screenW,
      centerY,
      depth,
      sideAngleDeg,
      true,
      pivotDistance,
      apexShiftMultiplier
    )
    svgArcs.push(createBezierArc(rightGeometry))

    // Calculate geometry for left screen
    const leftGeometry = calculateCurvedScreenGeometry(
      screenW,
      centerY,
      depth,
      -sideAngleDeg,
      true,
      -pivotDistance,
      apexShiftMultiplier
    )
    svgArcs.push(createBezierArc(leftGeometry))
  }

  return svgArcs
}
