import type { SimRigLayout } from './types'

export function generateScreenDebugPoints(
  screen: SimRigLayout.Screen
): SimRigLayout.Layout['debug']['points'] {
  const { width, height, position } = screen
  const hw = width / 2
  const hh = height / 2
  const corners = [
    { x: position.x - hw, y: position.y + hh, z: position.z },
    { x: position.x + hw, y: position.y + hh, z: position.z },
    { x: position.x - hw, y: position.y - hh, z: position.z },
    { x: position.x + hw, y: position.y - hh, z: position.z },
  ]
  return corners.map((p, i) => ({ position: p, label: `corner-${i}` }))
}

export function aggregateBounds(points: SimRigLayout.Point3D[]): {
  min: SimRigLayout.Point3D
  max: SimRigLayout.Point3D
} {
  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const zs = points.map(p => p.z)
  return {
    min: { x: Math.min(...xs), y: Math.min(...ys), z: Math.min(...zs) },
    max: { x: Math.max(...xs), y: Math.max(...ys), z: Math.max(...zs) },
  }
}
