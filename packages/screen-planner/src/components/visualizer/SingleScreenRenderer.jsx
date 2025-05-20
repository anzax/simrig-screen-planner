import React from 'react'
import * as d3 from 'd3'

/**
 * Renders a single screen using D3
 * @param {Object} props - Component props
 * @param {Object} props.arc - Arc data for the screen
 * @param {number} props.index - Index of the screen
 * @param {string} props.color - Color of the screen
 * @param {boolean} props.debug - Whether to show debug elements
 * @param {number} props.pixelsPerInch - Pixels per inch for scaling
 * @param {Object} props.d3Container - D3 selection of the container element
 * @returns {null} - This component doesn't return any JSX, it renders directly to the D3 container
 */
export default function SingleScreenRenderer({
  arc,
  index,
  color,
  debug,
  pixelsPerInch,
  d3Container,
}) {
  // Create container group for this screen
  const screenGroup = d3Container.append('g').attr('class', `screen-${index}`)

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

  // Convert idealPoints from inches to pixels if they exist
  if (arc.idealPoints) {
    pixelArc.idealPoints = arc.idealPoints.map(point => [
      point[0] * pixelsPerInch,
      point[1] * pixelsPerInch,
    ])
  }

  // Convert actualDeepestPoint from inches to pixels if it exists
  if (arc.actualDeepestPoint) {
    pixelArc.actualDeepestPoint = [
      arc.actualDeepestPoint[0] * pixelsPerInch,
      arc.actualDeepestPoint[1] * pixelsPerInch,
    ]
  }

  // Define points for d3 curve
  let pathData

  if (pixelArc.type === 'bezier') {
    // Calculate intermediate points using the Bezier formula with the control point
    let intermediatePoint1, intermediatePoint2

    // Always use the Bezier formula with the control point adjusted by apexShiftMultiplier
    // This ensures the visual rendering reflects changes to apexShiftMultiplier
    const t1 = 0.25
    const t2 = 0.75
    intermediatePoint1 = [
      (1 - t1) * (1 - t1) * pixelArc.startX +
        2 * (1 - t1) * t1 * pixelArc.controlX +
        t1 * t1 * pixelArc.endX,
      (1 - t1) * (1 - t1) * pixelArc.startY +
        2 * (1 - t1) * t1 * pixelArc.controlY +
        t1 * t1 * pixelArc.endY,
    ]
    intermediatePoint2 = [
      (1 - t2) * (1 - t2) * pixelArc.startX +
        2 * (1 - t2) * t2 * pixelArc.controlX +
        t2 * t2 * pixelArc.endX,
      (1 - t2) * (1 - t2) * pixelArc.startY +
        2 * (1 - t2) * t2 * pixelArc.controlY +
        t2 * t2 * pixelArc.endY,
    ]

    // For all screens, use only the start, intermediate points, and end points
    // This ensures the curve reflects the control point adjusted by apexShiftMultiplier
    const screenPoints = [
      [pixelArc.startX, pixelArc.startY],
      intermediatePoint1,
      intermediatePoint2,
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
    .attr('stroke-width', 0.3 * pixelsPerInch) // 0.3 inches
    .attr('stroke-linecap', 'butt')
    .attr('fill', 'rgba(230, 240, 250, 0.2)')

  // Add debug elements if needed
  if (debug) {
    renderDebugElements(screenGroup, pixelArc, index, pixelsPerInch)
  }

  // This component doesn't return any JSX, it renders directly to the D3 container
  return null
}

/**
 * Renders debug elements for a screen
 * @param {Object} screenGroup - D3 selection of the screen group
 * @param {Object} pixelArc - Arc data for the screen in pixels
 * @param {number} index - Index of the screen
 * @param {number} pixelsPerInch - Pixels per inch for scaling
 */
function renderDebugElements(screenGroup, pixelArc, index, pixelsPerInch) {
  if (pixelArc.type === 'bezier') {
    // Draw control points and connecting lines
    // Changed to orange to indicate this is the shifted apex
    screenGroup
      .append('circle')
      .attr('cx', pixelArc.controlX)
      .attr('cy', pixelArc.controlY)
      .attr('r', 0.3 * pixelsPerInch) // 0.3 inches
      .attr('fill', 'orange')

    // Add label for the shifted apex
    screenGroup
      .append('text')
      .attr('x', pixelArc.controlX)
      .attr('y', pixelArc.controlY - 1 * pixelsPerInch) // 1 inch above
      .attr('font-size', `${0.8 * pixelsPerInch}px`) // 0.8 inches
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .text('Shifted Apex')

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

    // Debug: ideal arc points
    if (pixelArc.idealPoints) {
      // Use pre-calculated ideal points from upstream
      pixelArc.idealPoints.forEach(([x, y]) =>
        screenGroup
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 0.2 * pixelsPerInch)
          .attr('fill', 'orange')
      )
    }

    // Actual deepest point marker
    if (pixelArc.actualDeepestPoint) {
      // Use the actual deepest point coordinates
      const [deepX, deepY] = pixelArc.actualDeepestPoint

      screenGroup
        .append('circle')
        .attr('cx', deepX)
        .attr('cy', deepY)
        .attr('r', 0.3 * pixelsPerInch) // 0.3 inches
        .attr('fill', 'red') // Changed to red as per requirement
        .attr('stroke', 'black')
        .attr('stroke-width', 0.05 * pixelsPerInch) // 0.05 inches

      screenGroup
        .append('text')
        .attr('x', deepX)
        .attr('y', deepY - 1 * pixelsPerInch) // 1 inch above
        .attr('font-size', `${0.8 * pixelsPerInch}px`) // 0.8 inches
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text('Actual Apex')
    }
    // Fallback to using actualDeepestY if actualDeepestPoint is not available
    else if (pixelArc.actualDeepestY) {
      screenGroup
        .append('circle')
        .attr('cx', (pixelArc.startX + pixelArc.endX) / 2)
        .attr('cy', pixelArc.actualDeepestY)
        .attr('r', 0.3 * pixelsPerInch) // 0.3 inches
        .attr('fill', 'red') // Changed to red as per requirement
        .attr('stroke', 'black')
        .attr('stroke-width', 0.05 * pixelsPerInch) // 0.05 inches

      screenGroup
        .append('text')
        .attr('x', (pixelArc.startX + pixelArc.endX) / 2)
        .attr('y', pixelArc.actualDeepestY - 1 * pixelsPerInch) // 1 inch above
        .attr('font-size', `${0.8 * pixelsPerInch}px`) // 0.8 inches
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text('Actual Apex')
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
    .text(`Screen ${index + 1}`)
}
