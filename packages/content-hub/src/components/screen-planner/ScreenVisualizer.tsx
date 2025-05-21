import type { ComponentType } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { createScreenConfigState, createCalculationState } from '@simrigbuild/screen-planner-core'

type ConfigState = ReturnType<typeof createScreenConfigState>

interface ScreenVisualizerProps {
  config: ConfigState
}

const ScreenVisualizer: ComponentType<ScreenVisualizerProps> = ({ config }) => {
  const calculations = createCalculationState(config)
  const svgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svgContent = `
      <svg width="100%" height="100%" viewBox="-200 -150 400 300">
        <circle cx="0" cy="0" r="5" fill="red" />
        <text x="0" y="-20" text-anchor="middle">Eye Position</text>
      </svg>
    `

    svgRef.current.innerHTML = svgContent
  }, [calculations.results.value])

  return (
    <section class="bg-white rounded-lg shadow-sm border p-4">
      <div ref={svgRef} class="w-full h-64">
        {/* SVG visualization will be rendered here */}
      </div>
    </section>
  )
}

export default ScreenVisualizer
