import type { SimRigLayout } from '../layout/types'
import { createViewport } from './viewport'
import { projectScreen, projectViewPoint } from './projections/topDown'
import type { SimRigVisualization } from './types'

export function createVisualization(
  layout: SimRigLayout.Layout,
  containerSize: { width: number; height: number },
  viewportOptions: Partial<SimRigVisualization.Viewport> = {}
): SimRigVisualization.VisualizationData {
  const viewport = createViewport(layout, containerSize, viewportOptions)

  const screens = layout.screens.map(screen => projectScreen(screen))
  const viewPoint = projectViewPoint(layout.viewPoint)

  const svgProps = {
    viewBox: `0 0 ${containerSize.width} ${containerSize.height}`,
    width: containerSize.width,
    height: containerSize.height,
  }

  return {
    viewport,
    screens,
    viewPoint,
    svgProps,
  }
}
