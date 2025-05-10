import React from 'react'

export default function RigAndHead({ rig, head }) {
  // Extract only valid SVG circle properties
  const { x, y, r } = head || {}

  return (
    <>
      <rect
        x={rig?.x || 0}
        y={rig?.y || 0}
        width={rig?.w || 40}
        height={rig?.h || 40}
        fill="#CBD5E0"
        fillOpacity={0.4}
      />
      <circle cx={x || 0} cy={y || 0} r={r || 15} fill="none" stroke="#EF4444" strokeWidth={3} />
    </>
  )
}
