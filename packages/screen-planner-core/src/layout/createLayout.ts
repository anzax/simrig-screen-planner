import type { ScreenConfigState } from '../input/types'
import type { CalculationResults } from '../calculation/types'
import type { SimRigLayout } from './types'
import { createScreen, createViewPoint, createFovRay, createRigBase } from './entityFactory'
import { generateScreenDebugPoints, generateRigBaseDebugPoints, aggregateBounds } from './debug'

export function createLayout(
  config: ScreenConfigState,
  calculations: CalculationResults
): SimRigLayout.Layout {
  const eye = { x: 0, y: 0, z: 0 }

  const RIG_WIDTH_MM = 600
  const RIG_DEPTH_MM = 1500
  const HEAD_OFFSET_MM = 100

  const screenWidth = calculations.dimensions.panel.width
  const screenHeight = calculations.dimensions.panel.height
  const bezel = config.bezel.width.value
  const isCurved = config.curvature.isCurved.value
  const radius = config.curvature.radius.value
  const sideAngle = calculations.angles.actualSideAngle
  const setup = config.arrangement.type.value

  const screens: SimRigLayout.Screen[] = []

  const centerScreen = createScreen({
    position: { x: 0, y: 0, z: -config.distance.eye.value },
    rotation: { x: 0, y: 0, z: 0 },
    width: screenWidth,
    height: screenHeight,
    bezelWidth: bezel,
    isCurved,
    curveRadius: isCurved ? radius : undefined,
  })
  screens.push(centerScreen)

  if (setup === 'triple') {
    const angleRad = (Math.PI / 180) * sideAngle
    const a = screenWidth / 2 + bezel
    const pivotL = { x: -a, z: -config.distance.eye.value }
    const pivotR = { x: a, z: -config.distance.eye.value }
    const uR = {
      x: screenWidth * Math.cos(angleRad),
      z: screenWidth * Math.sin(angleRad),
    }
    const uL = { x: -uR.x, z: uR.z }
    const leftPos = {
      x: pivotL.x + uL.x / 2,
      y: 0,
      z: pivotL.z + uL.z / 2,
    }
    const rightPos = {
      x: pivotR.x + uR.x / 2,
      y: 0,
      z: pivotR.z + uR.z / 2,
    }
    screens.push(
      createScreen({
        position: leftPos,
        rotation: { x: 0, y: sideAngle, z: 0 },
        width: screenWidth,
        height: screenHeight,
        bezelWidth: bezel,
        isCurved,
        curveRadius: isCurved ? radius : undefined,
      })
    )
    screens.push(
      createScreen({
        position: rightPos,
        rotation: { x: 0, y: -sideAngle, z: 0 },
        width: screenWidth,
        height: screenHeight,
        bezelWidth: bezel,
        isCurved,
        curveRadius: isCurved ? radius : undefined,
      })
    )
  }

  const viewPoint = createViewPoint({
    position: eye,
    rotation: { x: 0, y: 0, z: 0 },
    eyeHeight: calculations.dimensions.panel.height / 2,
    fov: calculations.fov,
  })

  const rigBase = createRigBase({
    position: { x: 0, y: 0, z: RIG_DEPTH_MM / 2 - HEAD_OFFSET_MM },
    rotation: { x: 0, y: 0, z: 0 },
    width: RIG_WIDTH_MM,
    depth: RIG_DEPTH_MM,
  })

  const fovRays: SimRigLayout.FovRay[] = []
  const angles = [-calculations.fov.horizontal / 2, calculations.fov.horizontal / 2]
  angles.forEach(angle => {
    const rad = (Math.PI / 180) * angle
    fovRays.push(
      createFovRay({
        origin: eye,
        position: eye,
        rotation: { x: 0, y: angle, z: 0 },
        direction: { x: Math.sin(rad), y: 0, z: -Math.cos(rad) },
        length: config.distance.eye.value,
        angle,
      })
    )
  })

  const debugPoints = [
    ...screens.flatMap(s => generateScreenDebugPoints(s)),
    ...generateRigBaseDebugPoints(rigBase),
  ]
  const bounds = aggregateBounds(debugPoints.map(p => p.position).concat(eye))

  return {
    screens,
    viewPoint,
    rigBase,
    fovRays,
    bounds,
    debug: { enabled: false, points: debugPoints },
  }
}
