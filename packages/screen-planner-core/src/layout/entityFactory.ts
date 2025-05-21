import type { SimRigLayout } from './types'

let idCounter = 0

export function createId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${idCounter}`
}

export function createScreen(
  params: Omit<SimRigLayout.Screen, 'id' | 'layer' | 'visible' | 'type'> & {
    layer?: string
    visible?: boolean
  }
): SimRigLayout.Screen {
  const { layer = 'default', visible = true, ...rest } = params
  return {
    id: createId('screen'),
    type: 'screen',
    layer,
    visible,
    ...rest,
  }
}

export function createViewPoint(
  params: Omit<SimRigLayout.ViewPoint, 'id' | 'layer' | 'visible' | 'type'> & {
    layer?: string
    visible?: boolean
  }
): SimRigLayout.ViewPoint {
  const { layer = 'default', visible = true, ...rest } = params
  return {
    id: createId('viewpoint'),
    type: 'viewPoint',
    layer,
    visible,
    ...rest,
  }
}

export function createFovRay(
  params: Omit<SimRigLayout.FovRay, 'id' | 'layer' | 'visible' | 'type'> & {
    layer?: string
    visible?: boolean
  }
): SimRigLayout.FovRay {
  const { layer = 'default', visible = true, ...rest } = params
  return {
    id: createId('fovray'),
    type: 'fovRay',
    layer,
    visible,
    ...rest,
  }
}
