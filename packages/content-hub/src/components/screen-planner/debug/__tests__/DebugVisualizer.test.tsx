import { describe, it, expect } from 'vitest'
import DebugVisualizer from '../DebugVisualizer'
import { h as _h } from 'preact'
import renderToString from 'preact-render-to-string'
import type { SimRigLayout } from '@simrigbuild/screen-planner-core'

const layout: SimRigLayout.Layout = {
  screens: [],
  viewPoint: {
    id: 'vp',
    type: 'viewPoint',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    visible: true,
    layer: 'default',
    eyeHeight: 0,
    fov: { horizontal: 0, vertical: 0 },
  },
  fovRays: [],
  bounds: { min: { x: -1, y: -1, z: 0 }, max: { x: 1, y: 1, z: 0 } },
  debug: { enabled: true, points: [{ position: { x: 0, y: 0, z: 0 }, label: 'origin' }] },
}

describe('DebugVisualizer', () => {
  it('renders points when enabled', () => {
    const html = renderToString(<DebugVisualizer layout={layout} />)
    expect(html).toContain('svg')
  })
})
