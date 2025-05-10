import React from 'react'

export default function FOVLines({ head, screenEdges, color = '#555555' }) {
  // Return early if no data
  if (!head || !screenEdges || screenEdges.length === 0) return null

  // Use head.x and head.y instead of cx and cy to match our default view structure
  const headX = head.x || head.cx || 0
  const headY = head.y || head.cy || 0

  return (
    <>
      {screenEdges.map((edge, index) => (
        <line
          key={`fov-line-${index}`}
          x1={headX}
          y1={headY}
          x2={edge?.x || 0}
          y2={edge?.y || 0}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="5,5"
          strokeOpacity={0.7}
        />
      ))}
    </>
  )
}
