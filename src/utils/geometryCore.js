import { cm2in, in2cm } from './conversions'
import { ASPECT_RATIOS } from './constants'
import { generateCurvedScreenArcs } from './geometryUI'

/** ------------------------------------------------------------------
 *  Geometry helpers – keep the main function readable
 * -----------------------------------------------------------------*/
const DEG = 180 / Math.PI

// FOV helpers
const panelFOVdeg = (W, d) => 2 * Math.atan(W / (2 * d)) * DEG
const bezelFOVdeg = (bezel, d) => 2 * Math.atan(bezel / d) * DEG

// Automatic side-screen angle (works for both flat & curved once we pass in W_eff, d_eff)
function autoSideAngle(a, W_eff, d_eff) {
  const x_c = (W_eff * d_eff * d_eff) / (d_eff * d_eff + a * a)
  const y_c = (a * x_c - d_eff * d_eff) / d_eff
  const u_x = 2 * (x_c - a)
  const u_y = 2 * (y_c + d_eff)
  return Math.abs(Math.atan2(u_y, u_x)) * DEG
}

// Helper function to calculate screen dimensions
function calculateScreenDimensions(diagIn, ratio, bezelMm, inputMode, screenWidth, screenHeight) {
  let W, H
  if (inputMode === 'diagonal') {
    const ar = ASPECT_RATIOS[ratio]
    const diagFac = Math.hypot(ar.w, ar.h)
    const bezelInches = (bezelMm * 2) / 25.4
    const effectiveDiagIn = diagIn + bezelInches
    W = effectiveDiagIn * (ar.w / diagFac)
    H = effectiveDiagIn * (ar.h / diagFac)
  } else {
    // Convert mm to inches
    W = screenWidth / 25.4
    H = screenHeight / 25.4
  }
  return { W, H }
}

// Helper function to calculate curved screen geometry
function calculateCurvedGeometry(W, curveRadius) {
  // Convert radius from mm to inches
  const Rin = curveRadius / 25.4

  // Calculate central angle (theta = arc length / radius)
  const theta = W / Rin

  // Calculate chord length (C = 2R * sin(theta/2))
  const C = 2 * Rin * Math.sin(theta / 2)

  // Calculate sagitta (s = R * (1 - cos(theta/2)))
  const s = Rin * (1 - Math.cos(theta / 2))

  return { C, s, Rin }
}

