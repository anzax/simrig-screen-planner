import type { SimRigLayout } from '../../layout/types'
import type { SimRigVisualization } from '../types'

export function projectPoint(point: SimRigLayout.Point3D): { x: number; y: number } {
  return { x: point.x, y: -point.z }
}

export function projectScreen(screen: SimRigLayout.Screen): SimRigVisualization.ScreenRenderData {
  const centerPoint = projectPoint(screen.position)
  const hw = screen.width / 2
  const hh = screen.height / 2
  const angleRad = (Math.PI / 180) * screen.rotation.y

  function corner(dx: number, dy: number) {
    const x = screen.position.x + dx * Math.cos(angleRad)
    const z = screen.position.z + dx * Math.sin(angleRad)
    return projectPoint({ x, y: screen.position.y + dy, z })
  }

  const corners = [corner(-hw, hh), corner(hw, hh), corner(-hw, -hh), corner(hw, -hh)]

  return {
    id: screen.id,
    type: 'screen',
    centerPoint,
    corners,
    rotation: screen.rotation.y,
    width: screen.width,
    height: screen.height,
    visible: screen.visible,
  }
}

export function projectViewPoint(
  viewPoint: SimRigLayout.ViewPoint
): SimRigVisualization.ViewPointRenderData {
  return {
    id: viewPoint.id,
    position: projectPoint(viewPoint.position),
    radius: 8,
    visible: viewPoint.visible,
  }
}

export function projectRigBase(base: SimRigLayout.RigBase): SimRigVisualization.RigBaseRenderData {
  const centerPoint = projectPoint(base.position)
  const hw = base.width / 2
  const hd = base.depth / 2

  function corner(dx: number, dz: number) {
    return projectPoint({ x: base.position.x + dx, y: base.position.y, z: base.position.z + dz })
  }

  const corners = [corner(-hw, -hd), corner(hw, -hd), corner(-hw, hd), corner(hw, hd)]

  return {
    id: base.id,
    type: 'rigBase',
    centerPoint,
    corners,
    width: base.width,
    depth: base.depth,
    visible: base.visible,
  }
}
