import type { ComponentType } from 'preact'
import Card from '../ui/Card'
import { createScreenConfigState } from '@simrigbuild/screen-planner-core'

type ConfigState = ReturnType<typeof createScreenConfigState>
type CalculatedResults = ConfigState['calculatedResults']

interface StatsDisplayProps {
  results: CalculatedResults
}

const StatsDisplay: ComponentType<StatsDisplayProps> = ({ results }) => {
  const res = results.value
  return (
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-600 p-4">
        <div class="text-center mb-2">
          <span class="inline-block text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
            Main Setup
          </span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <Card v={`${res.hFOVdeg.toFixed(0)}°`} l="H-FOV" tooltip="Horizontal field-of-view" />
          <Card v={`${res.vFOVdeg.toFixed(0)}°`} l="V-FOV" tooltip="Vertical field-of-view" />
          <Card
            v={`${res.sideAngleDeg.toFixed(0)}°`}
            l="Side Angle"
            tooltip="Recommended monitor angle"
          />
          <Card
            v={`${res.totalWidth.toFixed(0)} cm`}
            l="Total Width"
            tooltip="Overall monitor span"
          />
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-blue-200 p-4 flex items-center justify-center text-blue-600 font-medium cursor-pointer hover:border-blue-500 transition-colors">
        + Add Comparison
      </div>
    </section>
  )
}

export default StatsDisplay
