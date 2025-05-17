import { cm2in } from './conversion'
import { generateCurvedScreenArcs } from './visualization'
import { clamp } from './math'
import { calculateCurvedGeometry } from './curved'
import {
  calculateEffectiveScreenDimensions,
  calculateScreenDimensionsFromManual,
  calculateEffectiveScreenDimensionsFromManual,
  calculateNormalizedValues,
  calculateOptimalViewingAngle,
  calculateAutoSideAngle,
  calculateHorizontalFOV,
  calculateVerticalFOV,
  calculatePlacementVectors,
  calculateTotalWidth,
  determineSideAngle,
} from './screen'

/**
 * Core angle calculation function that can be used by both optimal angle and side angle calculations
 */
function calculateAngle(params) {
  const {
    diagIn,
    ratio,
    distCm,
    bezelMm,
    inputMode = 'diagonal',
    screenWidth,
    screenHeight,
    isCurved = false,
    curveRadius = 1000,
    useAutoSideAngle = false,
  } = params

  // Default return value for invalid inputs
  if ((!diagIn && inputMode === 'diagonal') || !ratio || !distCm) return 60

  let angle
  if (!useAutoSideAngle) {
    // Calculate the optimal viewing angle
    angle = calculateOptimalViewingAngle(diagIn, ratio, distCm, bezelMm)
  } else {
    // Calculate the side screen angle
    // Convert to inches
    const d = cm2in(distCm)
    const bezel = cm2in(bezelMm / 10)

    // Calculate screen dimensions
    let W
    if (inputMode === 'diagonal') {
      const dimensions = calculateEffectiveScreenDimensions(diagIn, ratio, bezelMm)
      W = dimensions.W
    } else {
      const eff = calculateEffectiveScreenDimensionsFromManual(screenWidth, screenHeight, bezelMm)
      W = eff.W
    }

    // Initialize curved screen variables
    let C = W // Default chord length is width (for flat screens)
    let s = 0 // Default sagitta is 0 (for flat screens)

    // Calculate curved screen geometry if enabled
    if (isCurved) {
      const curvedGeometry = calculateCurvedGeometry(W, curveRadius)
      C = curvedGeometry.C
      s = curvedGeometry.s
    }

    // Calculate the distance between screens
    const a = isCurved ? C / 2 + bezel : W / 2 + bezel

    // Get normalized values for angle calculation
    const { W_eff, d_eff } = calculateNormalizedValues(W, d, isCurved, C, s)

    // Calculate the angle using autoSideAngle
    angle = calculateAutoSideAngle(a, W_eff, d_eff)
  }

  // Cap at 90 degrees as it does not have practical sense to go beyond
  return clamp(angle, 0, 90)
}

// Calculate the optimal angle based on screen dimensions and viewing distance
export function calculateOptimalAngle(screen, distance) {
  const { diagIn, ratio, bezelMm } = screen
  const { distCm } = distance

  return calculateAngle({
    diagIn,
    ratio,
    distCm,
    bezelMm,
    useAutoSideAngle: false,
  })
}

// Calculate the side angle using the same method as in calculateScreenGeometry
// This ensures consistency between the recommended angle and the actual angle
export function calculateSideAngle(screen, distance) {
  const { diagIn, ratio, bezelMm, screenWidth, screenHeight } = screen
  const { distCm } = distance
  const { isCurved, curveRadius } = screen.curvature || { isCurved: false, curveRadius: 1000 }
  const inputMode = screen.inputMode || 'diagonal'

  return calculateAngle({
    diagIn,
    ratio,
    distCm,
    bezelMm,
    inputMode,
    screenWidth,
    screenHeight,
    isCurved,
    curveRadius,
    useAutoSideAngle: true,
  })
}

