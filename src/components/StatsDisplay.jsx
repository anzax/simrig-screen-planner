import React from 'react'
import Card from './ui/Card'

export default function StatsDisplay({
  data,
  secondConfig,
  onAddConfig,
  activeConfig,
  setActiveConfig,
  isAnimating = false,
}) {
  const hasSecondConfig = secondConfig !== undefined

  // Function to render a unified stats card
  const renderStatsCard = (data, isSecondary = false) => {
    return (
      <div>
        {data ? (
          <div className="grid grid-cols-2 gap-4 text-center">
            <Card v={`${data.sideAngleDeg.toFixed(1)}°`} l="Support Angle" />
            <Card v={`${data.hFOVdeg.toFixed(1)}°`} l="Horizontal FOV" />
            <Card v={`${data.vFOVdeg.toFixed(1)}°`} l="Vertical FOV" />
            <Card v={`${data.cm.totalWidth.toFixed(1)} cm`} l="Total Width" />
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <div className="text-center">
              <div className="text-lg font-medium">Default values will appear here</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Function to render the "Add Config" card
  const renderAddConfigCard = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-xl font-semibold text-blue-600 py-4">Add a 2nd Config</div>
      <div className="text-sm text-blue-500 mb-2">to compare different screen setups</div>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Main Configuration Container */}
      <div
        className={`bg-white rounded-lg shadow-sm border p-4 transition-all duration-300 ${activeConfig === 'main' ? 'border-gray-600 shadow-md ' + (isAnimating && activeConfig === 'main' ? 'animate-highlight' : '') : 'border-gray-200 hover:border-gray-600 transition-colors cursor-pointer'}`}
        onClick={() => hasSecondConfig && setActiveConfig('main')}
      >
        {renderStatsCard(data)}
      </div>

      {/* Second Configuration Container */}
      <div
        className={`rounded-lg shadow-sm border p-4 transition-all duration-300 ${!hasSecondConfig ? 'bg-white border-blue-200 hover:border-blue-500 transition-colors cursor-pointer' : 'bg-blue-100 ' + (activeConfig === 'second' ? 'border-blue-600 shadow-md ' + (isAnimating && activeConfig === 'second' ? 'animate-highlight' : '') : 'border-gray-200 hover:border-blue-500 transition-colors cursor-pointer')}`}
        onClick={!hasSecondConfig ? onAddConfig : () => setActiveConfig('second')}
      >
        {hasSecondConfig ? renderStatsCard(secondConfig, true) : renderAddConfigCard()}
      </div>
    </div>
  )
}
