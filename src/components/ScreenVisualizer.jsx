import React, { useState } from 'react'
import RigAndHead from './visualizer/RigAndHead'
import Screens from './visualizer/Screens'

export default function ScreenVisualizer({ view, comparisonView }) {
  // Debug mode state - can be toggled for development/testing
  const [debug, setDebug] = useState(false)

  return (
    <div
      className="bg-white rounded shadow p-2 overflow-auto flex flex-col justify-center items-center"
      style={{ maxHeight: '70vh' }}
    >
      <svg width={view.widthPx} height={view.heightPx}>
        {/* Render the rig and head */}
        <RigAndHead rig={view.rig} head={view.head} />

        {/* Render the primary setup screens */}
        <Screens view={view} color="#000" debug={debug} />

        {/* Render the comparison setup screens if provided */}
        {comparisonView && <Screens view={comparisonView} color="#3B82F6" debug={debug} />}
      </svg>

      {/* Debug toggle button - always available but can be hidden with CSS in production */}
      <button
        className="mt-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded debug-toggle"
        onClick={() => setDebug(!debug)}
      >
        {debug ? 'Hide Debug Info' : 'Show Debug Info'}
      </button>
    </div>
  )
}
