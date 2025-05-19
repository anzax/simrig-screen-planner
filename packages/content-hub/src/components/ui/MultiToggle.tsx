import type { ComponentType, ComponentChildren } from 'preact'

export interface MultiToggleOption {
  value: string
  label: ComponentChildren
}

interface MultiToggleProps {
  /** Currently selected value */
  value: string
  /** Toggle options */
  options: MultiToggleOption[]
  /** Fired when a new option is selected */
  onChange: (value: string) => void
  /** Optional label displayed above the toggle */
  label?: string
}

/**
 * Multi-option toggle switch, rewritten from React to Preact/TS.
 */
const MultiToggle: ComponentType<MultiToggleProps> = ({ value, options, onChange, label }) => (
  <div>
    {label && <div class="text-xs text-gray-600 mb-0.5">{label}</div>}
    <div class="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {options.map(opt => (
        <button
          key={opt.value}
          class={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
            value === opt.value ? 'bg-white text-gray-900 font-medium shadow-sm' : 'text-gray-600'
          }`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
)

export default MultiToggle
