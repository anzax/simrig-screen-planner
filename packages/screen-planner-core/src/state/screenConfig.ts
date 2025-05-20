import { signal, computed } from '@preact/signals'

// Define core types
export type AspectRatio = '16:9' | '21:9' | '32:9'
export type SetupType = 'single' | 'triple'
export type InputMode = 'diagonal' | 'manual'
export type AngleMode = 'auto' | 'manual'

// State shape definition
export const createScreenConfigState = () => {
  // Main configuration signals
  const screen = {
    diagIn: signal(32),
    ratio: signal<AspectRatio>('16:9'),
    bezelMm: signal(5),
    // For manual dimensions if needed
    screenWidth: signal(700),
    screenHeight: signal(400),
    inputMode: signal<InputMode>('diagonal'),
  }

  const distance = {
    distCm: signal(70),
  }

  const layout = {
    setupType: signal<SetupType>('triple'),
    manualAngle: signal(60),
    angleMode: signal<AngleMode>('auto'),
  }

  const curvature = {
    isCurved: signal(false),
    curveRadius: signal(1800),
  }

  // Computed values (stubbed calculations)
  const calculatedResults = computed(() => {
    // Replace with actual calculation logic
    return {
      sideAngleDeg: layout.manualAngle.value,
      hFOVdeg: 0,
      vFOVdeg: 0,
      totalWidth: 0,
    }
  })

  // Visualization data (stubbed)
  const visualizationData = computed(() => {
    // Replace with visualization calculations
    return {}
  })

  return {
    screen,
    distance,
    layout,
    curvature,
    calculatedResults,
    visualizationData,
  }
}

// Export singleton instance for client-side use
export const screenConfig = createScreenConfigState()