export function calculateScreenGeometry(params) {
  // Extract parameters with defaults
  const {
    diagIn,
    ratio,
    distCm,
    bezelMm,
    setupType = 'triple',
    angleMode = 'auto',
    manualAngle = 60,
    inputMode = 'diagonal',
    screenWidth = 700,
    screenHeight = 400,
    isCurved = false,
    curveRadius = 1000,
  } = params

  // Convert to inches
  const d = cm2in(distCm)
  const bezel = cm2in(bezelMm / 10)

  // Calculate screen dimensions (user-provided full dims and effective dims for FOV)
  let W, H, W_for_fov, H_for_fov
  if (inputMode === 'diagonal') {
    // For diagonal input:
    // - For single screen: don't add bezels for FOV calculation
    // - For triple screen: add bezels for both FOV and visualization
    // - Always add bezels for visualization
    const dimensionsWithBezel = calculateEffectiveScreenDimensions(diagIn, ratio, bezelMm)
    W = dimensionsWithBezel.W
    H = dimensionsWithBezel.H

    if (setupType === 'single') {
      // For single screen, don't add bezels for FOV calculation
      const dimensionsWithoutBezel = calculateEffectiveScreenDimensions(diagIn, ratio, 0)
      W_for_fov = dimensionsWithoutBezel.W
      H_for_fov = dimensionsWithoutBezel.H
    } else {
      // For triple screen, use dimensions with bezels for FOV
      W_for_fov = W
      H_for_fov = H
    }
  } else {
    // For manual input:
    // - Always subtract bezels for FOV calculation
    // - Always use full dimensions for visualization
    const full = calculateScreenDimensionsFromManual(screenWidth, screenHeight)
    const eff = calculateEffectiveScreenDimensionsFromManual(screenWidth, screenHeight, bezelMm)
    W = full.W
    H = full.H
    W_for_fov = eff.W
    H_for_fov = eff.H
  }

  // Initialize curved screen variables
  let C = W // Default chord length is width (for flat screens)
  let s = 0 // Default sagitta is 0 (for flat screens)

  // Calculate curved screen geometry if enabled
  if (isCurved) {
    const curvedGeometry = calculateCurvedGeometry(W, curveRadius)
    C = curvedGeometry.C
    s = curvedGeometry.s
  }

  // Calculate the distance between screens
  const a = isCurved ? C / 2 + bezel : W / 2 + bezel

  // Get normalized values for angle calculation
  const { W_eff, d_eff } = calculateNormalizedValues(W_for_fov, d, isCurved, C, s)

  // Calculate side screen angle
  const sideAngleDeg = determineSideAngle(setupType, angleMode, manualAngle, a, W_eff, d_eff)

  // Calculate horizontal FOV (with bezel-adjusted display area for manual mode)
  const hFOVdeg = calculateHorizontalFOV(setupType, W_eff, d_eff, bezel, sideAngleDeg, a)

  // Calculate vertical FOV
  const vFOVdeg = calculateVerticalFOV(H_for_fov, d)

  // Calculate placement vectors for UI
  const { pivotL, pivotR, uL, uR } = calculatePlacementVectors(setupType, W_eff, d, sideAngleDeg, a)

  // Initialize SVG arcs array
  let svgArcs = []

  // Generate SVG arcs for curved screens
  if (isCurved) {
    const centerY = -d_eff // chord plane
    const screenW = W_eff + 2 * bezel // chord width + bezels on both sides

    // Use the UI module to generate SVG arcs
    svgArcs = generateCurvedScreenArcs(screenW, centerY, s, sideAngleDeg, setupType, a)
  }

  // Calculate total width for footprint reporting
  const totalWidthCm = calculateTotalWidth(setupType, W_eff, pivotL, pivotR, uL, uR)

  return {
    sideAngleDeg,
    hFOVdeg,
    vFOVdeg,
    cm: { distance: distCm, bezel: bezelMm, totalWidth: totalWidthCm },
    geom: { pivotL, pivotR, uL, uR, svgArcs },
  }
}
