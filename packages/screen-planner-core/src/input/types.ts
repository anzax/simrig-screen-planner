export type AspectRatio = '16:9' | '21:9' | '32:9'
export type SetupType = 'single' | 'triple'
export type InputMode = 'diagonal' | 'manual'
export type AngleMode = 'auto' | 'manual'

import type { Signal } from '@preact/signals'

export interface ScreenConfigState {
  size: {
    diagonal: Signal<number>
    aspectRatio: Signal<AspectRatio>
    inputMode: Signal<InputMode>
    width: Signal<number>
    height: Signal<number>
  }
  bezel: {
    width: Signal<number>
  }
  distance: {
    eye: Signal<number>
  }
  arrangement: {
    type: Signal<SetupType>
    angleMode: Signal<AngleMode>
    manualAngle: Signal<number>
  }
  curvature: {
    isCurved: Signal<boolean>
    radius: Signal<number>
  }
}
