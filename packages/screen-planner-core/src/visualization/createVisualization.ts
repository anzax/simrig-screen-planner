import type { SimRigLayout } from '../layout/types'
import { createViewport } from './viewport'
import { projectScreen, projectViewPoint, projectRigBase } from './projections/topDown'
import type { SimRigVisualization } from './types'

export function createVisualization(
  layout: SimRigLayout.Layout,
  containerSize: { width: number; height: number },
  viewportOptions: Partial<SimRigVisualization.Viewport> = {}
): SimRigVisualization.VisualizationData {
  const viewport = createViewport(layout, containerSize, viewportOptions)

  const screens = layout.screens.map(screen => {
    const proj = projectScreen(screen)
    return {
      ...proj,
      centerPoint: viewport.worldToScreen(proj.centerPoint),
      corners: proj.corners.map(c => viewport.worldToScreen(c)),
    }
  })
  const viewProj = projectViewPoint(layout.viewPoint)
  const viewPoint = {
    ...viewProj,
    position: viewport.worldToScreen(viewProj.position),
  }
  const baseProj = projectRigBase(layout.rigBase)
  const rigBase = {
    ...baseProj,
    centerPoint: viewport.worldToScreen(baseProj.centerPoint),
    corners: baseProj.corners.map(c => viewport.worldToScreen(c)),
  }

  const minX = Math.min(layout.bounds.min.x, layout.bounds.max.x)
  const maxX = Math.max(layout.bounds.min.x, layout.bounds.max.x)
  const minY = Math.min(layout.bounds.min.z, layout.bounds.max.z)
  const maxY = Math.max(layout.bounds.min.z, layout.bounds.max.z)
  const topLeft = viewport.worldToScreen({ x: minX, y: minY })
  const bottomRight = viewport.worldToScreen({ x: maxX, y: maxY })

  const svgProps = {
    viewBox: `${topLeft.x} ${topLeft.y} ${bottomRight.x - topLeft.x} ${bottomRight.y - topLeft.y}`,
    width: containerSize.width,
    height: containerSize.height,
  }

  return {
    viewport,
    screens,
    rigBase,
    viewPoint,
    svgProps,
  }
}
