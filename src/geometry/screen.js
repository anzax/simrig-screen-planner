/**
 * Screen-specific geometry calculations
 * This module contains functions for calculating screen dimensions and properties
 */

import { ASPECT_RATIOS } from './constants'
import { cm2in, in2cm } from './conversion'
import { calculateFOV, atandeg, atan2deg, clamp } from './math'

/**
 * Calculate screen dimensions from diagonal and aspect ratio
 * @param {number} diagIn - Diagonal size in inches
 * @param {string} ratio - Aspect ratio ('16:9', '21:9', '32:9')
 * @returns {Object} Screen dimensions in inches {W, H}
 */
export function calculateScreenDimensions(diagIn, ratio) {
  const ar = ASPECT_RATIOS[ratio]
  const diagFac = Math.hypot(ar.w, ar.h)
  const W = diagIn * (ar.w / diagFac)
  const H = diagIn * (ar.h / diagFac)
  return { W, H }
}

/**
 * Calculate effective screen dimensions accounting for bezel
 * @param {number} diagIn - Diagonal size in inches
 * @param {string} ratio - Aspect ratio ('16:9', '21:9', '32:9')
 * @param {number} bezelMm - Bezel width in mm
 * @returns {Object} Effective screen dimensions in inches {W, H}
 */
/**
 * Returns both the active-panel and total-physical footprint dimensions (in inches)
 * from a diagonal input including bezel thickness.
 * @param {number} diagIn - Screen diagonal in inches (panel only)
 * @param {string} ratio - Aspect ratio key ('16:9', '21:9', '32:9')
 * @param {number} bezelMm - Bezel width in mm
 * @returns {{panel: {W: number, H: number}, physical: {W: number, H: number}}}
 */
export function calculateScreenDimensionsFromDiagonal(diagIn, ratio, bezelMm) {
  const panel = calculateScreenDimensions(diagIn, ratio)
  const bezelInches = (bezelMm * 2) / 25.4
  const physical = calculateScreenDimensions(diagIn + bezelInches, ratio)
  return { panel, physical }
}

/**
 * Returns both the active-panel and total-physical footprint dimensions (in inches)
 * from manual width/height input including bezel thickness.
 * @param {number} screenWidthMm - Total screen width in mm (including bezels)
 * @param {number} screenHeightMm - Total screen height in mm (including bezels)
 * @param {number} bezelMm - Bezel width in mm
 * @returns {{panel: {W: number, H: number}, physical: {W: number, H: number}}}
 */
export function calculateScreenDimensionsFromManual(screenWidthMm, screenHeightMm, bezelMm) {
  const physical = {
    W: screenWidthMm / 25.4,
    H: screenHeightMm / 25.4,
  }
  const panel = {
    W: (screenWidthMm - bezelMm * 2) / 25.4,
    H: (screenHeightMm - bezelMm * 2) / 25.4,
  }
  return { panel, physical }
}

/**
 * Calculate normalized values for angle calculation
 * @param {number} W - Screen width in inches
 * @param {number} d - Viewing distance in inches
 * @param {boolean} isCurved - Whether the screen is curved
 * @param {number} C - Chord length for curved screens
 * @param {number} s - Sagitta for curved screens
 * @returns {Object} Normalized values {W_eff, d_eff}
 */
export function calculateNormalizedValues(W, d, isCurved, C, s) {
  const W_eff = isCurved ? C : W // chord for curved, width for flat
  const d_eff = isCurved ? d - s : d // eye-to-surface distance
  return { W_eff, d_eff }
}

/**
 * Calculate optimal viewing angle based on screen dimensions and distance
 * @param {number} diagIn - Screen diagonal in inches
 * @param {string} ratio - Aspect ratio ('16:9', '21:9', '32:9')
 * @param {number} distCm - Viewing distance in cm
 * @param {number} bezelMm - Bezel width in mm
 * @returns {number} Optimal viewing angle in degrees
 */
