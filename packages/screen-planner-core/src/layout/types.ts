/* eslint-disable @typescript-eslint/no-namespace */
export namespace SimRigLayout {
  export interface Point3D {
    x: number
    y: number
    z: number
  }

  export interface Entity {
    id: string
    type: string
    position: Point3D
    rotation: { x: number; y: number; z: number }
    visible: boolean
    layer: string
  }

  export interface Screen extends Entity {
    type: 'screen'
    width: number
    height: number
    bezelWidth: number
    isCurved: boolean
    curveRadius?: number
  }

  export interface ViewPoint extends Entity {
    type: 'viewPoint'
    eyeHeight: number
    fov: { horizontal: number; vertical: number }
  }

  export interface FovRay extends Entity {
    type: 'fovRay'
    origin: Point3D
    direction: { x: number; y: number; z: number }
    length: number
    angle: number
  }

  export interface RigBase extends Entity {
    type: 'rigBase'
    width: number
    depth: number
  }

  export interface Layout {
    screens: Screen[]
    viewPoint: ViewPoint
    rigBase: RigBase
    fovRays: FovRay[]
    bounds: { min: Point3D; max: Point3D }
    debug: {
      enabled: boolean
      points: Array<{ position: Point3D; label: string; color?: string }>
    }
  }
}
