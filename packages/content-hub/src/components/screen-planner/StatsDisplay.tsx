import type { ComponentType } from 'preact'
import Card from '../ui/Card'
import { createScreenConfigState } from '@simrigbuild/screen-planner-core'

type ConfigState = ReturnType<typeof createScreenConfigState>
type CalculatedResults = ConfigState['calculatedResults']

interface StatsDisplayProps {
  config: ConfigState
  results: CalculatedResults
}

const StatsDisplay: ComponentType<StatsDisplayProps> = ({ config, results }) => {
  const res = results.value
  const { screen, distance, layout, curvature } = config
  const { diagIn, ratio, screenWidth, screenHeight, inputMode } = screen
  const { distCm } = distance
  const { setupType } = layout
  const { isCurved, curveRadius } = curvature

  const sizeDisplay =
    inputMode.value === 'diagonal'
      ? `${diagIn.value}″ ${ratio.value}`
      : `${screenWidth.value}×${screenHeight.value}mm`
  return (
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow-sm border p-4">
        <div class="text-center mb-2">
          <span class="inline-block text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-4">
            Main Setup
          </span>
          <div class="text-xs flex justify-center items-center">
            <span>
              <span class="text-gray-600 text-sm">
                {setupType.value === 'triple' ? 'Triple' : 'Single'}
              </span>
            </span>
            <span class="mx-2 text-gray-300">|</span>
            <span>
              <span class="text-gray-600 text-sm">{sizeDisplay}</span>
            </span>
            <span class="mx-2 text-gray-300">|</span>
            <span>
              <span class="text-gray-600 text-sm">
                {isCurved.value ? `Curved (${curveRadius.value}R)` : 'Flat'}
              </span>
            </span>
            <span class="mx-2 text-gray-300">|</span>
            <span>
              <span class="text-gray-400">Distance:</span>{' '}
              <span class="text-gray-600 text-sm">{distCm.value}cm</span>
            </span>
          </div>
        </div>
        <div class="border-t border-gray-200 my-2" />
        <div class="text-center mt-2">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <Card v={`${res.hFOVdeg.toFixed(1)}°`} l="H-FOV" tooltip="Horizontal field-of-view" />
            <Card v={`${res.vFOVdeg.toFixed(1)}°`} l="V-FOV" tooltip="Vertical field-of-view" />
            <Card
              v={`${res.sideAngleDeg.toFixed(1)}°`}
              l="Side Angle"
              tooltip="Recommended monitor angle"
            />
            <Card
              v={`${res.totalWidth.toFixed(1)} cm`}
              l="Total Width"
              tooltip="Overall monitor span"
            />
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-blue-200 p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
        <div class="text-xl font-semibold text-blue-600 py-4">Add a Comparison</div>
        <div class="text-sm text-blue-500 mb-2 text-center">
          Compare with standard triple 32&quot; flat setup
        </div>
      </div>
    </section>
  )
}

export default StatsDisplay
