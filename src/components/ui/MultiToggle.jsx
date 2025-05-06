import React from 'react'

/**
 * A reusable toggle component that supports multiple options
 * @param {Object} props - Component props
 * @param {string} props.value - Current selected value
 * @param {Array<{value: string, label: React.ReactNode}>} props.options - Array of option objects with value and label properties
 * @param {Function} props.onChange - Function called when selection changes
 * @param {string} [props.label] - Optional label for the toggle
 * @returns {JSX.Element} - Rendered component
 */
export default function MultiToggle({ value, options, onChange, label }) {
  return (
    <div>
      {label && <div className="text-xs text-gray-600 mb-0.5">{label}</div>}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
        {options.map(option => (
          <button
            key={option.value}
            className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
              value === option.value
                ? 'bg-white text-gray-900 font-medium shadow-sm'
                : 'text-gray-600'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
