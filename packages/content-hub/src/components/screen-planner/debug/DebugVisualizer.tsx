import type { ComponentType } from 'preact'
import type { SimRigLayout } from '@simrigbuild/screen-planner-core'
import { isDevelopment } from '@simrigbuild/screen-planner-core'

interface DebugVisualizerProps {
  layout: SimRigLayout.Layout
}

const DebugVisualizer: ComponentType<DebugVisualizerProps> = ({ layout }) => {
  if (!isDevelopment || !layout.debug.enabled) return null

  const viewBox = `${layout.bounds.min.x} ${layout.bounds.min.y} ${layout.bounds.max.x - layout.bounds.min.x} ${layout.bounds.max.y - layout.bounds.min.y}`

  return (
    <div class="absolute inset-0 pointer-events-none">
      <svg class="w-full h-full" viewBox={viewBox}>
        {layout.debug.points.map(p => (
          <g key={p.label} transform={`translate(${p.position.x}, ${p.position.y})`}>
            <circle r="5" fill={p.color || 'red'} />
            <text x="6" y="-6" font-size="10" fill="black">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default DebugVisualizer
