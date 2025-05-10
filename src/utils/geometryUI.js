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
  // Convert to centered coordinate system
  const centerX = 0
  const centerY = 0

  const { pivotL, pivotR, uL, uR, svgArcs } = geomData

  // Convert all coordinates to be relative to center (0,0)
  const relativePivotL = { 
    x: pivotL.x - centerX, 
    y: pivotL.y - centerY 
  }

  const relativePivotR = { 
    x: pivotR.x - centerX, 
    y: pivotR.y - centerY 
  }

  const endL = { 
    x: relativePivotL.x + uL.x, 
    y: relativePivotL.y + uL.y 
  }

  const endR = { 
    x: relativePivotR.x + uR.x, 
    y: relativePivotR.y + uR.y 
  }

  // Calculate rig position relative to center
  const rigW = cm2in(rigConstants.RIG_W_CM)
  const rigL = cm2in(rigConstants.RIG_L_CM)

  // Head is always at center in new coordinate system
  const head = {
    r: rigConstants.headRadius || 15
  }

  // Rig dimensions
  const rig = {
    w: rigW,
    h: rigL
  }

  // Process SVG arcs for curved screens
  const arcs = svgArcs
    ? svgArcs.map(arc => {
        if (arc.type === 'bezier') {
          // For Bézier curves, convert to relative coordinates
          return {
            type: 'bezier',
            path: `M ${arc.startX - centerX} ${arc.startY - centerY} Q ${arc.controlX - centerX} ${arc.controlY - centerY} ${arc.endX - centerX} ${arc.endY - centerY}`,
            startX: arc.startX - centerX,
            startY: arc.startY - centerY,
            endX: arc.endX - centerX,
            endY: arc.endY - centerY,
            controlX: arc.controlX - centerX,
            controlY: arc.controlY - centerY,
            actualDeepestY: arc.actualDeepestY ? arc.actualDeepestY - centerY : undefined,
          }
        } else {
          // For standard arcs, convert to relative coordinates
          const startX = (arc.startX || arc.centerX + arc.radius * Math.cos(arc.startAngle)) - centerX
          const startY = (arc.startY || arc.centerY + arc.radius * Math.sin(arc.startAngle)) - centerY
          const endX = (arc.endX || arc.centerX + arc.radius * Math.cos(arc.endAngle)) - centerX
          const endY = (arc.endY || arc.centerY + arc.radius * Math.sin(arc.endAngle)) - centerY
          const centerX_rel = arc.centerX - centerX
          const centerY_rel = arc.centerY - centerY

          // Determine if the arc is larger than 180 degrees (large-arc-flag)
          const largeArcFlag = Math.abs(arc.endAngle - arc.startAngle) > Math.PI ? 1 : 0

          // Include sweep flag based on angle direction
          const sweepFlag = arc.endAngle > arc.startAngle ? 1 : 0

          // SVG path for arc
          return {
            path: `M ${startX} ${startY} A ${arc.radius} ${arc.radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`,
            centerX: centerX_rel,
            centerY: centerY_rel,
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            actualDeepestY: arc.actualDeepestY ? arc.actualDeepestY - centerY : undefined,
          }
        }
      })
    : []

  // Extract screen edges for FOV lines
  const screenEdges = []

  // For flat screens, use the line endpoints
  if (!svgArcs || svgArcs.length === 0) {
    screenEdges.push(
      { x: endL.x, y: endL.y }, // Left screen outer edge
      { x: relativePivotL.x, y: relativePivotL.y }, // Left screen inner edge
      { x: relativePivotR.x, y: relativePivotR.y }, // Right screen inner edge
      { x: endR.x, y: endR.y } // Right screen outer edge
    )
  }
  // For curved screens, use the arc endpoints
  else {
    arcs.forEach(arc => {
      if (arc.type === 'bezier') {
        screenEdges.push({ x: arc.startX, y: arc.startY }, { x: arc.endX, y: arc.endY })
      } else {
        screenEdges.push({ x: arc.startX, y: arc.startY }, { x: arc.endX, y: arc.endY })
      }
    })
  }

  // Calculate lines for flat screens
  const lines = [
    { x1: relativePivotL.x, y1: relativePivotL.y, x2: endL.x, y2: endL.y },
    { x1: relativePivotR.x, y1: relativePivotR.y, x2: endR.x, y2: endR.y },
    { x1: relativePivotL.x, y1: relativePivotL.y, x2: relativePivotR.x, y2: relativePivotR.y },
  ]

  // Calculate total width for viewport scaling
  const points = [
    { x: 0, y: 0 }, // Center point
    relativePivotL, relativePivotR, endL, endR,
    ...screenEdges
  ]

  // Add arc points if they exist
  if (arcs.length > 0) {
    arcs.forEach(arc => {
      points.push(
        { x: arc.startX, y: arc.startY },
        { x: arc.endX, y: arc.endY }
      )
      if (arc.type === 'bezier') {
        points.push({ x: arc.controlX, y: arc.controlY })
      }
    })
  }

  // Calculate bounds for total width
  const minX = Math.min(...points.map(p => p.x))
  const maxX = Math.max(...points.map(p => p.x))
  const totalWidth = Math.abs(maxX - minX) * 1.2 // Add 20% margin

  return {
    head,
    rig,
    lines,
    screenEdges,
    arcs,
    totalWidth
  }
}
