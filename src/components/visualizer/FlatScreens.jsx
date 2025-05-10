import React, { useContext } from 'react'
import { VisualizerContext } from '../ScreenVisualizer'

export default function FlatScreens({ lines = [], color = '#000' }) {
  const { viewport } = useContext(VisualizerContext)
  const pixelsPerInch = viewport?.pixelsPerInch || 10
  const strokeWidth = 0.2 * pixelsPerInch // 0.2 inches converted to pixels

  return (
    <>
      {lines &&
        lines.map((l, i) => {
          // Convert coordinates from inches to pixels
          const x1 = (l?.x1 || 0) * pixelsPerInch
          const y1 = (l?.y1 || 0) * pixelsPerInch
          const x2 = (l?.x2 || 0) * pixelsPerInch
          const y2 = (l?.y2 || 0) * pixelsPerInch

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          )
        })}
    </>
  )
}
