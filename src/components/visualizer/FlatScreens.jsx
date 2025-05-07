import React from 'react'

export default function FlatScreens({ lines, color = '#000' }) {
  return (
    <>
      {lines.map((l, i) => (
        <line key={i} {...l} stroke={color} strokeWidth={4} strokeLinecap="round" />
      ))}
    </>
  )
}
