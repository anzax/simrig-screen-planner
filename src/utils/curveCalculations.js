export function calculateCurvedScreenPoints(
  screenWidth,
  centerY,
  curveDepth,
  angle = 0,
  isCenter = false
) {
  // Unified approach for all screens (center and side)
  const halfWidth = screenWidth / 2
  const angleRad = (angle * Math.PI) / 180

  // For center screen (straight ahead)
  if (isCenter || angle === 0) {
    return {
      startX: -halfWidth,
      startY: centerY + curveDepth, // Adjust for sagitta
      endX: halfWidth,
      endY: centerY + curveDepth,
      controlX: 0,
      controlY: centerY,
      actualDeepestY: centerY,
    }
  }

  // For side screens - use the same curve model as center screen but rotated and positioned
  // Calculate the outer point of the side screen
  const outerX = halfWidth + screenWidth * Math.cos(angleRad)
  const outerY = centerY + curveDepth + screenWidth * Math.sin(angleRad)

  // Calculate the midpoint between start and end points
  const midX = (halfWidth + outerX) / 2
  const midY = (centerY + curveDepth + outerY) / 2

  // Calculate the vector from midpoint to control point (perpendicular to screen direction)
  // This ensures the same curve shape as the center screen
  const screenDirX = outerX - halfWidth
  const screenDirY = outerY - (centerY + curveDepth)
  const screenLength = Math.sqrt(screenDirX * screenDirX + screenDirY * screenDirY)

  // Normalize the screen direction vector
  const normDirX = screenDirX / screenLength
  const normDirY = screenDirY / screenLength

  // Perpendicular vector (rotate 90 degrees clockwise)
  const perpDirX = normDirY
  const perpDirY = -normDirX

  // Calculate control point - same depth as center screen relative to chord
  const controlX = midX + perpDirX * curveDepth
  const controlY = midY + perpDirY * curveDepth

  return {
    startX: halfWidth,
    startY: centerY + curveDepth,
    endX: outerX,
    endY: outerY,
    controlX: controlX,
    controlY: controlY,
    actualDeepestY: centerY, // Use same reference point as center screen for consistency
  }
}
