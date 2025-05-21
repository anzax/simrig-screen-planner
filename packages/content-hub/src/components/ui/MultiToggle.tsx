import type { ComponentChildren } from 'preact'

export interface MultiToggleOption<T extends string = string> {
  value: T
  label: ComponentChildren
}

export interface MultiToggleProps<T extends string = string> {
  /** Currently selected value */
  value: T
  /** Toggle options */
  options: MultiToggleOption<T>[]
  /** Fired when a new option is selected */
  onChange: (value: T) => void
  /** Optional label displayed above the toggle */
  label?: string
}

/**
 * Multi-option toggle switch, rewritten from React to Preact/TS.
 */
function MultiToggle<T extends string>({ value, options, onChange, label }: MultiToggleProps<T>) {
  return (
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
}

export default MultiToggle
