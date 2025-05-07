import React from 'react'
import FlatScreens from './FlatScreens'
import CurvedScreensD3 from './CurvedScreensD3' // New D3 component
import DebugHelpers from './DebugHelpers'

export default function Screens({ view, color = '#000', debug = false }) {
  const { lines, arcs } = view
  const isCurved = arcs && arcs.length > 0

  return (
    <>
      {isCurved ? (
        <CurvedScreensD3 arcs={arcs} color={color} debug={debug} />
      ) : (
        <FlatScreens lines={lines} color={color} />
      )}

      {/* Render debug helpers if debug mode is enabled */}
      <DebugHelpers view={view} debug={debug} />
    </>
  )
}
