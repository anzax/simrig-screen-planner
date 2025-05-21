import { clamp } from '../utils/math'
import type { ScreenConfigState, SetupType } from '../input/types'
import {
  AngleCalculations,
  CalculationResults,
  CurvatureCalculations,
  FOVCalculations,
  FootprintCalculations,
  ScreenDimensions,
} from './types'
import { inchesToMm, degToRad, radToDeg } from './units'

const ASPECT = {
  '16:9': { w: 16, h: 9 },
  '21:9': { w: 21, h: 9 },
  '32:9': { w: 32, h: 9 },
} as const

function calculateScreenDimensionsFromDiagonal(
  diagonalIn: number,
  ratio: keyof typeof ASPECT,
  bezelMm: number
): ScreenDimensions {
  const diagMm = inchesToMm(diagonalIn)
  const ar = ASPECT[ratio]
  const diagFac = Math.hypot(ar.w, ar.h)
  const panelWidth = diagMm * (ar.w / diagFac)
  const panelHeight = diagMm * (ar.h / diagFac)
  const physicalDiag = diagMm + bezelMm * 2
  const physicalWidth = physicalDiag * (ar.w / diagFac)
  const physicalHeight = physicalDiag * (ar.h / diagFac)
  return {
    panel: {
      width: panelWidth,
      height: panelHeight,
      diagonalLength: diagMm,
    },
    physical: {
      width: physicalWidth,
      height: physicalHeight,
      diagonalLength: physicalDiag,
    },
  }
}

function calculateScreenDimensionsFromManual(
  widthMm: number,
  heightMm: number,
  bezelMm: number
): ScreenDimensions {
  return {
    panel: {
      width: widthMm - bezelMm * 2,
      height: heightMm - bezelMm * 2,
      diagonalLength: Math.hypot(widthMm - bezelMm * 2, heightMm - bezelMm * 2),
    },
    physical: {
      width: widthMm,
      height: heightMm,
      diagonalLength: Math.hypot(widthMm, heightMm),
    },
  }
}

export function calculateScreenDimensions(config: ScreenConfigState): ScreenDimensions {
  const { size, bezel } = config
  if (size.inputMode.value === 'manual') {
    return calculateScreenDimensionsFromManual(
      size.width.value,
      size.height.value,
      bezel.width.value
    )
  }
  return calculateScreenDimensionsFromDiagonal(
    size.diagonal.value,
    size.aspectRatio.value,
    bezel.width.value
  )
}

function calculateCurvedGeometry(width: number, radius: number) {
  const theta = 2 * Math.asin(width / (2 * radius))
  const chord = 2 * radius * Math.sin(theta / 2)
  const sagitta = radius * (1 - Math.cos(theta / 2))
  return { chord, sagitta, theta }
}

function calculateNormalizedValues(W: number, d: number, isCurved: boolean, C: number, s: number) {
  return {
    W_eff: isCurved ? C : W,
    d_eff: isCurved ? d - s : d,
  }
}

function calculateAutoSideAngle(a: number, W_eff: number, d_eff: number) {
  const x_c = (W_eff * d_eff * d_eff) / (d_eff * d_eff + a * a)
  const y_c = (a * x_c - d_eff * d_eff) / d_eff
  const u_x = 2 * (x_c - a)
  const u_y = 2 * (y_c + d_eff)
  return Math.abs(radToDeg(Math.atan2(u_y, u_x)))
}

export function calculateAngles(
  config: ScreenConfigState,
  dimensions: ScreenDimensions
): AngleCalculations {
  const d = config.distance.eye.value
  const bezel = config.bezel.width.value
  const setupType = config.arrangement.type.value
  const angleMode = config.arrangement.angleMode.value
  const manualAngle = config.arrangement.manualAngle.value
  const isCurved = config.curvature.isCurved.value
  const radius = config.curvature.radius.value

  const W = dimensions.panel.width
  let C = W
  let s = 0
  if (isCurved && radius > 0) {
    const geom = calculateCurvedGeometry(W, radius)
    C = geom.chord
    s = geom.sagitta
  }
  const a = isCurved ? C / 2 + bezel : W / 2 + bezel
  const { W_eff, d_eff } = calculateNormalizedValues(W, d, isCurved, C, s)
  const recommended =
    setupType === 'triple' ? clamp(calculateAutoSideAngle(a, W_eff, d_eff), 0, 90) : 0
  const actual = setupType === 'triple' ? (angleMode === 'auto' ? recommended : manualAngle) : 0
  return {
    recommendedSideAngle: recommended,
    actualSideAngle: actual,
  }
}

function calculateFOVWidth(width: number, distance: number) {
  return radToDeg(2 * Math.atan(width / (2 * distance)))
}

