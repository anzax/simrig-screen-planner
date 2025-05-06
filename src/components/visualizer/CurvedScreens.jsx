import React from 'react'

export default function CurvedScreens({ arcs, color = '#000' }) {
  if (!arcs || arcs.length === 0) return null

  return (
    <>
      {arcs.map((arc, i) => (
        <path
          key={`arc-${i}`}
          d={arc.path}
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      ))}
    </>
  )
}
