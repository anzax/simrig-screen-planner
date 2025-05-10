import React, { useContext } from 'react'
import { VisualizerContext } from '../ScreenVisualizer'

export default function FOVLines({ screenEdges, color = '#555555' }) {
  // Return early if no data
  if (!screenEdges || screenEdges.length === 0) return null

  const { viewport } = useContext(VisualizerContext)
  const pixelsPerInch = viewport?.pixelsPerInch || 10

  // Convert stroke width and dash array from inches to pixels
  const strokeWidth = 0.15 * pixelsPerInch // 0.15 inches
  const dashArray = `${0.5 * pixelsPerInch},${0.5 * pixelsPerInch}` // 0.5 inches

  return (
    <>
      {screenEdges.map((edge, index) => {
        // Convert edge coordinates from inches to pixels
        const x2 = (edge?.x || 0) * pixelsPerInch
        const y2 = (edge?.y || 0) * pixelsPerInch

        return (
          <line
            key={`fov-line-${index}`}
            x1={0}
            y1={0}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeOpacity={0.7}
          />
        )
      })}
    </>
  )
}