export function calculateOptimalViewingAngle(diagIn, ratio, distCm, bezelMm) {
  // Get panel width from diagonal input (excludes bezel in panel dims)
  const { panel } = calculateScreenDimensionsFromDiagonal(diagIn, ratio, bezelMm)
  const W = panel.W

  // Convert distance to inches
  const distanceIn = cm2in(distCm)

  // Calculate half width
  const halfWidthIn = W / 2

  // Calculate angle
  const degrees = atandeg(halfWidthIn / distanceIn)

  return parseFloat(degrees.toFixed(1))
}

/**
 * Calculate automatic side angle for screens
 * @param {number} a - Half width plus bezel
 * @param {number} W_eff - Effective width
 * @param {number} d_eff - Effective distance
 * @returns {number} Side angle in degrees
 */
export function calculateAutoSideAngle(a, W_eff, d_eff) {
  const x_c = (W_eff * d_eff * d_eff) / (d_eff * d_eff + a * a)
  const y_c = (a * x_c - d_eff * d_eff) / d_eff
  const u_x = 2 * (x_c - a)
  const u_y = 2 * (y_c + d_eff)
  return Math.abs(atan2deg(u_y, u_x))
}

/**
 * Calculate horizontal FOV for a setup
 * @param {string} setupType - Setup type ('single' or 'triple')
 * @param {number} W_eff - Effective width
 * @param {number} d_eff - Effective distance
 * @param {number} bezel - Bezel width in inches
 * @param {number} sideAngleDeg - Side angle in degrees
 * @param {number} a - Half width plus bezel
 * @returns {number} Horizontal FOV in degrees
 */
export function calculateHorizontalFOV(setupType, W_eff, d_eff, bezel, sideAngleDeg, a) {
  // Calculate FOV for a single panel
  const singlePanelFOV = calculateFOV(W_eff, d_eff)

  // Calculate FOV for bezels
  const bezelFOV = calculateFOV(bezel * 2, d_eff)

  // For single setup, return single panel FOV
  if (setupType === 'single') {
    return singlePanelFOV
  }

  // For triple setup, calculate the total FOV
  // Convert side angle to radians
  const ang = (sideAngleDeg * Math.PI) / 180

  // Calculate the coordinates of the outer edges of the side panels
  const edgeR = {
    x: a + W_eff * Math.cos(ang),
    y: -d_eff + W_eff * Math.sin(ang),
  }

  const edgeL = {
    x: -a - W_eff * Math.cos(ang),
    y: -d_eff + W_eff * Math.sin(ang),
  }

  // Calculate the angles from the eye to the edges
  const angleR = atan2deg(edgeR.y, edgeR.x)
  const angleL = atan2deg(edgeL.y, edgeL.x)

  // Normalize angles to 0-360
  const to360 = deg => (deg + 360) % 360

  // Calculate the difference between the angles
  let delta = (to360(angleL) - to360(angleR) + 360) % 360
  if (delta > 180) delta -= 360 // now in -180...180

  // Calculate the span
  const spanSmall = Math.abs(delta)

  // Calculate the midpoint angle
  const midDeg = (to360(angleR) + delta / 2 + 360) % 360

  // Determine which arc to use based on the midpoint
  const span =
    Math.sin((midDeg * Math.PI) / 180) < 0
      ? spanSmall // midpoint in front => small arc
      : 360 - spanSmall // midpoint behind => large arc

  // Add bezel FOV
  return span + bezelFOV
}

/**
 * Calculate vertical FOV
 * @param {number} H - Screen height in inches
 * @param {number} d - Viewing distance in inches
 * @returns {number} Vertical FOV in degrees
 */
export function calculateVerticalFOV(H, d) {
  return calculateFOV(H, d)
}

/**
 * Calculate placement vectors for UI
 * @param {string} setupType - Setup type ('single' or 'triple')
 * @param {number} W_eff - Effective width
 * @param {number} d - Viewing distance in inches
 * @param {number} sideAngleDeg - Side angle in degrees
 * @param {number} a - Half width plus bezel
 * @returns {Object} Placement vectors {pivotL, pivotR, uL, uR}
 */
