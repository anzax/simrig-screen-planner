import { cm2in } from './conversions'

/* ------------------------------------------------------------------
 *  Bézier helper for curved-panel SVG preview
 * -----------------------------------------------------------------*/
export function curvedScreenBezier(
  chordW,
  centerY,
  sagittaIn,
  yawDeg = 0,
  mirror = false,
  pivotX = 0
) {
  const half = chordW / 2
  let p0 = { x: -half, y: centerY }
  // Pull the midpoint *toward* the viewer (y closer to 0 -> less negative)
  let p1 = { x: 0, y: centerY - sagittaIn }
  let p2 = { x: half, y: centerY }

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

  p0 = rot(p0)
  p1 = rot(p1)
  p2 = rot(p2)

  if (mirror) {
    p0.x = 2 * pivotX - p0.x
    p1.x = 2 * pivotX - p1.x
    p2.x = 2 * pivotX - p2.x
  }

  return {
    type: 'bezier',
    startX: p0.x,
    startY: p0.y,
    controlX: p1.x,
    controlY: p1.y,
    endX: p2.x,
    endY: p2.y,
    path: `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`,
  }
}

/**
 * Generates SVG arcs for curved screens
 */
export function generateCurvedScreenArcs(
  screenW,
  centerY,
  depth,
  sideAngleDeg,
  setupType,
  pivotDistance
) {
  const svgArcs = []

  if (setupType === 'single') {
    svgArcs.push(curvedScreenBezier(screenW, centerY, depth, 0, false, 0))
  } else {
    // triple
    svgArcs.push(curvedScreenBezier(screenW, centerY, depth, 0, false, 0)) // centre
    svgArcs.push(curvedScreenBezier(screenW, centerY, depth, sideAngleDeg, true, pivotDistance)) // right
    svgArcs.push(curvedScreenBezier(screenW, centerY, depth, -sideAngleDeg, true, -pivotDistance)) // left
  }

  return svgArcs
}

