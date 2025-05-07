import React from 'react'

export default function RigAndHead({ rig, head }) {
  return (
    <>
      <rect x={rig.x} y={rig.y} width={rig.w} height={rig.h} fill="#CBD5E0" fillOpacity={0.4} />
      <circle {...head} fill="none" stroke="#EF4444" strokeWidth={3} />
    </>
  )
}
