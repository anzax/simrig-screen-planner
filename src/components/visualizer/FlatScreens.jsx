import React from 'react'

export default function FlatScreens({ lines = [], color = '#000' }) {
  return (
    <>
      {lines &&
        lines.map((l, i) => (
          <line
            key={i}
            x1={l?.x1 || 0}
            y1={l?.y1 || 0}
            x2={l?.x2 || 0}
            y2={l?.y2 || 0}
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ))}
    </>
  )
}
