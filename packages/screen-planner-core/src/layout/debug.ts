import type { SimRigLayout } from './types'

export function generateScreenDebugPoints(
  screen: SimRigLayout.Screen
): SimRigLayout.Layout['debug']['points'] {
  const { width, height, position, id, rotation } = screen
  const hw = width / 2
  const hh = height / 2
  const angleRad = (Math.PI / 180) * rotation.y

  function corner(dx: number, dy: number) {
    const x = position.x + dx * Math.cos(angleRad)
    const z = position.z + dx * Math.sin(angleRad)
    return { x, y: position.y + dy, z }
  }

  const corners = [corner(-hw, hh), corner(hw, hh), corner(hw, -hh), corner(-hw, -hh)]
  return corners.map((p, i) => ({ position: p, label: `${id}-corner-${i}` }))
}

export function generateRigBaseDebugPoints(
  base: SimRigLayout.RigBase
): SimRigLayout.Layout['debug']['points'] {
  const { width, depth, position, id } = base
  const hw = width / 2
  const hd = depth / 2
  const corners = [
    { x: position.x - hw, y: position.y, z: position.z - hd },
    { x: position.x + hw, y: position.y, z: position.z - hd },
    { x: position.x - hw, y: position.y, z: position.z + hd },
    { x: position.x + hw, y: position.y, z: position.z + hd },
  ]
  return corners.map((p, i) => ({ position: p, label: `${id}-corner-${i}` }))
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
