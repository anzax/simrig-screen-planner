import { createScreenConfigState } from '../input/screenConfig'
import type {
  ScreenConfigState,
  AspectRatio,
  InputMode,
  SetupType,
  AngleMode,
} from '../input/types'

export const STORAGE_KEY = 'simrig-screen-configs'
export const PERSISTENCE_VERSION = 1

export type SerializedScreenConfig = {
  size: {
    diagonal: number
    aspectRatio: AspectRatio
    inputMode: InputMode
    width: number
    height: number
  }
  bezel: {
    width: number
  }
  distance: {
    eye: number
  }
  arrangement: {
    type: SetupType
    angleMode: AngleMode
    manualAngle: number
  }
  curvature: {
    isCurved: boolean
    radius: number
  }
}

export type ConfigId = 'main' | 'comparison'

export interface ScreenPlannerData {
  version: number
  activeConfigId: ConfigId
  configs: {
    main: SerializedScreenConfig
    comparison: SerializedScreenConfig | null
  }
}

export function serializeScreenConfig(config: ScreenConfigState): SerializedScreenConfig {
  return {
    size: {
      diagonal: config.size.diagonal.value,
      aspectRatio: config.size.aspectRatio.value,
      inputMode: config.size.inputMode.value,
      width: config.size.width.value,
      height: config.size.height.value,
    },
    bezel: {
      width: config.bezel.width.value,
    },
    distance: {
      eye: config.distance.eye.value,
    },
    arrangement: {
      type: config.arrangement.type.value,
      angleMode: config.arrangement.angleMode.value,
      manualAngle: config.arrangement.manualAngle.value,
    },
    curvature: {
      isCurved: config.curvature.isCurved.value,
      radius: config.curvature.radius.value,
    },
  }
}

export function deserializeScreenConfig(data: SerializedScreenConfig): ScreenConfigState {
  const cfg = createScreenConfigState()
  cfg.size.diagonal.value = data.size.diagonal
  cfg.size.aspectRatio.value = data.size.aspectRatio
  cfg.size.inputMode.value = data.size.inputMode
  cfg.size.width.value = data.size.width
  cfg.size.height.value = data.size.height
  cfg.bezel.width.value = data.bezel.width
  cfg.distance.eye.value = data.distance.eye
  cfg.arrangement.type.value = data.arrangement.type
  cfg.arrangement.angleMode.value = data.arrangement.angleMode
  cfg.arrangement.manualAngle.value = data.arrangement.manualAngle
  cfg.curvature.isCurved.value = data.curvature.isCurved
  cfg.curvature.radius.value = data.curvature.radius
  return cfg
}

export function saveScreenPlannerData(data: ScreenPlannerData): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function loadScreenPlannerData(): ScreenPlannerData | null {
  if (typeof localStorage === 'undefined') {
    return null
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as ScreenPlannerData
    if (parsed.version !== PERSISTENCE_VERSION) return null
    return parsed
  } catch {
    return null
  }
}
