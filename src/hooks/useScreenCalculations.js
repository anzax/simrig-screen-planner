import { useMemo } from 'react'
import { RIG_CONSTANTS } from '../utils/constants'
import { calculateScreenGeometry, calculateSvgLayout } from '../utils/geometry'

export function useScreenCalculations(
  diagIn,
  ratio,
  distCm,
  bezelMm,
  setupType = 'triple',
  angleMode = 'auto',
  manualAngle = 60,
  inputMode = 'diagonal',
  screenWidth = 700,
  screenHeight = 400,
  isCurved = false,
  curveRadius = 1000
) {
  const data = useMemo(() => {
    return calculateScreenGeometry(
      diagIn,
      ratio,
      distCm,
      bezelMm,
      setupType,
      angleMode,
      manualAngle,
      inputMode,
      screenWidth,
      screenHeight,
      isCurved,
      curveRadius
    )
  }, [
    diagIn,
    ratio,
    distCm,
    bezelMm,
    setupType,
    angleMode,
    manualAngle,
    inputMode,
    screenWidth,
    screenHeight,
    isCurved,
    curveRadius,
  ])

  const view = useMemo(() => {
    return calculateSvgLayout(data.geom, RIG_CONSTANTS)
  }, [data.geom])

  return { data, view }
}
