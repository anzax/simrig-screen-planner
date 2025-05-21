import type { SimRigLayout } from '../layout/types'
import type { SimRigVisualization } from './types'

const DEFAULT_MARGIN = 0.1

export function createViewport(
  layout: SimRigLayout.Layout,
  container: { width: number; height: number },
  options: Partial<SimRigVisualization.Viewport> = {}
): SimRigVisualization.Viewport {
  const minX = Math.min(layout.bounds.min.x, layout.bounds.max.x)
  const maxX = Math.max(layout.bounds.min.x, layout.bounds.max.x)
  const minY = Math.min(layout.bounds.min.z, layout.bounds.max.z)
  const maxY = Math.max(layout.bounds.min.z, layout.bounds.max.z)

  const width = maxX - minX
  const height = maxY - minY

  const widthWithMargin = width * (1 + DEFAULT_MARGIN)
  const heightWithMargin = height * (1 + DEFAULT_MARGIN)

  const scale =
    options.scale ??
    Math.min(container.width / widthWithMargin, container.height / heightWithMargin)

  const center = options.center ?? {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
  }

  function screenToWorld(point: { x: number; y: number }): { x: number; y: number } {
    return {
      x: point.x / scale + center.x,
      y: point.y / scale + center.y,
    }
  }

  function worldToScreen(point: { x: number; y: number }): { x: number; y: number } {
    return {
      x: (point.x - center.x) * scale,
      y: (point.y - center.y) * scale,
    }
  }

  return {
    width: container.width,
    height: container.height,
    scale,
    center,
    screenToWorld,
    worldToScreen,
  }
}
