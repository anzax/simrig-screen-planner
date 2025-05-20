import type { ComponentType } from 'preact'
import { screenConfig } from '@simrigbuild/screen-planner-core'
import SettingsPanel from './SettingsPanel'
import StatsDisplay from './StatsDisplay'
import ScreenVisualizer from './ScreenVisualizer'

const ScreenPlannerApp: ComponentType = () => {
  return (
    <>
      <SettingsPanel config={screenConfig} />
      <StatsDisplay config={screenConfig} results={screenConfig.calculatedResults} />
      <ScreenVisualizer data={screenConfig.visualizationData} />
    </>
  )
}

export default ScreenPlannerApp
