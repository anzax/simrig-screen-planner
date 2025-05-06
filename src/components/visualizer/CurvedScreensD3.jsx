import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function CurvedScreensD3({ arcs, color = '#000', debug = false }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!arcs || arcs.length === 0 || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // Clear previous renders

    arcs.forEach((arc, i) => {
      // Create container group for this screen
      const screenGroup = svg.append('g').attr('class', `screen-${i}`)

      // Define points for d3 curve
      let pathData
      let screenPoints

      if (arc.type === 'bezier') {
        // Create points for a natural curve with d3
        screenPoints = [
          [arc.startX, arc.startY],
          [(arc.startX + arc.controlX) / 2, (arc.startY + arc.controlY) / 2],
          [arc.controlX, arc.controlY],
          [(arc.endX + arc.controlX) / 2, (arc.endY + arc.controlY) / 2],
          [arc.endX, arc.endY],
        ]

        // Create a line generator with natural curve
        const lineGenerator = d3.line().curve(d3.curveBasis) // Natural curve that passes through control points

        pathData = lineGenerator(screenPoints)
      } else {
        // For standard arcs, use d3's arc generator
        const arcGenerator = d3
          .arc()
          .innerRadius(0)
          .outerRadius(arc.radius)
          .startAngle(arc.startAngle)
          .endAngle(arc.endAngle)

        pathData = arcGenerator()

        // Transform to arc center
        screenGroup.attr('transform', `translate(${arc.centerX}, ${arc.centerY})`)
      }

      // Draw monitor body - darker background
      const thickness = 5
      screenGroup
        .append('path')
        .attr('d', pathData)
        .attr('stroke', 'none')
        .attr('fill', 'rgba(60, 60, 70, 0.3)')
        .attr('transform', `translate(0, ${thickness / 2})`)

      // Draw screen front face
      screenGroup
        .append('path')
        .attr('d', pathData)
        .attr('stroke', color)
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'butt')
        .attr('fill', 'rgba(230, 240, 250, 0.2)')

      // Add debug elements if needed
      if (debug) {
        if (arc.type === 'bezier') {
          // Draw control points and connecting lines
          screenGroup
            .append('circle')
            .attr('cx', arc.controlX)
            .attr('cy', arc.controlY)
            .attr('r', 3)
            .attr('fill', 'red')

          // Control point connectors
          screenGroup
            .append('line')
            .attr('x1', arc.startX)
            .attr('y1', arc.startY)
            .attr('x2', arc.controlX)
            .attr('y2', arc.controlY)
            .attr('stroke', 'rgba(255,0,0,0.5)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,2')

          screenGroup
            .append('line')
            .attr('x1', arc.controlX)
            .attr('y1', arc.controlY)
            .attr('x2', arc.endX)
            .attr('y2', arc.endY)
            .attr('stroke', 'rgba(255,0,0,0.5)')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,2')

          // Actual deepest point marker
          if (arc.actualDeepestY) {
            screenGroup
              .append('circle')
              .attr('cx', (arc.startX + arc.endX) / 2)
              .attr('cy', arc.actualDeepestY)
              .attr('r', 3)
              .attr('fill', 'yellow')
              .attr('stroke', 'black')
              .attr('stroke-width', 0.5)

            screenGroup
              .append('text')
              .attr('x', (arc.startX + arc.endX) / 2)
              .attr('y', arc.actualDeepestY - 10)
              .attr('font-size', '8px')
              .attr('text-anchor', 'middle')
              .attr('fill', 'black')
              .text('Actual Deepest Point')
          }
        }

        // Show endpoints for all screen types
        screenGroup
          .append('circle')
          .attr('cx', arc.startX)
          .attr('cy', arc.startY)
          .attr('r', 2)
          .attr('fill', 'blue')

        screenGroup
          .append('circle')
          .attr('cx', arc.endX)
          .attr('cy', arc.endY)
          .attr('r', 2)
          .attr('fill', 'green')

        screenGroup
          .append('text')
          .attr('x', (arc.startX + arc.endX) / 2)
          .attr('y', (arc.startY + arc.endY) / 2 - 10)
          .attr('font-size', '8px')
          .attr('text-anchor', 'middle')
          .text(`Screen ${i + 1}`)
      }
    })
  }, [arcs, color, debug])

  return <g ref={svgRef}></g>
}
