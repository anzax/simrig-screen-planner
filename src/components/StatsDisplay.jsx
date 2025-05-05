import React from 'react'
import Card from './Card'

export default function StatsDisplay({ data }) {
  return (
    <div className="grid sm:grid-cols-6 gap-4 text-center">
      <Card v={`${data.sideAngleDeg.toFixed(1)}°`} l="Side screen angle" />
      <Card v={`${data.hFOVdeg.toFixed(1)}°`} l="Horizontal FOV" />
      <Card v={`${data.vFOVdeg.toFixed(1)}°`} l="Vertical FOV" />
      <Card v={`${data.cm.distance.toFixed(1)} cm`} l="Eye‑to‑screen" />
      <Card v={`${Math.round(data.cm.bezel)} mm`} l="Bezel size" />
      <Card v={`${data.cm.totalWidth.toFixed(1)} cm`} l="Total width" />
      {/* Show screen dimensions */}
      <Card
        v={`${data.screen.widthMm} × ${data.screen.heightMm} mm`}
        l={data.screen.inputMode === 'diagonal' ? 'Screen dimensions (calc)' : 'Screen dimensions'}
      />
      {/* Show curved screen info if enabled */}
      {data.curved && data.curved.isCurved && (
        <Card v={`${data.curved.curveRadius} mm`} l="Curve radius" />
      )}
    </div>
  )
}
