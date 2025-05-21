import { describe, it, expect } from 'vitest'
import { screenPlanner } from '@simrigbuild/screen-planner-core'
import StatsDisplay from '../StatsDisplay'
import { h } from 'preact'
import renderToString from 'preact-render-to-string'

describe('StatsDisplay', () => {
  it('renders without crashing', () => {
    screenPlanner.removeComparisonConfig()
    const html = renderToString(<StatsDisplay plannerStore={screenPlanner} />)
    expect(html).toContain('Main Setup')
  })

  it('shows comparison after adding', () => {
    screenPlanner.addComparisonConfig()
    const html = renderToString(<StatsDisplay plannerStore={screenPlanner} />)
    expect(html).toContain('Comparison')
    screenPlanner.removeComparisonConfig()
  })
})
