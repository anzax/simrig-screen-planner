import React, { useContext } from 'react'
import { VisualizerContext } from '../ScreenVisualizer'

export default function ReferenceGrid() {
  const { viewport, debug } = useContext(VisualizerContext)

  if (!debug) return null
  const pixelsPerInch = viewport?.pixelsPerInch || 10
  const strokeWidth = 0.1 * pixelsPerInch // 0.1 inches

  // Convert coordinates from inches to pixels
  const gridSize = 1 * pixelsPerInch // 1 inch grid

  return (
    <>
      {/* Center crosshair */}
      <line x1={-gridSize} y1={0} x2={gridSize} y2={0} stroke="#999" strokeWidth={strokeWidth} />
      <line
        x1={0}
        y1={-gridSize}
        x2={0}
        y2={10 * pixelsPerInch}
        stroke="#999"
        strokeWidth={strokeWidth}
      />

      {/* Reference measurements */}
      <text x={5 * pixelsPerInch} y={1 * pixelsPerInch} fontSize={1.2 * pixelsPerInch} fill="#666">
        Pixels per inch: {pixelsPerInch}
      </text>
    </>
  )
}
