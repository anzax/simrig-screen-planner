export function inchesToMm(inches: number): number {
  return inches * 25.4
}

export function mmToInches(mm: number): number {
  return mm / 25.4
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI
}
