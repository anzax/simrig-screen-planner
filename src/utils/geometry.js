import { cm2in, in2cm } from './conversions'

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
    const ar =
      ratio === '16:9' ? { w: 16, h: 9 } : ratio === '21:9' ? { w: 21, h: 9 } : { w: 32, h: 9 }
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

  const a = W / 2 + bezel

  // Note: isCurved and curveRadius are accepted but not used in calculations yet
  // This is a placeholder for future implementation

  // side screen angle
  let sideAngleDeg = 0

  if (setupType === 'triple') {
    if (angleMode === 'auto') {
      const x_c = (W * d * d) / (d * d + a * a)
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

  if (setupType === 'single') {
    // For single screen, FOV is just the angle of the screen from the eye
    const hFOVrad = 2 * Math.atan(W / 2 / d)
    hFOVdeg = (hFOVrad * 180) / Math.PI

    // vertical FOV
    vFOVdeg = (2 * Math.atan(H / 2 / d) * 180) / Math.PI

    // For single screen, total width is just the screen width
    totalWidthCm = in2cm(W)

    // Set up geometry for visualization
    pivotR = { x: W / 2, y: -d }
    pivotL = { x: -W / 2, y: -d }
    uR = { x: 0, y: 0 }
    uL = { x: 0, y: 0 }
  } else {
    // For triple screen, calculate FOV including all screens and bezels
    const hFOVrad = 2 * Math.atan(W / 2 / d)
    hFOVdeg = ((hFOVrad * 180) / Math.PI) * 3 + ((2 * Math.atan(bezel / d) * 180) / Math.PI) * 2

    // vertical FOV
    vFOVdeg = (2 * Math.atan(H / 2 / d) * 180) / Math.PI

    // Calculate vectors for side screens based on angle
    const angleRad = (sideAngleDeg * Math.PI) / 180
    const u_x = W * Math.cos(angleRad)
    const u_y = W * Math.sin(angleRad)

    // total width between outer edges of side screens
    pivotR = { x: a, y: -d }
    pivotL = { x: -a, y: -d }
    uR = { x: u_x, y: u_y }
    uL = { x: -u_x, y: u_y }
    const outerR = { x: pivotR.x + uR.x, y: pivotR.y + uR.y }
    const outerL = { x: pivotL.x + uL.x, y: pivotL.y + uL.y }
    const totalWidthIn = outerR.x - outerL.x
    totalWidthCm = in2cm(totalWidthIn)
  }

  return {
    sideAngleDeg,
    hFOVdeg,
    vFOVdeg,
    cm: { distance: distCm, bezel: bezelMm, totalWidth: totalWidthCm },
    geom: { pivotL, pivotR, uL, uR },
    // Add curved screen info to the returned data for future use
    curved: { isCurved, curveRadius },
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
  const { pivotL, pivotR, uL, uR } = geomData
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
  }
}
