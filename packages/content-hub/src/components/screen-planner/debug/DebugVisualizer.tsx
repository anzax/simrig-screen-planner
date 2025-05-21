import type { ComponentType } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import type { SimRigLayout, SimRigVisualization } from '@simrigbuild/screen-planner-core'
import { isDevelopment, createVisualization, projectPoint } from '@simrigbuild/screen-planner-core'

interface DebugVisualizerProps {
  layout: SimRigLayout.Layout
}

const DebugVisualizer: ComponentType<DebugVisualizerProps> = ({ layout }) => {
  if (!isDevelopment || !layout.debug.enabled) return null

  const containerRef = useRef<HTMLDivElement>(null)
  const [vis, setVis] = useState<{
    svg: SimRigVisualization.VisualizationData['svgProps']
    points: { label: string; x: number; y: number; color?: string }[]
  } | null>(null)

  const render = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const v = createVisualization(layout, { width: rect.width, height: rect.height })
    const points = layout.debug.points.map(p => {
      const w = projectPoint(p.position)
      const s = v.viewport.worldToScreen(w)
      return { label: p.label, x: s.x, y: s.y, color: p.color }
    })
    setVis({ svg: v.svgProps, points })
  }

  useEffect(() => {
    render()
    const observer = new ResizeObserver(render)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [layout])

  return (
    <div ref={containerRef} class="absolute inset-0 pointer-events-none">
      {vis && (
        <svg class="w-full h-full" viewBox={vis.svg.viewBox}>
          {vis.points.map(p => (
            <g key={p.label} transform={`translate(${p.x}, ${p.y})`}>
              <circle r="5" fill={p.color || 'red'} />
              <text x="6" y="-6" font-size="10" fill="black">
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}

export default DebugVisualizer
