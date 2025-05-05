import React from 'react'

export default function ScreenVisualizer({ view }) {
  return (
    <div className="bg-white rounded shadow p-2 overflow-auto" style={{ maxHeight: '70vh' }}>
      <svg width={view.widthPx} height={view.heightPx}>
        <rect
          x={view.rig.x}
          y={view.rig.y}
          width={view.rig.w}
          height={view.rig.h}
          fill="#CBD5E0"
          fillOpacity={0.4}
        />
        {view.lines.map((l, i) => (
          <line key={i} {...l} stroke="#000" strokeWidth={4} strokeLinecap="round" />
        ))}
        <circle {...view.head} fill="none" stroke="#EF4444" strokeWidth={3} />
      </svg>
    </div>
  )
}
