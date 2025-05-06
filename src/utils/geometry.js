import { cm2in, in2cm } from './conversions'
import { ASPECT_RATIOS } from './constants'

// Calculate the optimal angle based on screen dimensions and viewing distance
export function calculateOptimalAngle(screen, distance) {
  const { diagIn, ratio, bezelMm } = screen
  const { distCm } = distance

  if (!diagIn || !ratio || !distCm) return 60

  return parseFloat(
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
}

export function calculateScreenGeometry(
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
  curveRadius = 1000
) {
  const d = cm2in(distCm)
  const bezel = cm2in(bezelMm / 10)

  // Calculate screen dimensions based on input mode
  let W, H

  if (inputMode === 'diagonal') {
    const ar = ASPECT_RATIOS[ratio]
    const diagFac = Math.hypot(ar.w, ar.h)
    // Convert bezel from mm to inches and add it to the diagonal
    const bezelInches = (bezelMm * 2) / 25.4
    const effectiveDiagIn = diagIn + bezelInches
    W = effectiveDiagIn * (ar.w / diagFac)
    H = effectiveDiagIn * (ar.h / diagFac)
  } else {
    // Convert mm to inches
    W = screenWidth / 25.4
    H = screenHeight / 25.4
  }

  // Initialize curved screen variables
  let C = W // Default chord length is width (for flat screens)
  let s = 0 // Default sagitta is 0 (for flat screens)
  let theta = 0 // Default central angle is 0 (for flat screens)
  let Rin = 0 // Default radius in inches
  let d_chord = d // Default chord distance is the actual distance (for flat screens)

  // Calculate curved screen geometry if enabled
  if (isCurved) {
    // Convert radius from mm to inches
    Rin = curveRadius / 25.4

    // Calculate central angle (theta = arc length / radius)
    theta = W / Rin

    // Calculate chord length (C = 2R * sin(theta/2))
    C = 2 * Rin * Math.sin(theta / 2)

    // Calculate sagitta (s = R * (1 - cos(theta/2)))
    s = Rin * (1 - Math.cos(theta / 2))

    // For curved screens, d is now the distance to the center of the curve
    // Calculate the distance to the chord plane
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

  // side screen angle
  let sideAngleDeg = 0

  if (setupType === 'triple') {
    if (angleMode === 'auto') {
      // Use C and d for curved screens (d is now distance to center of curve)
      const x_c = ((isCurved ? C : W) * d * d) / (d * d + a * a)
      const y_c = (a * x_c - d * d) / d
      const u_x = 2 * (x_c - a)
      const u_y = 2 * (y_c + d)
      sideAngleDeg = (Math.abs(Math.atan2(u_y, u_x)) * 180) / Math.PI
    } else {
      // Use manual angle
      sideAngleDeg = manualAngle
    }
  }

  // horizontal FOV (including bezels)
  let hFOVdeg, vFOVdeg, totalWidthCm
  let pivotR, pivotL, uR, uL
  // Array to store SVG arcs for curved screens
  let svgArcs = []

  if (setupType === 'single') {
    // For single screen, FOV is just the angle of the screen from the eye
    const hFOVrad = 2 * Math.atan((isCurved ? C : W) / 2 / d)
    hFOVdeg = (hFOVrad * 180) / Math.PI

    // vertical FOV (not affected by curvature)
    vFOVdeg = (2 * Math.atan(H / 2 / d) * 180) / Math.PI

    // For single screen, total width is just the screen width
    totalWidthCm = in2cm(isCurved ? C : W)

    // Set up geometry for visualization
    pivotR = { x: (isCurved ? C : W) / 2, y: -d }
    pivotL = { x: -(isCurved ? C : W) / 2, y: -d }
    uR = { x: 0, y: 0 }
    uL = { x: 0, y: 0 }

    // Add SVG arc for curved screen
    if (isCurved) {
      svgArcs.push({
        centerX: 0,
        centerY: -d,
        radius: Rin,
        startAngle: -theta / 2,
        endAngle: theta / 2,
      })
    }
  } else {
    // For triple screen, calculate FOV including all screens and bezels

    // Calculate vectors for side screens based on angle
    const angleRad = (sideAngleDeg * Math.PI) / 180
    const sideScreenWidth = isCurved ? C : W

    // Calculate the position of the outer edge of the side screens
    const centerEdgeX = (isCurved ? C : W) / 2
    const centerEdgeY = -d

    // Calculate the position of the outer edge of the right side screen
    const rightOuterX = centerEdgeX + sideScreenWidth * Math.cos(angleRad)
    const rightOuterY = centerEdgeY + sideScreenWidth * Math.sin(angleRad)

    // Calculate the angle from eye to the outer edge of the right side screen
    // Use Math.atan2 to get the correct quadrant
    const rightOuterAngle = Math.atan2(rightOuterY, rightOuterX)

    // Calculate the angle from eye to the outer edge of the left side screen (symmetrical)
    const leftOuterAngle = Math.atan2(rightOuterY, -rightOuterX)

    // Total horizontal FOV is the angle between the outer edges of the side screens
    // plus the angles for the bezels
    const bezelAngle = 2 * Math.atan(bezel / d)

    // Calculate the absolute difference between the angles and ensure it's positive
    const angleDiff = Math.abs(leftOuterAngle - rightOuterAngle)

    // If we're in the wrong quadrants, we need to adjust the calculation
    // The total FOV should be the sum of the absolute values of the angles
    const totalAngle =
      rightOuterAngle < 0 && leftOuterAngle > 0
        ? Math.abs(rightOuterAngle) + Math.abs(leftOuterAngle)
        : angleDiff

    hFOVdeg = (totalAngle * 180) / Math.PI + ((bezelAngle * 180) / Math.PI) * 2

    // vertical FOV (not affected by curvature)
    vFOVdeg = (2 * Math.atan(H / 2 / d) * 180) / Math.PI

    // Calculate vectors for side screen positioning
    const u_x = (isCurved ? C : W) * Math.cos(angleRad)
    const u_y = (isCurved ? C : W) * Math.sin(angleRad)

    // total width between outer edges of side screens
    pivotR = { x: a, y: -d }
    pivotL = { x: -a, y: -d }
    uR = { x: u_x, y: u_y }
    uL = { x: -u_x, y: u_y }
    const outerR = { x: pivotR.x + uR.x, y: pivotR.y + uR.y }
    const outerL = { x: pivotL.x + uL.x, y: pivotL.y + uL.y }
    const totalWidthIn = outerR.x - outerL.x
    totalWidthCm = in2cm(totalWidthIn)

    // Add SVG arcs for curved screens
    if (isCurved) {
      // Center screen
      svgArcs.push({
        centerX: 0,
        centerY: -d,
        radius: Rin,
        startAngle: -theta / 2,
        endAngle: theta / 2,
      })

      // Left and right screens (rotated)
      if (setupType === 'triple') {
        // Calculate the edges of the center screen
        const centerLeftEdgeX = -C / 2
        const centerLeftEdgeY = -d
        const centerRightEdgeX = C / 2
        const centerRightEdgeY = -d

        // Calculate the angle from the center of the center screen to its edge
        const edgeAngle = Math.atan2(s, C / 2)

        // Calculate the center positions of the side screens
        // The side screens should be positioned so that their edges touch the center screen's edges
        const leftCenterX = centerLeftEdgeX - Rin * Math.cos(Math.PI / 2 - edgeAngle - angleRad)
        const leftCenterY = centerLeftEdgeY - Rin * Math.sin(Math.PI / 2 - edgeAngle - angleRad)
        const rightCenterX = centerRightEdgeX + Rin * Math.cos(Math.PI / 2 - edgeAngle - angleRad)
        const rightCenterY = centerRightEdgeY - Rin * Math.sin(Math.PI / 2 - edgeAngle - angleRad)

        // Add arcs for side screens
        svgArcs.push({
          centerX: leftCenterX,
          centerY: leftCenterY,
          radius: Rin,
          startAngle: Math.PI - angleRad - theta / 2,
          endAngle: Math.PI - angleRad + theta / 2,
        })

        svgArcs.push({
          centerX: rightCenterX,
          centerY: rightCenterY,
          radius: Rin,
          startAngle: angleRad - theta / 2,
          endAngle: angleRad + theta / 2,
        })
      }
    }
  }

  return {
    sideAngleDeg,
    hFOVdeg,
    vFOVdeg,
    cm: { distance: distCm, bezel: bezelMm, totalWidth: totalWidthCm },
    geom: { pivotL, pivotR, uL, uR, svgArcs },
    // Add curved screen info to the returned data
    curved: {
      isCurved,
      curveRadius,
      chordIn: isCurved ? C : W,
      sagittaIn: s,
      theta: theta,
      chordDistanceIn: isCurved ? d_chord : d,
    },
    // Add screen dimensions info
    screen: {
      inputMode,
      widthMm: inputMode === 'diagonal' ? Math.round(W * 25.4) : screenWidth,
      heightMm: inputMode === 'diagonal' ? Math.round(H * 25.4) : screenHeight,
    },
  }
}

export function calculateSvgLayout(geomData, rigConstants) {
  const scale = 8
  const { pivotL, pivotR, uL, uR, svgArcs } = geomData
  const endL = { x: pivotL.x + uL.x, y: pivotL.y + uL.y }
  const endR = { x: pivotR.x + uR.x, y: pivotR.y + uR.y }

  // bounds from screens & eye
  const pts = [pivotL, pivotR, endL, endR, { x: 0, y: 0 }]
  const minX = Math.min(...pts.map(p => p.x)),
    maxX = Math.max(...pts.map(p => p.x))
  const minY = Math.min(...pts.map(p => p.y)),
    maxY = Math.max(...pts.map(p => p.y))
  const pad = 10
  const tx = x => (x - minX) * scale + pad
  const ty = y => (y - minY) * scale + pad

  // rig footprint under screens
  const rigW = cm2in(rigConstants.RIG_W_CM)
  const rigL = cm2in(rigConstants.RIG_L_CM)
  const halfW = rigW / 2
  const rigFrontY = -(rigL - cm2in(rigConstants.HEAD_OFFSET_CM))
  const rigRect = { x: tx(-halfW), y: ty(rigFrontY), w: rigW * scale, h: rigL * scale }

  // Process SVG arcs for curved screens
  const arcs = svgArcs
    ? svgArcs.map(arc => {
        // Convert arc to SVG path
        const startX = arc.centerX + arc.radius * Math.cos(arc.startAngle)
        const startY = arc.centerY + arc.radius * Math.sin(arc.startAngle)
        const endX = arc.centerX + arc.radius * Math.cos(arc.endAngle)
        const endY = arc.centerY + arc.radius * Math.sin(arc.endAngle)

        // Determine if the arc is larger than 180 degrees (large-arc-flag)
        const largeArcFlag = Math.abs(arc.endAngle - arc.startAngle) > Math.PI ? 1 : 0

        // SVG path for arc
        return {
          path: `M ${tx(startX)} ${ty(startY)} A ${arc.radius * scale} ${arc.radius * scale} 0 ${largeArcFlag} 1 ${tx(endX)} ${ty(endY)}`,
        }
      })
    : []

  return {
    widthPx: (maxX - minX) * scale + pad * 2,
    heightPx: (maxY - minY) * scale + pad * 2,
    head: { cx: tx(0), cy: ty(0), r: 20 },
    lines: [
      { x1: tx(pivotL.x), y1: ty(pivotL.y), x2: tx(endL.x), y2: ty(endL.y) },
      { x1: tx(pivotR.x), y1: ty(pivotR.y), x2: tx(endR.x), y2: ty(endR.y) },
      { x1: tx(pivotL.x), y1: ty(pivotL.y), x2: tx(pivotR.x), y2: ty(pivotR.y) },
    ],
    rig: rigRect,
    arcs: arcs,
  }
}
