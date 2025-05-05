import { create } from 'zustand'

export const useSettingsStore = create(set => ({
  // Basic inputs
  diagIn: 32,
  ratio: '16:9',
  distCm: 60,
  bezelMm: 0,

  // Enhanced inputs
  inputMode: 'diagonal',
  setupType: 'triple',
  angleMode: 'auto',
  manualAngle: 60,
  screenWidth: 700,
  screenHeight: 400,

  // Curved screen options
  isCurved: false,
  curveRadius: 1000,

  // Actions
  setDiagIn: value => set({ diagIn: value }),
  setRatio: value => set({ ratio: value }),
  setDistCm: value => set({ distCm: value }),
  setBezelMm: value => set({ bezelMm: value }),
  setInputMode: value => set({ inputMode: value }),
  setSetupType: value => set({ setupType: value }),
  setAngleMode: value => set({ angleMode: value }),
  setManualAngle: value => set({ manualAngle: value }),
  setScreenWidth: value => set({ screenWidth: value }),
  setScreenHeight: value => set({ screenHeight: value }),
  setIsCurved: value => set({ isCurved: value }),
  setCurveRadius: value => set({ curveRadius: value }),
}))
