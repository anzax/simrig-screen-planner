import { describe, it, expect } from 'vitest'
import ScreenPlannerApp from '../ScreenPlannerApp'
import { h as _h } from 'preact'
import renderToString from 'preact-render-to-string'

describe('ScreenPlannerApp', () => {
  it('renders without crashing', () => {
    const html = renderToString(<ScreenPlannerApp />)
    expect(html).toContain('Main Setup')
  })
})