export function calculatePlacementVectors(setupType, W_eff, d, sideAngleDeg, a) {
  if (setupType === 'single') {
    return {
      pivotL: { x: -a, y: -d },
      pivotR: { x: a, y: -d },
      uL: { x: 0, y: 0 },
      uR: { x: 0, y: 0 },
    }
  }
  // triple monitors
  const ang = (sideAngleDeg * Math.PI) / 180
  const uR = { x: W_eff * Math.cos(ang), y: W_eff * Math.sin(ang) }
  const uL = { x: -uR.x, y: uR.y }
  const pivotR = { x: a, y: -d }
  const pivotL = { x: -a, y: -d }

  return { pivotL, pivotR, uL, uR }
}

/**
 * Calculate total width for footprint reporting
 * @param {string} setupType - Setup type ('single' or 'triple')
 * @param {number} W_eff - Effective width in inches
 * @param {Object} pivotL - Left pivot point {x, y}
 * @param {Object} pivotR - Right pivot point {x, y}
 * @param {Object} uL - Left direction vector {x, y}
 * @param {Object} uR - Right direction vector {x, y}
 * @param {boolean} [isCurved=false] - Whether the screen is curved
 * @param {number} [curveRadiusMm=0] - Curve radius in millimeters
 * @param {number} [bezelMm=0] - Bezel width in millimeters
 * @returns {number} Total width in centimeters
 */
export function calculateTotalWidth(
  setupType,
  W_eff,
  pivotL,
  pivotR,
  uL,
  uR,
  isCurved = false,
  curveRadiusMm = 0,
  bezelMm = 0
) {
  if (setupType === 'single') {
    // Single monitor: footprint width = panel chord + two bezels (flat) or curved outer chord
    const bezelIn = bezelMm / 25.4
    if (isCurved && curveRadiusMm > 0) {
      // Compute outer chord with bezel offset
      const Rin = curveRadiusMm / 25.4
      const halfChord = W_eff / 2
      const theta = 2 * Math.asin(halfChord / Rin)
      const radiusOut = Rin + bezelIn
      const physicalW = 2 * radiusOut * Math.sin(theta / 2)
      return in2cm(physicalW)
    }
    // Flat single or fallback: panel width + two bezels
    const physicalW = W_eff + 2 * bezelIn
    return in2cm(physicalW)
  }
  // Triple monitors: footprint = active span + outer bezels of side screens
  const rightEdgeX = pivotR.x + uR.x
  const leftEdgeX = pivotL.x + uL.x
  const activeSpan = rightEdgeX - leftEdgeX
  // Derive bezel thickness from pivot position
  const bezel = pivotR.x - W_eff / 2
  // Compute horizontal projection of bezel at side angle
  const angleRad = Math.acos(uR.x / W_eff)
  const bezelProj = bezel * Math.cos(angleRad)
  return in2cm(activeSpan + 2 * bezelProj)
}

/**
 * Determine side angle based on setup type and angle mode
 * @param {string} setupType - Setup type ('single' or 'triple')
 * @param {string} angleMode - Angle mode ('auto' or 'manual')
 * @param {number} manualAngle - Manual angle in degrees
 * @param {number} a - Half width plus bezel
 * @param {number} W_eff - Effective width
 * @param {number} d_eff - Effective distance
 * @returns {number} Side angle in degrees
 */
export function determineSideAngle(setupType, angleMode, manualAngle, a, W_eff, d_eff) {
  if (setupType !== 'triple') {
    return 0
  }

  if (angleMode === 'auto') {
    // Calculate the auto angle
    const calculatedAngle = calculateAutoSideAngle(a, W_eff, d_eff)
    // Cap at 90 degrees as it does not have practical sense to go beyond
    return clamp(calculatedAngle, 0, 90)
  } else {
    return manualAngle
  }
}
