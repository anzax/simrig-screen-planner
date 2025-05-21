import type { ComponentType } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import {
  createCalculationState,
  createLayout,
  createVisualization,
  createScreenConfigState,
} from '@simrigbuild/screen-planner-core'

type ConfigState = ReturnType<typeof createScreenConfigState>

interface ScreenVisualizerProps {
  config: ConfigState
}

const ScreenVisualizer: ComponentType<ScreenVisualizerProps> = ({ config }) => {
  const calculations = createCalculationState(config)
  const containerRef = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState<ReturnType<typeof createVisualization> | null>(null)

  const renderSvg = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const layout = createLayout(config, calculations.results.value)
    const v = createVisualization(layout, {
      width: rect.width,
      height: rect.height,
    })
    setVis(v)
  }

  useEffect(() => {
    const observer = new ResizeObserver(renderSvg)
    if (containerRef.current) observer.observe(containerRef.current)
    renderSvg()
    return () => observer.disconnect()
  }, [calculations.results.value])

  return (
    <section class="bg-white rounded-lg p-4">
      <div ref={containerRef} class="w-full h-96">
        {vis && (
          <svg width="100%" height="100%" viewBox={vis.svgProps.viewBox}>
            <polygon
              points={vis.rigBase.corners.map(p => `${p.x},${p.y}`).join(' ')}
              fill="#eee"
              stroke="black"
              stroke-width="1"
            />
            {vis.screens.map(s => (
              <polygon
                key={s.id}
                points={s.corners.map(c => `${c.x},${c.y}`).join(' ')}
                stroke="blue"
                fill="none"
                stroke-width="2"
              />
            ))}
            <circle
              cx={vis.viewPoint.position.x}
              cy={vis.viewPoint.position.y}
              r={vis.viewPoint.radius}
              fill="red"
            />
          </svg>
        )}
      </div>
    </section>
  )
}

export default ScreenVisualizer
