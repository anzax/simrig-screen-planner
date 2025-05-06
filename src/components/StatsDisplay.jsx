import React from 'react'
import Card from './ui/Card'

export default function StatsDisplay({ data }) {
  return (
    <div className="grid sm:grid-cols-6 gap-4 text-center">
      <Card
        v={`${data.sideAngleDeg.toFixed(1)}°`}
        l="Support arm angle"
        tooltip="Angle to set on your physical monitor stands"
      />
      <Card v={`${data.hFOVdeg.toFixed(1)}°`} l="Horizontal FOV" />
      <Card v={`${data.vFOVdeg.toFixed(1)}°`} l="Vertical FOV" />

      {data.curved && data.curved.isCurved ? (
        <>
          <Card
            v={`${data.cm.distance.toFixed(1)} cm`}
            l="Eye‑to‑center"
            tooltip="Distance from eye to center of curved screen"
          />
          <Card
            v={`${(data.curved.chordDistanceIn * 2.54).toFixed(1)} cm`}
            l="Chord distance"
            tooltip="Distance from eye to the chord plane (straight line between screen edges)"
          />
        </>
      ) : (
        <Card v={`${data.cm.distance.toFixed(1)} cm`} l="Eye‑to‑screen" />
      )}

      <Card v={`${Math.round(data.cm.bezel)} mm`} l="Bezel size" />
      <Card v={`${data.cm.totalWidth.toFixed(1)} cm`} l="Total width" />

      {/* Show screen dimensions */}
      <Card
        v={`${data.screen.widthMm} × ${data.screen.heightMm} mm`}
        l={data.screen.inputMode === 'diagonal' ? 'Screen dimensions (calc)' : 'Screen dimensions'}
      />

      {/* Show curved screen info if enabled */}
      {data.curved && data.curved.isCurved && (
        <>
          <Card v={`${data.curved.curveRadius} mm`} l="Curve radius" />
          <Card
            v={`${Math.round(data.curved.chordIn * 25.4)} mm`}
            l="Chord width"
            tooltip="Straight-line width of the curved screen"
          />
          <Card
            v={`${Math.round(data.curved.sagittaIn * 25.4)} mm`}
            l="Curve depth"
            tooltip="Maximum depth of the curve from the chord"
          />
          <Card
            v={`${((data.curved.theta * 180) / Math.PI).toFixed(1)}°`}
            l="Central angle"
            tooltip="Angle subtended by the screen arc"
          />
        </>
      )}
    </div>
  )
}
