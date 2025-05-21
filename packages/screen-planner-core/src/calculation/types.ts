export interface ScreenDimensions {
  panel: {
    width: number
    height: number
    diagonalLength: number
  }
  physical: {
    width: number
    height: number
    diagonalLength: number
  }
}

export interface AngleCalculations {
  recommendedSideAngle: number
  actualSideAngle: number
}

export interface FOVCalculations {
  horizontal: number
  vertical: number
}

export interface FootprintCalculations {
  totalWidth: number
  depth: number
}

export interface CurvatureCalculations {
  chordLength: number
  sagitta: number
  radius: number
  theta: number
}

export interface CalculationResults {
  dimensions: ScreenDimensions
  angles: AngleCalculations
  fov: FOVCalculations
  footprint: FootprintCalculations
  curvature?: CurvatureCalculations
}