// Helper function to calculate normalized values for angle calculation
function calculateNormalizedValues(W, d, isCurved, C, s) {
  const W_eff = isCurved ? C : W // chord for curved, width for flat
  const d_eff = isCurved ? d - s : d // eye-to-surface distance
  return { W_eff, d_eff }
}

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

  // For optimal angle calculation (not using autoSideAngle)
  if (!useAutoSideAngle) {
    // Calculate the angle using the aspect ratio and diagonal
    const calculatedAngle = parseFloat(
      (
        (Math.atan(
          ((diagIn + (bezelMm * 2) / 25.4) *
            (ratio === '16:9'
              ? 16 / Math.hypot(16, 9)
              : ratio === '21:9'
                ? 21 / Math.hypot(21, 9)
                : 32 / Math.hypot(32, 9))) /
            2 /
            (distCm / 2.54)
        ) *
          180) /
        Math.PI
      ).toFixed(1)
    )

    // Cap the angle at 90 degrees as it does not have practical sense to go beyond
    return Math.min(calculatedAngle, 90)
  }

  // For side angle calculation (using autoSideAngle)
  // Convert to inches
  const d = cm2in(distCm)
  const bezel = cm2in(bezelMm / 10)

  // Calculate screen dimensions
  const { W } = calculateScreenDimensions(
    diagIn,
    ratio,
    bezelMm,
    inputMode,
    screenWidth,
    screenHeight
  )

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
  const sideAngleDeg = autoSideAngle(a, W_eff, d_eff)

  // Cap at 90 degrees as it does not have practical sense to go beyond
  return Math.min(sideAngleDeg, 90)
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
  const d = cm2in(distCm)
  const bezel = cm2in(bezelMm / 10)

  // Calculate screen dimensions
  const { W, H } = calculateScreenDimensions(
    diagIn,
    ratio,
    bezelMm,
    inputMode,
    screenWidth,
    screenHeight
  )

  // Initialize curved screen variables
  let C = W // Default chord length is width (for flat screens)
  let s = 0 // Default sagitta is 0 (for flat screens)
  let Rin = 0 // Default radius in inches
  let d_chord = d // Default chord distance is the actual distance (for flat screens)

  // Calculate curved screen geometry if enabled
  if (isCurved) {
    const curvedGeometry = calculateCurvedGeometry(W, curveRadius)
    C = curvedGeometry.C
    s = curvedGeometry.s
    Rin = curvedGeometry.Rin

    // For curved screens, we want to keep the distance to the deepest point of the curve
    // consistent with the flat screen distance (maintain actual screen-to-eye distance)
    // So the chord plane distance needs to be adjusted
    // Note: The test expects chord distance to be greater than actual distance
    d_chord = d + s

    // Validate curved screen parameters
    if (curveRadius < W * 25.4) {
      console.warn(
        'Warning: Curve radius is less than screen width, which is physically impossible'
      )
    }

    if (d_chord < 0) {
      console.warn('Warning: Eye position is behind the chord plane')
    }
  }

  const a = isCurved ? C / 2 + bezel : W / 2 + bezel

  // Get normalized values for angle calculation
  const { W_eff, d_eff } = calculateNormalizedValues(W, d, isCurved, C, s)

  // side screen angle
  let sideAngleDeg = 0
  if (setupType === 'triple') {
    if (angleMode === 'auto') {
      // Calculate the auto angle
      sideAngleDeg = autoSideAngle(a, W_eff, d_eff)
      // Cap at 90 degrees as it does not have practical sense to go beyond
      sideAngleDeg = Math.min(sideAngleDeg, 90)
    } else {
      sideAngleDeg = manualAngle
    }
  }

  // horizontal FOV (including bezels)
  let hFOVdeg, vFOVdeg, totalWidthCm
  let pivotR, pivotL, uR, uL
  // Array to store SVG arcs for curved screens
  let svgArcs = []

  // --- Unified FOV calculation (honours manual side angles) ----------
  {
    const hSingleDeg = panelFOVdeg(W_eff, d_eff) // one panel
    const bDeg = bezelFOVdeg(bezel, d_eff)

    if (setupType === 'single') {
      hFOVdeg = hSingleDeg // bezels ignored for single
    } else {
      // Vector-based span between eye -> outer edge of each side panel
      const ang = (sideAngleDeg * Math.PI) / 180
      const edgeR = { x: a + W_eff * Math.cos(ang), y: -d_eff + W_eff * Math.sin(ang) }
      const edgeL = { x: -a - W_eff * Math.cos(ang), y: -d_eff + W_eff * Math.sin(ang) }

      const angleR = Math.atan2(edgeR.y, edgeR.x) * DEG
      const angleL = Math.atan2(edgeL.y, edgeL.x) * DEG
      const to360 = deg => (deg + 360) % 360

      // Signed shortest difference from R->L (-180 ... +180)
      let delta = (to360(angleL) - to360(angleR) + 360) % 360
      if (delta > 180) delta -= 360 // now in -180...180
      const spanSmall = Math.abs(delta) // the small arc (<=180)

      // Take the arc whose midpoint faces the screens (y < 0 => sin < 0)
      const midDeg = (to360(angleR) + delta / 2 + 360) % 360
      const span =
        Math.sin(midDeg / DEG) < 0 // DEG = 180/Math.PI
          ? spanSmall // midpoint in front => small arc
          : 360 - spanSmall // midpoint behind => large arc (wraps around head)

      hFOVdeg = span + bDeg * 2
    }

    // vertical FOV uses eye-to-centre distance only (curvature does not matter)
    vFOVdeg = panelFOVdeg(H, d)
  }

  /* ------------------------------------------------------------------
   *  Minimal placement vectors for UI (prevents undefined errors)
   * -----------------------------------------------------------------*/
  if (setupType === 'single') {
    pivotL = { x: -W_eff / 2, y: -d }
    pivotR = { x: W_eff / 2, y: -d }
    uL = { x: 0, y: 0 }
    uR = { x: 0, y: 0 }
  } else {
    // triple
    const ang = (sideAngleDeg * Math.PI) / 180
    uR = { x: W_eff * Math.cos(ang), y: W_eff * Math.sin(ang) }
    uL = { x: -uR.x, y: uR.y }
    pivotR = { x: a, y: -d }
    pivotL = { x: -a, y: -d }
  }
  // --- Curved-panel SVG paths ------------------------------------
  if (isCurved) {
    const centerY = -d_eff // chord plane
    const screenW = W_eff // chord width
    const depth = s // sagitta

    // Use the UI module to generate SVG arcs
    svgArcs = generateCurvedScreenArcs(screenW, centerY, depth, sideAngleDeg, setupType, a)
  }
  // compute total width for footprint reporting
  if (setupType === 'single') {
    totalWidthCm = in2cm(W_eff)
  } else {
    // For triple setup, calculate the width between the outer edges of the side screens
    // Calculate the x-coordinate of the right edge of the right screen
    const rightEdgeX = pivotR.x + uR.x
    // Calculate the x-coordinate of the left edge of the left screen
    const leftEdgeX = pivotL.x + uL.x
    // Total width is the distance between these two points
    totalWidthCm = in2cm(rightEdgeX - leftEdgeX)
  }
  return {
    sideAngleDeg,
    hFOVdeg,
    vFOVdeg,
    cm: { distance: distCm, bezel: bezelMm, totalWidth: totalWidthCm },
    geom: { pivotL, pivotR, uL, uR, svgArcs },
  }
}
