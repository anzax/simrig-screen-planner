import { signal } from '@preact/signals'
import type { ScreenConfigState, AspectRatio, InputMode, SetupType, AngleMode } from './types'

export function createScreenConfigState(): ScreenConfigState {
  return {
    size: {
      diagonal: signal(32),
      aspectRatio: signal<AspectRatio>('16:9'),
      inputMode: signal<InputMode>('diagonal'),
      width: signal(700),
      height: signal(400),
    },
    bezel: {
      width: signal(0),
    },
    distance: {
      eye: signal(600),
    },
    arrangement: {
      type: signal<SetupType>('triple'),
      angleMode: signal<AngleMode>('auto'),
      manualAngle: signal(60),
    },
    curvature: {
      isCurved: signal(false),
      radius: signal(1000),
    },
  }
}
