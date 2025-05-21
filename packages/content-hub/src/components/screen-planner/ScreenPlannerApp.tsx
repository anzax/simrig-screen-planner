import type { ComponentType } from 'preact'
import { screenPlanner, createLayoutState } from '@simrigbuild/screen-planner-core'
import SettingsPanel from './SettingsPanel'
import StatsDisplay from './StatsDisplay'
import ScreenVisualizer from './ScreenVisualizer'
import DebugVisualizer from './debug/DebugVisualizer'
import DebugToggle from './debug/DebugToggle'

const ScreenPlannerApp: ComponentType = () => {
  const layoutState = createLayoutState(screenPlanner.activeConfig.value)

  return (
    <div class="space-y-6">
      <SettingsPanel config={screenPlanner.activeConfig.value} plannerStore={screenPlanner} />
      <StatsDisplay plannerStore={screenPlanner} />
      <div class="relative">
        <ScreenVisualizer config={screenPlanner.activeConfig.value} />
        <DebugVisualizer layout={layoutState.layout.value} />
      </div>
      <DebugToggle enabled={layoutState.debugEnabled.value} onToggle={layoutState.toggleDebug} />
    </div>
  )
}

export default ScreenPlannerApp
