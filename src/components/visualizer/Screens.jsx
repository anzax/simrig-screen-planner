import React, { useContext } from 'react'
import { VisualizerContext } from '../ScreenVisualizer'
import FlatScreens from './FlatScreens'
import CurvedScreensD3 from './CurvedScreensD3' // New D3 component
import DebugHelpers from './DebugHelpers'

export default function Screens({ isComparison = false }) {
  const { view, comparisonView, debug } = useContext(VisualizerContext)

  // Get the appropriate view based on isComparison flag
  const currentView = isComparison ? comparisonView : view

  // If no view is available, return null
  if (!currentView) return null

  // Determine color based on isComparison flag
  const color = isComparison ? '#1E40AF' : '#000'

  // Default to empty arrays if properties are missing
  const { lines = [], arcs = [] } = currentView
  const isCurved = arcs && arcs.length > 0

  return (
    <>
      {isCurved ? (
        <CurvedScreensD3 arcs={arcs} color={color} debug={debug} />
      ) : (
        <FlatScreens lines={lines} color={color} />
      )}

      {/* Render debug helpers if debug mode is enabled */}
      {debug && <DebugHelpers isComparison={isComparison} />}
    </>
  )
}
