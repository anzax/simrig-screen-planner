import { describe, it, expect } from 'vitest'
import { createScreenConfigState } from '@simrigbuild/screen-planner-core'
import StatsDisplay from '../StatsDisplay'
import { h } from 'preact'
import renderToString from 'preact-render-to-string'

describe('StatsDisplay', () => {
  it('renders without crashing', () => {
    const config = createScreenConfigState()
    const html = renderToString(<StatsDisplay config={config} results={config.calculatedResults} />)
    expect(html).toContain('Main Setup')
  })
})
