import React, { useState } from 'react'

export default function NumberInputWithSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  unit = '',
  className = '',
}) {
  const [localValue, setLocalValue] = useState(value)

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Handle slider change (immediate update)
  const handleSliderChange = e => {
    const newValue = +e.target.value
    setLocalValue(newValue)
    onChange(newValue)
  }

  // Handle input change (only updates local state)
  const handleInputChange = e => {
    setLocalValue(e.target.value)
  }

  // Handle blur and enter key (commits the change)
  const handleCommit = () => {
    // Convert to number and clamp between min and max
    const newValue = Math.min(Math.max(+localValue, min), max)
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleCommit()
      e.target.blur()
    }
  }

  return (
    <div className={className}>
      {label && <div className="text-xs text-gray-600 mb-0.5">{label}</div>}
      <div className="flex items-center gap-2">
        <input
          type="range"
          className="flex-1"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleSliderChange}
        />
        <div className="flex items-center">
          <input
            type="number"
            className="w-20 px-1.5 py-0.5 text-sm border border-gray-300 rounded"
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleCommit}
            onKeyDown={handleKeyDown}
            min={min}
            max={max}
            step={step}
          />
          {unit && <span className="text-xs text-gray-500 ml-1">{unit}</span>}
        </div>
      </div>
    </div>
  )
}
