import React from 'react'

export default function FOVLines({ head, screenEdges, color = '#555555' }) {
  if (!head || !screenEdges || screenEdges.length === 0) return null

  return (
    <>
      {screenEdges.map((edge, index) => (
        <line
          key={`fov-line-${index}`}
          x1={head.cx}
          y1={head.cy}
          x2={edge.x}
          y2={edge.y}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="5,5"
          strokeOpacity={0.7}
        />
      ))}
    </>
  )
}
