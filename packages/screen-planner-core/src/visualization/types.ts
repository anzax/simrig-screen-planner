/* eslint-disable @typescript-eslint/no-namespace */
import type { SimRigLayout } from '../layout/types'

export namespace SimRigVisualization {
  export interface Viewport {
    width: number
    height: number
    scale: number
    center: { x: number; y: number }
    screenToWorld(point: { x: number; y: number }): { x: number; y: number }
    worldToScreen(point: { x: number; y: number }): { x: number; y: number }
  }

  export interface TopDownProjection {
    projectPoint(point: SimRigLayout.Point3D): { x: number; y: number }
    projectScreen(screen: SimRigLayout.Screen): ScreenRenderData
    projectViewPoint(viewPoint: SimRigLayout.ViewPoint): ViewPointRenderData
  }

  export interface ScreenRenderData {
    id: string
    type: 'screen'
    centerPoint: { x: number; y: number }
    corners: Array<{ x: number; y: number }>
    rotation: number
    width: number
    height: number
    visible: boolean
  }

  export interface ViewPointRenderData {
    id: string
    position: { x: number; y: number }
    radius: number
    visible: boolean
  }

  export interface VisualizationData {
    viewport: Viewport
    screens: ScreenRenderData[]
    viewPoint: ViewPointRenderData
    svgProps: {
      viewBox: string
      width: string | number
      height: string | number
    }
  }
}
