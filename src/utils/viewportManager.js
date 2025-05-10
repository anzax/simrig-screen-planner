export function calculateViewportConfig(mainView, comparisonView) {
  // Use a larger scale factor for better visibility
  const INCH_TO_PIXEL = 10
  const PADDING = 1

  // Calculate horizontal dimensions
  const totalWidthInches = Math.max(mainView?.totalWidth || 0, comparisonView?.totalWidth || 0)

  // Calculate vertical dimensions by finding the maximum extent
  const allViews = [mainView, comparisonView].filter(Boolean)

  let maxY = 0
  let minY = 0

  // Examine all screen edges, arcs, and lines to find maximum vertical extent
  allViews.forEach(view => {
    // Check lines for flat screens
    const lines = Array.isArray(view.lines) ? view.lines : []
    lines.forEach(line => {
      maxY = Math.max(maxY, line.y1 || 0, line.y2 || 0)
      minY = Math.min(minY, line.y1 || 0, line.y2 || 0)
    })

    // Check arcs for curved screens
    const arcs = Array.isArray(view.arcs) ? view.arcs : []
    arcs.forEach(arc => {
      // For curved screens, consider control points and actual deepest point
      // Only use actual points (start, end, actualDeepest) for viewport calculations
      // Exclude controlY (shifted apex) as it affects scaling incorrectly
      maxY = Math.max(maxY, arc.startY || 0, arc.endY || 0, arc.actualDeepestY || 0)
      minY = Math.min(minY, arc.startY || 0, arc.endY || 0, arc.actualDeepestY || 0)
    })
  })

  // Add space for the head and rig
  const RIG_HEIGHT = 35 // from RIG_L_CM converted to inches
  minY = Math.min(minY, -RIG_HEIGHT * 0.93) // Match the offset in RigAndHead

  // Calculate the actual vertical range (don't double it)
  const verticalRange = Math.max(1, maxY - minY) // Ensure positive value

  // Add 20% to width for margins
  const widthWithMargin = totalWidthInches * 0.9

  // Calculate viewport dimensions
  const viewportWidth = widthWithMargin * INCH_TO_PIXEL + PADDING * 2
  const viewportHeight = verticalRange * INCH_TO_PIXEL + PADDING * 2 * 2 // Extra padding for vertical

  // Calculate center points based on the content distribution
  const verticalMidpoint = (maxY + minY) / 2
  const centerY = viewportHeight / 2 - verticalMidpoint * INCH_TO_PIXEL

  return {
    width: viewportWidth,
    height: viewportHeight,
    centerX: viewportWidth / 2,
    centerY: centerY,
    padding: PADDING,
    pixelsPerInch: INCH_TO_PIXEL,
  }
}
