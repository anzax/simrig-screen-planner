import React, { useState } from 'react'
import RigAndHead from './visualizer/RigAndHead'
import Screens from './visualizer/Screens'
import FOVLines from './visualizer/FOVLines' // Import the new component

export default function ScreenVisualizer({ view, comparisonView }) {
  // Debug mode state - can be toggled for development/testing
  const [debug, setDebug] = useState(false)
  const [showFOV, setShowFOV] = useState(true) // State to toggle FOV lines

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

        {/* Render FOV lines if enabled */}
        {showFOV && <FOVLines head={view.head} screenEdges={view.screenEdges} />}

        {/* Render the primary setup screens */}
        <Screens view={view} color="#000" debug={debug} />

        {/* Render the comparison setup screens if provided */}
        {comparisonView && (
          <>
            {showFOV && (
              <FOVLines
                head={comparisonView.head}
                screenEdges={comparisonView.screenEdges}
                color="#3B82F6"
              />
            )}
            <Screens view={comparisonView} color="#3B82F6" debug={debug} />
          </>
        )}
      </svg>

      {/* Controls for debug and FOV lines */}
      <div className="flex justify-center gap-2 mt-2">
        {!import.meta.env.PROD && (
          <button
            className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded debug-toggle"
            style={{ width: '120px' }}
            onClick={() => setDebug(!debug)}
          >
            {debug ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
        )}
        <button
          className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded fov-toggle"
          style={{ width: '120px' }}
          onClick={() => setShowFOV(!showFOV)}
        >
          {showFOV ? 'Hide FOV Lines' : 'Show FOV Lines'}
        </button>
      </div>
    </div>
  )
}
