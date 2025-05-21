import type { ComponentType } from 'preact'
import { isDevelopment } from '@simrigbuild/screen-planner-core'

interface DebugToggleProps {
  enabled: boolean
  onToggle: () => void
}

const DebugToggle: ComponentType<DebugToggleProps> = ({ enabled, onToggle }) => {
  if (!isDevelopment) return null

  return (
    <button
      type="button"
      onClick={onToggle}
      class={`fixed bottom-4 right-4 z-50 p-2 rounded-full ${
        enabled ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      🐞
    </button>
  )
}

export default DebugToggle
