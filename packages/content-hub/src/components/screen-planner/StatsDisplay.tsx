import type { ComponentType } from 'preact'
import Card from '../ui/Card'
import { createScreenPlannerState, createCalculationState } from '@simrigbuild/screen-planner-core'

type PlannerState = ReturnType<typeof createScreenPlannerState>

interface StatsDisplayProps {
  plannerStore: PlannerState
}

const StatsDisplay: ComponentType<StatsDisplayProps> = ({ plannerStore }) => {
  const {
    configs,
    activeConfigId,
    setActiveConfigId,
    addComparisonConfig,
    removeComparisonConfig,
    hasComparison,
  } = plannerStore
  const mainConfig = configs.main
  const compConfig = configs.comparison.value
  const mainCalcs = createCalculationState(mainConfig)
  const compCalcs = compConfig ? createCalculationState(compConfig) : null

  const renderCard = (
    config: PlannerState['configs']['main'],
    calcs: ReturnType<typeof createCalculationState>,
    type: 'main' | 'comparison'
  ) => {
    const { size, distance, arrangement, curvature } = config
    const { angles, fov, footprint } = calcs
    const { diagonal, aspectRatio, width, height, inputMode } = size
    const { eye } = distance
    const { type: setupType } = arrangement
    const { isCurved, radius } = curvature

    const sizeDisplay =
      inputMode.value === 'diagonal'
        ? `${diagonal.value}″ ${aspectRatio.value}`
        : `${width.value}×${height.value}mm`
    return (
      <div class="flex flex-col h-full">
        <div class="text-center mb-2">
          <span
            class={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-4 ${
              type === 'main' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
            }`}
          >
            {type === 'main' ? 'Main Setup' : 'Comparison'}
            {type === 'comparison' && (
              <button
                class="ml-2 text-gray-400 hover:text-red-500"
                onClick={e => {
                  e.stopPropagation()
                  removeComparisonConfig()
                }}
                aria-label="Remove comparison configuration"
              >
                ×
              </button>
            )}
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
                {isCurved.value ? `Curved (${radius.value}R)` : 'Flat'}
              </span>
            </span>
            <span class="mx-2 text-gray-300">|</span>
            <span>
              <span class="text-gray-400">Distance:</span>{' '}
              <span class="text-gray-600 text-sm">{(eye.value / 10).toFixed(1)}cm</span>
            </span>
          </div>
        </div>
        <div class="border-t border-gray-200 my-2" />
        <div class="text-center mt-2">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <Card
              v={`${fov.value.horizontal.toFixed(1)}°`}
              l="H-FOV"
              tooltip="Horizontal field-of-view"
            />
            <Card
              v={`${fov.value.vertical.toFixed(1)}°`}
              l="V-FOV"
              tooltip="Vertical field-of-view"
            />
            <Card
              v={`${angles.value.actualSideAngle.toFixed(1)}°`}
              l="Side Angle"
              tooltip="Recommended monitor angle"
            />
            <Card
              v={`${(footprint.value.totalWidth / 10).toFixed(1)} cm`}
              l="Total Width"
              tooltip="Overall monitor span"
            />
          </div>
        </div>
      </div>
    )
  }

  const renderAddCard = () => (
    <div class="flex flex-col items-center justify-center h-full">
      <div class="text-xl font-semibold text-blue-600 py-4">Add a Comparison</div>
      <div class="text-sm text-blue-500 mb-2 text-center">
        Compare with standard triple 32&quot; flat setup
      </div>
    </div>
  )

  return (
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        class={`bg-white rounded-lg shadow-sm border p-4 transition-all h-full ${
          activeConfigId.value === 'main'
            ? 'border-gray-600'
            : 'border-gray-200 hover:border-gray-600 cursor-pointer'
        }`}
        onClick={() => hasComparison.value && setActiveConfigId('main')}
      >
        {renderCard(mainConfig, mainCalcs, 'main')}
      </div>
      <div
        class={`rounded-lg shadow-sm border p-4 transition-all h-full ${
          hasComparison.value
            ? activeConfigId.value === 'comparison'
              ? 'bg-blue-50 border-blue-600'
              : 'bg-blue-50 border-gray-200 hover:border-blue-500 cursor-pointer'
            : 'bg-white border-blue-200 hover:border-blue-500 cursor-pointer'
        }`}
        onClick={() =>
          hasComparison.value ? setActiveConfigId('comparison') : addComparisonConfig()
        }
      >
        {hasComparison.value && compConfig && compCalcs
          ? renderCard(compConfig, compCalcs, 'comparison')
          : renderAddCard()}
      </div>
    </section>
  )
}

export default StatsDisplay
