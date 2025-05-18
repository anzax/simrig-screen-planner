import {
  calculateScreenDimensionsFromDiagonal,
  calculateScreenDimensionsFromManual,
  calculateNormalizedValues,
  determineSideAngle,
  calculateHorizontalFOV,
  calculateVerticalFOV,
  calculatePlacementVectors,
  calculateTotalWidth,
  calculateOptimalViewingAngle,
  calculateAutoSideAngle,
} from './screen'
import { cm2in } from './conversion'
import { calculateCurvedGeometry } from './curved'
import { clamp } from './math'

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
      const { panel } = calculateScreenDimensionsFromDiagonal(diagIn, ratio, bezelMm)
      W = panel.W
    } else {
      const { panel } = calculateScreenDimensionsFromManual(screenWidth, screenHeight, bezelMm)
      W = panel.W
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

/**
 * Calculate the optimal angle based on screen dimensions and viewing distance
 */
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

/**
 * Calculate the side angle using the same method as in calculateStats
 * This ensures consistency between the recommended angle and the actual angle
 */
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

/**
 * Calculate all statistics values needed for display
 */
export function calculateStats(config) {
  const { screen, distance, layout, curvature, ui } = config

  // Extract parameters
  const { diagIn, ratio, bezelMm, screenWidth, screenHeight } = screen
  const { distCm } = distance
  const { setupType, manualAngle } = layout
  const { isCurved, curveRadius } = curvature
  const angleMode = ui?.angleMode || 'auto'
  const inputMode = ui?.inputMode || 'diagonal'

  // Calculate screen dimensions (panel-only and physical footprint)
  let dims
  if (inputMode === 'diagonal') {
    dims = calculateScreenDimensionsFromDiagonal(diagIn, ratio, bezelMm)
  } else {
    dims = calculateScreenDimensionsFromManual(screenWidth, screenHeight, bezelMm)
  }
  const { panel, physical } = dims

  // Convert to inches for distance and bezel
  const d = cm2in(distCm)
  const bezel = cm2in(bezelMm / 10)

  // Initialize curved screen variables
  let C = panel.W // Default chord length is width (for flat screens)
  let s = 0 // Default sagitta is 0 (for flat screens)

  // Calculate curved screen geometry if enabled
  if (isCurved) {
    const curvedGeometry = calculateCurvedGeometry(panel.W, curveRadius)
    C = curvedGeometry.C
    s = curvedGeometry.s
  }

  // Calculate the distance between screens
  const a = isCurved ? C / 2 + bezel : panel.W / 2 + bezel

  // Get normalized values for angle calculation
  const { W_eff, d_eff } = calculateNormalizedValues(panel.W, d, isCurved, C, s)

  // Calculate side screen angle
  const sideAngleDeg = determineSideAngle(setupType, angleMode, manualAngle, a, W_eff, d_eff)

  // Calculate FOV values
  const hFOVdeg = calculateHorizontalFOV(setupType, W_eff, d_eff, bezel, sideAngleDeg, a)
  const vFOVdeg = calculateVerticalFOV(panel.H, d)

  // Calculate placement vectors for visualization
  const vectors = calculatePlacementVectors(setupType, W_eff, d, sideAngleDeg, a)

  // Calculate total width (in cm) using calculateTotalWidth, which already converts inches→cm
  // Calculate total width (in cm), adjust for curved single screens
  const totalWidth = calculateTotalWidth(
    setupType,
    W_eff,
    vectors.pivotL,
    vectors.pivotR,
    vectors.uL,
    vectors.uR,
    isCurved,
    curveRadius,
    bezelMm
  )

  // Return all stats needed for display, including panel vs physical dims
  return {
    sideAngleDeg,
    hFOVdeg,
    vFOVdeg,
    panel: { W: panel.W, H: panel.H },
    physical: { W: physical.W, H: physical.H },
    cm: {
      distance: distCm,
      bezel: bezelMm,
      totalWidth,
    },
    // Include geometry data needed for visualization
    geom: {
      pivotL: vectors.pivotL,
      pivotR: vectors.pivotR,
      uL: vectors.uL,
      uR: vectors.uR,
      isCurved,
      W_eff,
      d_eff,
      s,
      setupType,
      a,
    },
  }
}
