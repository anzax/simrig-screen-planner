import React, { useState } from 'react'
import RigAndHead from './visualizer/RigAndHead'
import Screens from './visualizer/Screens'

export default function ScreenVisualizer({ view, comparisonView }) {
  // Debug mode state - can be toggled for development/testing
  const [debug, setDebug] = useState(false)

  return (
    <div
      className="bg-white rounded p-2 overflow-auto flex flex-col justify-center"
      style={{
        maxHeight: '70vh',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'fit-content',
        maxWidth: '100vw',
      }}
    >
      <svg width={view.widthPx} height={view.heightPx}>
        {/* Render the rig and head */}
        <RigAndHead rig={view.rig} head={view.head} />

        {/* Render the primary setup screens */}
        <Screens view={view} color="#000" debug={debug} />

        {/* Render the comparison setup screens if provided */}
        {comparisonView && <Screens view={comparisonView} color="#3B82F6" debug={debug} />}
      </svg>

      {/* Debug toggle button - only shown in development mode */}
      {!import.meta.env.PROD && (
        <button
          className="mt-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded debug-toggle mx-auto"
          style={{ width: '120px' }}
          onClick={() => setDebug(!debug)}
        >
          {debug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
      )}
    </div>
  )
}
