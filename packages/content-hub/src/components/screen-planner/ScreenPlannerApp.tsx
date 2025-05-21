import type { ComponentType } from 'preact'
import { screenPlanner } from '@simrigbuild/screen-planner-core'
import SettingsPanel from './SettingsPanel'
import StatsDisplay from './StatsDisplay'
import ScreenVisualizer from './ScreenVisualizer'

const ScreenPlannerApp: ComponentType = () => {
  return (
    <div class="space-y-6">
      <SettingsPanel config={screenPlanner.activeConfig.value} plannerStore={screenPlanner} />
      <StatsDisplay plannerStore={screenPlanner} />
      <ScreenVisualizer config={screenPlanner.activeConfig.value} />
    </div>
  )
}

export default ScreenPlannerApp
