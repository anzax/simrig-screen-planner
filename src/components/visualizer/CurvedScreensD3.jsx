import React, { useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { VisualizerContext } from '../ScreenVisualizer'

export default function CurvedScreensD3({ arcs = [], color = '#000', debug = false }) {
  const svgRef = useRef(null)
  const { viewport } = useContext(VisualizerContext)
  const pixelsPerInch = viewport?.pixelsPerInch || 10

  useEffect(() => {
    if (!arcs || arcs.length === 0 || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // Clear previous renders

    arcs.forEach((arc, i) => {
      // Create container group for this screen
      const screenGroup = svg.append('g').attr('class', `screen-${i}`)

      // Convert arc coordinates from inches to pixels
      const pixelArc = {
        ...arc,
        startX: (arc.startX || 0) * pixelsPerInch,
        startY: (arc.startY || 0) * pixelsPerInch,
        endX: (arc.endX || 0) * pixelsPerInch,
        endY: (arc.endY || 0) * pixelsPerInch,
        controlX: (arc.controlX || 0) * pixelsPerInch,
        controlY: (arc.controlY || 0) * pixelsPerInch,
        centerX: (arc.centerX || 0) * pixelsPerInch,
        centerY: (arc.centerY || 0) * pixelsPerInch,
        radius: (arc.radius || 0) * pixelsPerInch,
        actualDeepestY: arc.actualDeepestY ? arc.actualDeepestY * pixelsPerInch : undefined,
      }

      // Define points for d3 curve
      let pathData
      let screenPoints

      if (pixelArc.type === 'bezier') {
        // Create points for a natural curve with d3
        screenPoints = [
          [pixelArc.startX, pixelArc.startY],
          [(pixelArc.startX + pixelArc.controlX) / 2, (pixelArc.startY + pixelArc.controlY) / 2],
          [pixelArc.controlX, pixelArc.controlY],
          [(pixelArc.endX + pixelArc.controlX) / 2, (pixelArc.endY + pixelArc.controlY) / 2],
          [pixelArc.endX, pixelArc.endY],
        ]

        // Create a line generator with natural curve
        const lineGenerator = d3.line().curve(d3.curveBasis) // Natural curve that passes through control points

        pathData = lineGenerator(screenPoints)
      } else {
        // For standard arcs, use d3's arc generator
        const arcGenerator = d3
          .arc()
          .innerRadius(0)
          .outerRadius(pixelArc.radius)
          .startAngle(pixelArc.startAngle)
          .endAngle(pixelArc.endAngle)

        pathData = arcGenerator()

        // Transform to arc center
        screenGroup.attr('transform', `translate(${pixelArc.centerX}, ${pixelArc.centerY})`)
      }

      // Draw monitor body - darker background
      screenGroup
        .append('path')
        .attr('d', pathData)
        .attr('stroke', 'none')
        .attr('fill', 'rgba(60, 60, 70, 0.2)')

      // Draw screen front face
      screenGroup
        .append('path')
        .attr('d', pathData)
        .attr('stroke', color)
        .attr('stroke-width', 0.2 * pixelsPerInch) // 0.2 inches
        .attr('stroke-linecap', 'butt')
        .attr('fill', 'rgba(230, 240, 250, 0.2)')

      // Add debug elements if needed
      if (debug) {
        if (pixelArc.type === 'bezier') {
          // Draw control points and connecting lines
          screenGroup
            .append('circle')
            .attr('cx', pixelArc.controlX)
            .attr('cy', pixelArc.controlY)
            .attr('r', 0.3 * pixelsPerInch) // 0.3 inches
            .attr('fill', 'red')

          // Control point connectors
          screenGroup
            .append('line')
            .attr('x1', pixelArc.startX)
            .attr('y1', pixelArc.startY)
            .attr('x2', pixelArc.controlX)
            .attr('y2', pixelArc.controlY)
            .attr('stroke', 'rgba(255,0,0,0.5)')
            .attr('stroke-width', 0.1 * pixelsPerInch) // 0.1 inches
            .attr('stroke-dasharray', `${0.3 * pixelsPerInch},${0.2 * pixelsPerInch}`) // 0.3 and 0.2 inches

          screenGroup
            .append('line')
            .attr('x1', pixelArc.controlX)
            .attr('y1', pixelArc.controlY)
            .attr('x2', pixelArc.endX)
            .attr('y2', pixelArc.endY)
            .attr('stroke', 'rgba(255,0,0,0.5)')
            .attr('stroke-width', 0.1 * pixelsPerInch) // 0.1 inches
            .attr('stroke-dasharray', `${0.3 * pixelsPerInch},${0.2 * pixelsPerInch}`) // 0.3 and 0.2 inches

          // Actual deepest point marker
          if (pixelArc.actualDeepestY) {
            screenGroup
              .append('circle')
              .attr('cx', (pixelArc.startX + pixelArc.endX) / 2)
              .attr('cy', pixelArc.actualDeepestY)
              .attr('r', 0.3 * pixelsPerInch) // 0.3 inches
              .attr('fill', 'yellow')
              .attr('stroke', 'black')
              .attr('stroke-width', 0.05 * pixelsPerInch) // 0.05 inches

            screenGroup
              .append('text')
              .attr('x', (pixelArc.startX + pixelArc.endX) / 2)
              .attr('y', pixelArc.actualDeepestY - 1 * pixelsPerInch) // 1 inch above
              .attr('font-size', `${0.8 * pixelsPerInch}px`) // 0.8 inches
              .attr('text-anchor', 'middle')
              .attr('fill', 'black')
              .text('Actual Deepest Point')
          }
        }

        // Show endpoints for all screen types
        screenGroup
          .append('circle')
          .attr('cx', pixelArc.startX)
          .attr('cy', pixelArc.startY)
          .attr('r', 0.2 * pixelsPerInch) // 0.2 inches
          .attr('fill', 'blue')

        screenGroup
          .append('circle')
          .attr('cx', pixelArc.endX)
          .attr('cy', pixelArc.endY)
          .attr('r', 0.2 * pixelsPerInch) // 0.2 inches
          .attr('fill', 'green')

        screenGroup
          .append('text')
          .attr('x', (pixelArc.startX + pixelArc.endX) / 2)
          .attr('y', (pixelArc.startY + pixelArc.endY) / 2 - 1 * pixelsPerInch) // 1 inch above
          .attr('font-size', `${0.8 * pixelsPerInch}px`) // 0.8 inches
          .attr('text-anchor', 'middle')
          .text(`Screen ${i + 1}`)
      }
    })
  }, [arcs, color, debug, pixelsPerInch])

  return <g ref={svgRef}></g>
}
