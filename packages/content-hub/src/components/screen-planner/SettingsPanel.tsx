import type { ComponentType } from 'preact'
import MultiToggle from '../ui/MultiToggle'
import NumberInputWithSlider from '../ui/NumberInputWithSlider'
import { createScreenConfigState } from '@simrigbuild/screen-planner-core'

type ConfigState = ReturnType<typeof createScreenConfigState>

interface SettingsPanelProps {
  config: ConfigState
}

const SettingsPanel: ComponentType<SettingsPanelProps> = ({ config }) => {
  const { screen, distance, layout, curvature } = config

  return (
    <section class="bg-white rounded-lg shadow-sm border p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Screen Size */}
        <div>
          <h2 class="text-sm font-medium text-gray-700 mb-2">Screen Size</h2>
          <MultiToggle
            value={screen.inputMode.value}
            options={[
              { value: 'diagonal', label: 'Diagonal' },
              { value: 'manual', label: 'Width×Height' },
            ]}
            onChange={v => (screen.inputMode.value = v as any)}
          />
          <div class="mt-3 space-y-3">
            <NumberInputWithSlider
              label="Diagonal, in"
              min={17}
              max={77}
              value={screen.diagIn.value}
              onChange={v => (screen.diagIn.value = v)}
              unit="in"
            />
            <MultiToggle
              label="Aspect Ratio"
              value={screen.ratio.value}
              options={[
                { value: '16:9', label: '16:9' },
                { value: '21:9', label: '21:9' },
                { value: '32:9', label: '32:9' },
              ]}
              onChange={v => (screen.ratio.value = v as any)}
            />
            <NumberInputWithSlider
              label="Bezel width, mm"
              min={0}
              max={50}
              value={screen.bezelMm.value}
              onChange={v => (screen.bezelMm.value = v)}
              unit="mm"
            />
          </div>
        </div>

        {/* Screen Layout */}
        <div>
          <h2 class="text-sm font-medium text-gray-700 mb-2">Screen Layout</h2>
          <MultiToggle
            value={layout.setupType.value}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'triple', label: 'Triple' },
            ]}
            onChange={v => (layout.setupType.value = v as any)}
          />
          <div class="mt-3 space-y-3">
            <MultiToggle
              label="Side Screen Angle"
              value={layout.angleMode.value}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'manual', label: 'Manual' },
              ]}
              onChange={v => (layout.angleMode.value = v as any)}
            />
            <NumberInputWithSlider
              label="Angle, degrees"
              min={30}
              max={90}
              value={layout.manualAngle.value}
              onChange={v => (layout.manualAngle.value = v)}
              unit="°"
            />
          </div>
        </div>

        {/* Viewing Distance & Curvature */}
        <div>
          <h2 class="text-sm font-medium text-gray-700 mb-2">Viewing Distance</h2>
          <NumberInputWithSlider
            label="Eye Distance, cm"
            min={40}
            max={150}
            value={distance.distCm.value}
            onChange={v => (distance.distCm.value = v)}
            unit="cm"
          />
          <div class="mt-4">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Screen Curvature</h3>
            <MultiToggle
              value={curvature.isCurved.value ? 'curved' : 'flat'}
              options={[
                { value: 'flat', label: 'Flat' },
                { value: 'curved', label: 'Curved' },
              ]}
              onChange={v => (curvature.isCurved.value = v === 'curved')}
            />
            <NumberInputWithSlider
              label="Curve Radius, mm"
              min={800}
              max={2300}
              step={100}
              value={curvature.curveRadius.value}
              onChange={v => (curvature.curveRadius.value = v)}
              unit="mm"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default SettingsPanel
