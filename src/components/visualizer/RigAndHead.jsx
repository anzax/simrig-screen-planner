import React, { useContext } from 'react'
import { VisualizerContext } from '../ScreenVisualizer'

export default function RigAndHead({ rig, head, color = "#000" }) {
  const { viewport } = useContext(VisualizerContext)
  const pixelsPerInch = viewport?.pixelsPerInch || 10
  const strokeWidth = 0.2 * pixelsPerInch // Convert inches to pixels

  // Convert dimensions from inches to pixels
  const rigWidth = (rig?.w || 40) * pixelsPerInch
  const rigHeight = (rig?.h || 40) * pixelsPerInch
  const headRadius = (head?.r || 8) * pixelsPerInch

  return (
    <>
      <rect
        x={-rigWidth / 2}
        y={-rigHeight / 2}
        width={rigWidth}
        height={rigHeight}
        fill={color}
        fillOpacity={0.2}
      />
      <circle 
        cx={0}
        cy={0}
        r={headRadius}
        fill="none"
        stroke={color === "#1E40AF" ? color : "#EF4444"}
        strokeWidth={strokeWidth}
      />
    </>
  )
}
