import type { ComponentType } from 'preact'
import { screenConfig } from '@simrigbuild/screen-planner-core'
import SettingsPanel from './SettingsPanel'
import StatsDisplay from './StatsDisplay'
import ScreenVisualizer from './ScreenVisualizer'

const ScreenPlannerApp: ComponentType = () => {
  return (
    <div class="space-y-6">
      <SettingsPanel config={screenConfig} />
      <StatsDisplay config={screenConfig} results={screenConfig.calculatedResults} />
      <ScreenVisualizer data={screenConfig.visualizationData} />
    </div>
  )
}

export default ScreenPlannerApp
