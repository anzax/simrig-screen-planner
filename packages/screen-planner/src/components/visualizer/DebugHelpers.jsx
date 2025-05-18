import React, { useContext } from 'react'
import { VisualizerContext } from '../ScreenVisualizer'

export default function DebugHelpers({ isComparison = false }) {
  const { viewport, view, comparisonView, debug } = useContext(VisualizerContext)

  // Get the appropriate view based on isComparison flag
  const currentView = isComparison ? comparisonView : view

  // If debug is off, or view is undefined, return null
  if (!debug || !currentView) return null
  const pixelsPerInch = viewport?.pixelsPerInch || 10

  const { arcs = [] } = currentView
  // If not curved or no arcs, return null
  if (!arcs || arcs.length === 0) return null

  return (
    <>
      {/* Show chord lines for center screen */}
      {arcs.map((arc, i) => {
        // Safety checks for arc and path
        if (!arc || !arc.path) return null

        const pathParts = arc.path?.split(' ') || []
        if (pathParts.length < 8) return null

        // Safely parse coordinates with fallbacks
        const startX = parseFloat(pathParts[1]) || 0
        const startY = parseFloat(pathParts[2]) || 0
        const endX = parseFloat(pathParts[pathParts.length - 2]) || 0
        const endY = parseFloat(pathParts[pathParts.length - 1]) || 0
        const centerX = parseFloat(pathParts[6]) || 0
        const centerY = parseFloat(pathParts[7]) || 0

        // Convert these coordinates to pixels (assuming they're in inches)
        const startXPx = startX * pixelsPerInch
        const startYPx = startY * pixelsPerInch
        const endXPx = endX * pixelsPerInch
        const endYPx = endY * pixelsPerInch
        const centerXPx = centerX * pixelsPerInch
        const centerYPx = centerY * pixelsPerInch

        return (
          <React.Fragment key={`debug-${i}`}>
            {/* Chord line */}
            <line
              x1={startXPx}
              y1={startYPx}
              x2={endXPx}
              y2={endYPx}
              stroke="blue"
              strokeWidth={0.1 * pixelsPerInch} // 0.1 inches
              strokeDasharray={`${0.5 * pixelsPerInch},${0.5 * pixelsPerInch}`} // 0.5 inches
            />
            {/* Arc center */}
            <circle cx={centerXPx} cy={centerYPx} r={0.4 * pixelsPerInch} fill="red" />{' '}
            {/* 0.4 inches */}
          </React.Fragment>
        )
      })}
    </>
  )
}
