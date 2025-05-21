import { describe, it, expect } from 'vitest'
import { h as _h } from 'preact'
import renderToString from 'preact-render-to-string'
import SettingsPanel from '../SettingsPanel'
import { screenPlanner } from '@simrigbuild/screen-planner-core'

describe('SettingsPanel', () => {
  it('renders recommended angle notice', () => {
    const cfg = screenPlanner.activeConfig.value
    cfg.arrangement.angleMode.value = 'manual'
    const html = renderToString(<SettingsPanel config={cfg} plannerStore={screenPlanner} />)
    expect(html).toContain('Recommended')
  })
})
