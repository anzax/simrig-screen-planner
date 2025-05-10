import React, { useContext } from 'react'
import { VisualizerContext } from '../ScreenVisualizer'

export default function FOVLines({ isComparison = false }) {
  const { viewport, view, comparisonView, showFOV } = useContext(VisualizerContext)

  // If FOV lines are disabled, return null
  if (!showFOV) return null

  // Get the appropriate view based on isComparison flag
  const currentView = isComparison ? comparisonView : view

  // Get screenEdges from the current view
  const screenEdges = currentView?.screenEdges || []

  // Return early if no data
  if (screenEdges.length === 0) return null

  // Determine color based on isComparison flag
  const color = isComparison ? '#1E40AF' : '#555555'

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
