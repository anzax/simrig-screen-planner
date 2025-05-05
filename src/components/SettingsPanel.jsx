import React, { useState } from 'react'
import NumberInputWithSlider from './NumberInputWithSlider'

export default function SettingsPanel({
  // Basic inputs
  diagIn,
  setDiagIn,
  ratio,
  setRatio,
  distCm,
  setDistCm,
  bezelMm,
  setBezelMm,
  // Enhanced inputs
  inputMode,
  setInputMode,
  setupType,
  setSetupType,
  angleMode,
  setAngleMode,
  manualAngle,
  setManualAngle,
  screenWidth,
  setScreenWidth,
  screenHeight,
  setScreenHeight,
  // Curved screen options
  isCurved,
  setIsCurved,
  curveRadius,
  setCurveRadius,
}) {
  // Calculate optimal angle based on current settings
  const calculatedAngle =
    diagIn && ratio && distCm
      ? parseFloat(
          (
            (Math.atan(
              ((diagIn + (bezelMm * 2) / 25.4) *
                (ratio === '16:9'
                  ? 16 / Math.hypot(16, 9)
                  : ratio === '21:9'
                    ? 21 / Math.hypot(21, 9)
                    : 32 / Math.hypot(32, 9))) /
                2 /
                (distCm / 2.54)
            ) *
              180) /
            Math.PI
          ).toFixed(1)
        )
      : 60

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Three-column layout container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: Screen Size with toggle and relevant controls */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Screen Size</h3>

          {/* Input Method Toggle */}
          <div className="mb-3">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  inputMode === 'diagonal'
                    ? 'bg-white text-gray-900 font-medium shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setInputMode('diagonal')}
              >
                Diagonal
              </button>
              <button
                className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  inputMode === 'manual'
                    ? 'bg-white text-gray-900 font-medium shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setInputMode('manual')}
              >
                Width&nbsp;&times;&nbsp;Height
              </button>
            </div>
          </div>

          {/* Screen Dimensions - Conditional based on input mode */}
          {inputMode === 'diagonal' ? (
            <div className="space-y-3">
              {/* Screen Size */}
              <NumberInputWithSlider
                label="Diagonal, in"
                min={17}
                max={77}
                value={diagIn}
                onChange={setDiagIn}
              />

              {/* Aspect Ratio */}
              <div>
                <div className="text-xs text-gray-600 mb-0.5">Aspect Ratio</div>
                <select
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-white"
                  value={ratio}
                  onChange={e => setRatio(e.target.value)}
                >
                  <option value="16:9">16:9</option>
                  <option value="21:9">21:9</option>
                  <option value="32:9">32:9</option>
                </select>
              </div>

              {/* Bezel Thickness */}
              <NumberInputWithSlider
                label="Bezel width, mm"
                min={0}
                max={50}
                value={bezelMm}
                onChange={setBezelMm}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg py-1.5 px-2 text-xs text-blue-700">
                Measure screen dimensions including bezels
              </div>

              {/* Width */}
              <div>
                <div className="text-xs text-gray-600 mb-0.5">Width, mm</div>
                <input
                  type="number"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  value={screenWidth}
                  onChange={e => setScreenWidth(+e.target.value)}
                />
              </div>

              {/* Height */}
              <div>
                <div className="text-xs text-gray-600 mb-0.5">Height, mm</div>
                <input
                  type="number"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                  value={screenHeight}
                  onChange={e => setScreenHeight(+e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Triple/Single setup and angle controls */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Screen Layout</h3>

          {/* Setup Type */}
          <div className="mb-3">
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
              <button
                className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  setupType === 'single'
                    ? 'bg-white text-gray-900 font-medium shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setSetupType('single')}
              >
                Single
              </button>
              <button
                className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  setupType === 'triple'
                    ? 'bg-white text-gray-900 font-medium shadow-sm'
                    : 'text-gray-600'
                }`}
                onClick={() => setSetupType('triple')}
              >
                Triple
              </button>
            </div>
          </div>

          {/* Monitor Angle - only for triple */}
          {setupType === 'triple' ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-600 mb-0.5">Side Screen Angle</div>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-1">
                  <button
                    className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors ${
                      angleMode === 'auto'
                        ? 'bg-white text-gray-900 font-medium shadow-sm'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setAngleMode('auto')}
                  >
                    Auto
                  </button>
                  <button
                    className={`flex-1 px-3 py-1 text-sm rounded-md transition-colors ${
                      angleMode === 'manual'
                        ? 'bg-white text-gray-900 font-medium shadow-sm'
                        : 'text-gray-600'
                    }`}
                    onClick={() => setAngleMode('manual')}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {angleMode === 'auto' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg py-1.5 px-2">
                  <div className="text-xs text-green-700">
                    Recommended: <span className="font-medium">{calculatedAngle}°</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg py-1.5 px-2 mb-1.5">
                    <div className="text-xs text-yellow-700">
                      Recommended: <span className="font-medium">{calculatedAngle}°</span>
                    </div>
                  </div>
                  <NumberInputWithSlider
                    label="Angle, degrees"
                    min={30}
                    max={90}
                    value={manualAngle}
                    onChange={setManualAngle}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg py-3 px-3 text-xs text-blue-700 h-24 flex items-center justify-center">
              <p className="text-center">
                Single screen setup selected.
                <br />
                No angle adjustments needed.
              </p>
            </div>
          )}
        </div>

        {/* Column 3: Screen distance and future curved options */}
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Viewing Distance</h3>

          {/* Eye Distance */}
          <div className="mb-3">
            <NumberInputWithSlider
              label="Eye Distance, cm"
              min={50}
              max={150}
              value={distCm}
              onChange={setDistCm}
            />
          </div>

          {/* Curved Screen Options */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Screen Curvature</h3>

            {/* Flat/Curved Toggle */}
            <div className="mb-3">
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    !isCurved ? 'bg-white text-gray-900 font-medium shadow-sm' : 'text-gray-600'
                  }`}
                  onClick={() => setIsCurved(false)}
                >
                  Flat
                </button>
                <button
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isCurved ? 'bg-white text-gray-900 font-medium shadow-sm' : 'text-gray-600'
                  }`}
                  onClick={() => setIsCurved(true)}
                >
                  Curved
                </button>
              </div>
            </div>

            {/* Curve Radius - only shown when curved is selected */}
            {isCurved && (
              <NumberInputWithSlider
                label="Curve Radius, mm (eg. 1800R)"
                min={800}
                max={1800}
                step={100}
                value={curveRadius}
                onChange={setCurveRadius}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
