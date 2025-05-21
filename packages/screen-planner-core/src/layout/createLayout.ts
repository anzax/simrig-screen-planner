import type { ScreenConfigState } from '../input/types'
import type { CalculationResults } from '../calculation/types'
import type { SimRigLayout } from './types'
import { createScreen, createViewPoint, createFovRay } from './entityFactory'
import { generateScreenDebugPoints, aggregateBounds } from './debug'

export function createLayout(
  config: ScreenConfigState,
  calculations: CalculationResults
): SimRigLayout.Layout {
  const eye = { x: 0, y: 0, z: 0 }

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
    const offset = screenWidth / 2 + bezel + screenWidth / 2
    screens.push(
      createScreen({
        position: {
          x: -offset * Math.cos(angleRad),
          y: 0,
          z: -config.distance.eye.value + offset * Math.sin(angleRad),
        },
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
        position: {
          x: offset * Math.cos(angleRad),
          y: 0,
          z: -config.distance.eye.value + offset * Math.sin(angleRad),
        },
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

  const debugPoints = screens.flatMap(s => generateScreenDebugPoints(s))
  const bounds = aggregateBounds(debugPoints.map(p => p.position).concat(eye))

  return {
    screens,
    viewPoint,
    fovRays,
    bounds,
    debug: { enabled: false, points: debugPoints },
  }
}
