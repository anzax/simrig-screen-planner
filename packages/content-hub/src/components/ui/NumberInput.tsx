import type { ComponentType } from 'preact'

interface NumberInputProps {
  /** Optional label displayed above the input */
  label?: string
  /** Current numeric value */
  value: number
  /** Callback fired whenever the value changes */
  onChange: (value: number) => void
  /** Additional CSS classes applied to the outer container */
  className?: string
}

/**
 * Lightweight numeric input field.
 *
 * Mirrors styling from the legacy React component but implemented
 * with Preact + TypeScript for the new architecture.
 */
const NumberInput: ComponentType<NumberInputProps> = ({
  label,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div class={className}>
      {label && <div class="text-xs text-gray-600 mb-0.5">{label}</div>}
      <input
        type="number"
        class="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
        value={value}
        onInput={e => onChange(Number((e.target as HTMLInputElement).value))}
      />
    </div>
  )
}

export default NumberInput
