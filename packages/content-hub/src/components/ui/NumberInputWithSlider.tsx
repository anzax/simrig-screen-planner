import type { ComponentType } from 'preact'
import { useState, useEffect } from 'preact/hooks'

interface NumberInputWithSliderProps {
  /** Optional field label shown above the controls */
  label?: string
  /** Minimum allowed numeric value */
  min: number
  /** Maximum allowed numeric value */
  max: number
  /** Step value for both slider and input (default 1) */
  step?: number
  /** Current numeric value (controlled) */
  value: number
  /** Callback fired when the committed value changes */
  onChange: (v: number) => void
  /** Unit label displayed next to the number input */
  unit?: string
  /** Additional CSS classes for the outer wrapper */
  className?: string
}

/**
 * Combined range slider + numeric input with optional label and unit.
 *
 * Mirrors the legacy React component but rewritten for Preact/TypeScript.
 */
const NumberInputWithSlider: ComponentType<NumberInputWithSliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = '',
  className = '',
}) => {
  const [localValue, setLocalValue] = useState<number>(value)

  /* keep local state in sync with external value */
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  /* slider change: update immediately */
  const handleSliderChange = (e: Event) => {
    const newValue = Number((e.target as HTMLInputElement).value)
    setLocalValue(newValue)
    onChange(newValue)
  }

  /* text input change: local only */
  const handleInputChange = (e: Event) => {
    setLocalValue(Number((e.target as HTMLInputElement).value))
  }

  /* commit value on blur / Enter */
  const commit = () => {
    const clamped = Math.min(Math.max(localValue, min), max)
    setLocalValue(clamped)
    onChange(clamped)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      commit()
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <div class={className}>
      {label && <div class="text-xs text-gray-600 mb-0.5">{label}</div>}
      <div class="flex items-center gap-2">
        <input
          type="range"
          class="flex-1"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onInput={handleSliderChange}
        />
        <div class="flex items-center">
          <input
            type="number"
            class="w-20 px-1.5 py-0.5 text-sm border border-gray-300 rounded"
            value={localValue}
            min={min}
            max={max}
            step={step}
            onInput={handleInputChange}
            onBlur={commit}
            onKeyDown={handleKeyDown}
          />
          {unit && <span class="text-xs text-gray-500 ml-1">{unit}</span>}
        </div>
      </div>
    </div>
  )
}

export default NumberInputWithSlider
