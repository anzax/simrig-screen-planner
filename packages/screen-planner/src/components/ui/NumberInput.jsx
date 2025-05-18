import React from 'react'

/**
 * A simple number input component without a slider
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the input
 * @param {number} props.value - Current value
 * @param {Function} props.onChange - Function called when value changes
 * @param {string} [props.className] - Optional additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
export default function NumberInput({ label, value, onChange, className = '' }) {
  return (
    <div className={className}>
      {label && <div className="text-xs text-gray-600 mb-0.5">{label}</div>}
      <input
        type="number"
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
        value={value}
        onChange={e => onChange(+e.target.value)}
      />
    </div>
  )
}
