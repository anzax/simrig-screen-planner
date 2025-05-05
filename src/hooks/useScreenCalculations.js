import { useMemo } from 'react'
import { ASPECT_RATIOS, RIG_CONSTANTS } from '../utils/constants'
import { calculateScreenGeometry, calculateSvgLayout } from '../utils/geometry'

export function useScreenCalculations(
  diagIn,
  ratio,
  distCm,
  bezelMm,
  setupType = 'triple',
  angleMode = 'auto',
  manualAngle = 60
) {
  const data = useMemo(() => {
    return calculateScreenGeometry(
      diagIn,
      ratio,
      distCm,
      bezelMm,
      setupType,
      angleMode,
      manualAngle
    )
  }, [diagIn, ratio, distCm, bezelMm, setupType, angleMode, manualAngle])

  const view = useMemo(() => {
    return calculateSvgLayout(data.geom, RIG_CONSTANTS)
  }, [data.geom])

  return { data, view }
}