export function calculateFOV(
  config: ScreenConfigState,
  dimensions: ScreenDimensions,
  angles: AngleCalculations
): FOVCalculations {
  const bezel = config.bezel.width.value
  const d = config.distance.eye.value
  const setupType = config.arrangement.type.value
  const isCurved = config.curvature.isCurved.value
  const radius = config.curvature.radius.value

  const W = dimensions.panel.width
  let C = W
  let s = 0
  if (isCurved && radius > 0) {
    const geom = calculateCurvedGeometry(W, radius)
    C = geom.chord
    s = geom.sagitta
  }

  const { W_eff, d_eff } = calculateNormalizedValues(W, d, isCurved, C, s)
  const a = isCurved ? C / 2 + bezel : W / 2 + bezel

  const singleFOV = calculateFOVWidth(W_eff, d_eff)
  const bezelFOV = calculateFOVWidth(bezel * 2, d_eff)
  if (setupType === 'single') {
    return { horizontal: singleFOV, vertical: calculateFOVWidth(dimensions.panel.height, d) }
  }

  const ang = degToRad(angles.actualSideAngle)
  const edgeR = { x: a + W_eff * Math.cos(ang), y: -d_eff + W_eff * Math.sin(ang) }
  const edgeL = { x: -a - W_eff * Math.cos(ang), y: -d_eff + W_eff * Math.sin(ang) }
  const angleR = radToDeg(Math.atan2(edgeR.y, edgeR.x))
  const angleL = radToDeg(Math.atan2(edgeL.y, edgeL.x))
  const to360 = (deg: number) => (deg + 360) % 360
  let delta = (to360(angleL) - to360(angleR) + 360) % 360
  if (delta > 180) delta -= 360
  const spanSmall = Math.abs(delta)
  const midDeg = (to360(angleR) + delta / 2 + 360) % 360
  const span = Math.sin(degToRad(midDeg)) < 0 ? spanSmall : 360 - spanSmall
  const horizontal = span + bezelFOV

  return {
    horizontal,
    vertical: calculateFOVWidth(dimensions.panel.height, d),
  }
}

function calculatePlacementVectors(
  setupType: SetupType,
  W_eff: number,
  d: number,
  sideAngleDeg: number,
  a: number
) {
  if (setupType === 'single') {
    return {
      pivotL: { x: -a, y: -d },
      pivotR: { x: a, y: -d },
      uL: { x: 0, y: 0 },
      uR: { x: 0, y: 0 },
    }
  }
  const ang = degToRad(sideAngleDeg)
  const uR = { x: W_eff * Math.cos(ang), y: W_eff * Math.sin(ang) }
  const uL = { x: -uR.x, y: uR.y }
  const pivotR = { x: a, y: -d }
  const pivotL = { x: -a, y: -d }
  return { pivotL, pivotR, uL, uR }
}

function calculateTotalWidth(
  setupType: SetupType,
  W_eff: number,
  pivotL: { x: number; y: number },
  pivotR: { x: number; y: number },
  uL: { x: number; y: number },
  uR: { x: number; y: number },
  isCurved = false,
  curveRadiusMm = 0,
  bezelMm = 0
) {
  if (setupType === 'single') {
    const bezel = bezelMm
    if (isCurved && curveRadiusMm > 0) {
      const theta = 2 * Math.asin(W_eff / 2 / curveRadiusMm)
      const radiusOut = curveRadiusMm + bezel
      return 2 * radiusOut * Math.sin(theta / 2)
    }
    return W_eff + 2 * bezel
  }
  const rightEdgeX = pivotR.x + uR.x
  const leftEdgeX = pivotL.x + uL.x
  const activeSpan = rightEdgeX - leftEdgeX
  const bezel = pivotR.x - W_eff / 2
  const angleRad = Math.acos(uR.x / W_eff)
  const bezelProj = bezel * Math.cos(angleRad)
  return activeSpan + 2 * bezelProj
}

export function calculateFootprint(
  config: ScreenConfigState,
  dimensions: ScreenDimensions,
  angles: AngleCalculations
): FootprintCalculations {
  const d = config.distance.eye.value
  const bezel = config.bezel.width.value
  const setupType = config.arrangement.type.value
  const isCurved = config.curvature.isCurved.value
  const radius = config.curvature.radius.value
  const W = dimensions.panel.width
  let C = W
  let s = 0
  if (isCurved && radius > 0) {
    const geom = calculateCurvedGeometry(W, radius)
    C = geom.chord
    s = geom.sagitta
  }
  const { W_eff, d_eff } = calculateNormalizedValues(W, d, isCurved, C, s)
  const a = isCurved ? C / 2 + bezel : W / 2 + bezel
  const vectors = calculatePlacementVectors(setupType, W_eff, d, angles.actualSideAngle, a)
  const totalWidth = calculateTotalWidth(
    setupType,
    W_eff,
    vectors.pivotL,
    vectors.pivotR,
    vectors.uL,
    vectors.uR,
    isCurved,
    radius,
    bezel
  )
  return { totalWidth, depth: d_eff }
}

export function calculateCurvature(
  config: ScreenConfigState,
  dimensions: ScreenDimensions
): CurvatureCalculations {
  const radius = config.curvature.radius.value
  const width = dimensions.panel.width
  const geom = calculateCurvedGeometry(width, radius)
  return {
    chordLength: geom.chord,
    sagitta: geom.sagitta,
    radius,
    theta: geom.theta,
  }
}

export function calculateResults(config: ScreenConfigState): CalculationResults {
  const dimensions = calculateScreenDimensions(config)
  const angles = calculateAngles(config, dimensions)
  const fov = calculateFOV(config, dimensions, angles)
  const footprint = calculateFootprint(config, dimensions, angles)
  const curvature = config.curvature.isCurved.value
    ? calculateCurvature(config, dimensions)
    : undefined
  return { dimensions, angles, fov, footprint, curvature }
}
