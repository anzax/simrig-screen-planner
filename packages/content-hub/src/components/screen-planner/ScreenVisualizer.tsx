import type { ComponentType } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { createScreenConfigState } from '@simrigbuild/screen-planner-core'

type ConfigState = ReturnType<typeof createScreenConfigState>
type VisualizationData = ConfigState['visualizationData']

interface ScreenVisualizerProps {
  data: VisualizationData
}

const ScreenVisualizer: ComponentType<ScreenVisualizerProps> = ({ data }) => {
  const svgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // TODO: Implement visualization rendering using data.value and D3 or raw SVG
  }, [data.value])

  return (
    <section class="bg-white rounded-lg shadow-sm border p-4">
      <div ref={svgRef} class="w-full h-64">
        {/* SVG visualization will be rendered here */}
      </div>
    </section>
  )
}

export default ScreenVisualizer
