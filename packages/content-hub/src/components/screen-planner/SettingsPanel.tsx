import type { ComponentType } from 'preact'
import MultiToggle from '../ui/MultiToggle'
import NumberInputWithSlider from '../ui/NumberInputWithSlider'
import NumberInput from '../ui/NumberInput'
import { createScreenConfigState } from '@simrigbuild/screen-planner-core'

type ConfigState = ReturnType<typeof createScreenConfigState>

interface SettingsPanelProps {
  config: ConfigState
}

const SettingsPanel: ComponentType<SettingsPanelProps> = ({ config }) => {
  const { screen, distance, layout, curvature } = config
  const { diagIn, ratio, bezelMm, screenWidth, screenHeight, inputMode } = screen
  const { distCm } = distance
  const { setupType, angleMode, manualAngle } = layout
  const { isCurved, curveRadius } = curvature

  return (
    <section class="bg-white rounded-lg shadow-sm border p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Screen Size */}
        <div class="bg-gray-50 rounded-lg p-3">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Screen Size</h3>
          <MultiToggle
            value={inputMode.value}
            onChange={v => (inputMode.value = v as any)}
            options={[
              { value: 'diagonal', label: 'Diagonal' },
              { value: 'manual', label: 'Width × Height' },
            ]}
          />
          {inputMode.value === 'diagonal' ? (
            <div class="mt-3 space-y-3">
              <NumberInputWithSlider
                label="Diagonal, in"
                min={17}
                max={77}
                value={diagIn.value}
                onChange={v => (diagIn.value = v)}
                unit="in"
              />
              <MultiToggle
                label="Aspect Ratio"
                value={ratio.value}
                onChange={v => (ratio.value = v as any)}
                options={[
                  { value: '16:9', label: '16:9' },
                  { value: '21:9', label: '21:9' },
                  { value: '32:9', label: '32:9' },
                ]}
              />
              <NumberInputWithSlider
                label="Bezel width, mm"
                min={0}
                max={50}
                value={bezelMm.value}
                onChange={v => (bezelMm.value = v)}
                unit="mm"
              />
            </div>
          ) : (
            <div class="mt-3 space-y-3">
              <div class="bg-blue-50 border border-blue-200 rounded-lg py-1.5 px-2 text-xs text-blue-700">
                Physical footprint (incl. bezels)
                <br />
                <em>(Width × Height)</em>
              </div>
              <div class="flex space-x-2">
                <NumberInput
                  label="Width, mm"
                  value={screenWidth.value}
                  onChange={v => (screenWidth.value = v)}
                  className="flex-1"
                />
                <NumberInput
                  label="Height, mm"
                  value={screenHeight.value}
                  onChange={v => (screenHeight.value = v)}
                  className="flex-1"
                />
              </div>
              <NumberInputWithSlider
                label="Bezel width, mm"
                min={0}
                max={50}
                value={bezelMm.value}
                onChange={v => (bezelMm.value = v)}
                unit="mm"
              />
            </div>
          )}
        </div>

        {/* Screen Layout */}
        <div class="bg-gray-50 rounded-lg p-3">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Screen Layout</h3>
          <MultiToggle
            value={setupType.value}
            onChange={v => (setupType.value = v as any)}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'triple', label: 'Triple' },
            ]}
          />
          {setupType.value === 'triple' ? (
            <div class="mt-3 space-y-3">
              <MultiToggle
                label="Side Screen Angle"
                value={angleMode.value}
                onChange={v => (angleMode.value = v as any)}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'manual', label: 'Manual' },
                ]}
              />
              <NumberInputWithSlider
                label="Angle, degrees"
                min={30}
                max={90}
                value={manualAngle.value}
                onChange={v => (manualAngle.value = v)}
                unit="°"
              />
            </div>
          ) : (
            <div class="bg-blue-50 border border-blue-200 rounded-lg py-3 px-3 text-xs text-blue-700 h-24 flex items-center justify-center">
              <p class="text-center">
                Single screen setup selected.
                <br />
                No angle adjustments needed.
              </p>
            </div>
          )}
        </div>

        {/* Viewing Distance & Curvature */}
        <div class="bg-gray-50 rounded-lg p-3">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Viewing Distance</h3>
          <NumberInputWithSlider
            label="Eye Distance, cm"
            min={40}
            max={150}
            value={distCm.value}
            onChange={v => (distCm.value = v)}
            unit="cm"
          />
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Screen Curvature</h3>
            <MultiToggle
              value={isCurved.value ? 'curved' : 'flat'}
              onChange={v => (isCurved.value = v === 'curved')}
              options={[
                { value: 'flat', label: 'Flat' },
                { value: 'curved', label: 'Curved' },
              ]}
            />
            {isCurved.value && (
              <NumberInputWithSlider
                label="Curve Radius, mm (eg. 1800R)"
                min={800}
                max={2300}
                step={100}
                value={curveRadius.value}
                onChange={v => (curveRadius.value = v)}
                unit="mm"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsPanel
