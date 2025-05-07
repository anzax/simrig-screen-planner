import React from 'react'

export default function DebugHelpers({ view, debug = false }) {
  if (!debug) return null

  const { arcs } = view
  const isCurved = arcs && arcs.length > 0

  if (!isCurved) return null

  return (
    <>
      {/* Show chord lines for center screen */}
      {arcs.map((arc, i) => {
        // Calculate start and end points of the arc
        const startX = arc.path.split(' ')[1]
        const startY = arc.path.split(' ')[2]
        const endX = arc.path.split(' ')[arc.path.split(' ').length - 2]
        const endY = arc.path.split(' ')[arc.path.split(' ').length - 1]

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
            <circle cx={arc.path.split(' ')[6]} cy={arc.path.split(' ')[7]} r={4} fill="red" />
          </React.Fragment>
        )
      })}
    </>
  )
}
