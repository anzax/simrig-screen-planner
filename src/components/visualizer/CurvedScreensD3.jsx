import React, { useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { VisualizerContext } from '../ScreenVisualizer'
import SingleScreenRenderer from './SingleScreenRenderer'

/**
 * Renders curved screens using D3
 * @param {Object} props - Component props
 * @param {Array} props.arcs - Array of arc data for the screens
 * @param {string} props.color - Color of the screens
 * @param {boolean} props.debug - Whether to show debug elements
 * @returns {JSX.Element} - SVG group element
 */
export default function CurvedScreensD3({ arcs = [], color = '#000', debug = false }) {
  const svgRef = useRef(null)
  const { viewport } = useContext(VisualizerContext)
  const pixelsPerInch = viewport?.pixelsPerInch || 10

  useEffect(() => {
    if (!arcs || arcs.length === 0 || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // Clear previous renders

    // Render each screen using the SingleScreenRenderer
    arcs.forEach((arc, i) => {
      SingleScreenRenderer({
        arc,
        index: i,
        color,
        debug,
        pixelsPerInch,
        d3Container: svg,
      })
    })
  }, [arcs, color, debug, pixelsPerInch])

  return <g ref={svgRef}></g>
}
