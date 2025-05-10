import React from 'react'

export default function DebugHelpers({ view, debug = false }) {
  // If debug is off, or view is undefined, return null
  if (!debug || !view) return null

  const { arcs = [] } = view
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

        return (
          <React.Fragment key={`debug-${i}`}>
            {/* Chord line */}
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="blue"
              strokeWidth={1}
              strokeDasharray="5,5"
            />

            {/* Arc center */}
            <circle cx={centerX} cy={centerY} r={4} fill="red" />
          </React.Fragment>
        )
      })}
    </>
  )
}