export function calculateSvgLayout(geomData, rigConstants) {
  const scale = 8
  const { pivotL, pivotR, uL, uR, svgArcs } = geomData
  const endL = { x: pivotL.x + uL.x, y: pivotL.y + uL.y }
  const endR = { x: pivotR.x + uR.x, y: pivotR.y + uR.y }

  // Create a fixed set of points for calculating bounds that won't change between curved and flat
  // Use the maximum possible extent of screens to ensure consistent container size
  const fixedPts = [
    // Eye position
    { x: 0, y: 0 },
    // Pivot points for screens
    pivotL,
    pivotR,
    // End points for screens (use the maximum possible extent)
    { x: Math.min(pivotL.x, endL.x) * 1.2, y: Math.min(pivotL.y, endL.y) * 1.2 },
    { x: Math.max(pivotR.x, endR.x) * 1.2, y: Math.max(pivotR.y, endR.y, endL.y) * 1.2 },
  ]

  // Add actual screen points for rendering
  const pts = [...fixedPts, endL, endR]

  if (svgArcs && svgArcs.length) {
    svgArcs.forEach(arc => {
      if (arc.type === 'bezier') {
        // For Bézier curves, use the pre-calculated points
        pts.push(
          { x: arc.startX, y: arc.startY },
          { x: arc.endX, y: arc.endY },
          // Include control point for accurate bounds calculation
          { x: arc.controlX, y: arc.controlY }
        )
      } else {
        // For standard arcs, compute the two visible endpoints
        const sx = arc.centerX + arc.radius * Math.cos(arc.startAngle)
        const sy = arc.centerY + arc.radius * Math.sin(arc.startAngle)
        const ex = arc.centerX + arc.radius * Math.cos(arc.endAngle)
        const ey = arc.centerY + arc.radius * Math.sin(arc.endAngle)

        // Also include the center point and midpoint of the arc for better bounds calculation
        const midAngle = (arc.startAngle + arc.endAngle) / 2
        const mx = arc.centerX + arc.radius * Math.cos(midAngle)
        const my = arc.centerY + arc.radius * Math.sin(midAngle)

        pts.push(
          { x: sx, y: sy },
          { x: ex, y: ey },
          { x: arc.centerX, y: arc.centerY },
          { x: mx, y: my }
        )
      }
    })
  }

  // Calculate bounds based on all points to ensure everything is visible
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
        if (arc.type === 'bezier') {
          // For Bézier curves, use the pre-calculated points
          return {
            type: 'bezier',
            path: `M ${tx(arc.startX)} ${ty(arc.startY)} Q ${tx(arc.controlX)} ${ty(arc.controlY)} ${tx(arc.endX)} ${ty(arc.endY)}`,
            // Store these points for debugging
            startX: tx(arc.startX),
            startY: ty(arc.startY),
            endX: tx(arc.endX),
            endY: ty(arc.endY),
            controlX: tx(arc.controlX),
            controlY: ty(arc.controlY),
            // Pass through actual deepest point for debugging
            actualDeepestY: arc.actualDeepestY ? ty(arc.actualDeepestY) : undefined,
          }
        } else {
          // For standard arcs, calculate points from center and angles
          const startX = arc.startX || arc.centerX + arc.radius * Math.cos(arc.startAngle)
          const startY = arc.startY || arc.centerY + arc.radius * Math.sin(arc.startAngle)
          const endX = arc.endX || arc.centerX + arc.radius * Math.cos(arc.endAngle)
          const endY = arc.endY || arc.centerY + arc.radius * Math.sin(arc.endAngle)

          // Determine if the arc is larger than 180 degrees (large-arc-flag)
          const largeArcFlag = Math.abs(arc.endAngle - arc.startAngle) > Math.PI ? 1 : 0

          // Important: Include sweep flag based on angle direction
          const sweepFlag = arc.endAngle > arc.startAngle ? 1 : 0

          // SVG path for arc
          return {
            path: `M ${tx(startX)} ${ty(startY)} A ${arc.radius * scale} ${arc.radius * scale} 0 ${largeArcFlag} ${sweepFlag} ${tx(endX)} ${ty(endY)}`,
            // Store these points for debugging
            centerX: tx(arc.centerX),
            centerY: ty(arc.centerY),
            startX: tx(startX),
            startY: ty(startY),
            endX: tx(endX),
            endY: ty(endY),
            // Pass through actual deepest point for debugging
            actualDeepestY: arc.actualDeepestY ? ty(arc.actualDeepestY) : undefined,
          }
        }
      })
    : []

  // Extract screen edges for FOV lines
  const screenEdges = []

  // For flat screens, use the line endpoints
  if (!svgArcs || svgArcs.length === 0) {
    screenEdges.push(
      { x: tx(endL.x), y: ty(endL.y) }, // Left screen outer edge
      { x: tx(pivotL.x), y: ty(pivotL.y) }, // Left screen inner edge
      { x: tx(pivotR.x), y: ty(pivotR.y) }, // Right screen inner edge
      { x: tx(endR.x), y: ty(endR.y) } // Right screen outer edge
    )
  }
  // For curved screens, extract edge points from arcs
  else {
    arcs.forEach(arc => {
      if (arc.type === 'bezier') {
        screenEdges.push({ x: arc.startX, y: arc.startY }, { x: arc.endX, y: arc.endY })
      } else {
        screenEdges.push({ x: arc.startX, y: arc.startY }, { x: arc.endX, y: arc.endY })
      }
    })
  }

  return {
    widthPx: (maxX - minX) * scale + pad * 2,
    heightPx: (maxY - minY) * scale + pad * 2,
    head: { cx: tx(0), cy: ty(0), r: 20 },
    lines: [
      { x1: tx(pivotL.x), y1: ty(pivotL.y), x2: tx(endL.x), y2: ty(endL.y) },
      { x1: tx(pivotR.x), y1: ty(pivotR.y), x2: tx(endR.x), y2: ty(endR.y) },
      { x1: tx(pivotL.x), y1: ty(pivotL.y), x2: tx(pivotR.x), y2: ty(pivotR.y) },
    ],
    screenEdges: screenEdges,
    rig: rigRect,
    arcs: arcs,
  }
}
