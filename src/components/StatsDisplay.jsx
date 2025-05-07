import React from 'react'
import Card from './ui/Card'

export default function StatsDisplay({ data }) {
  return (
    <div className="grid sm:grid-cols-4 gap-4 text-center">
      <Card
        v={`${data.sideAngleDeg.toFixed(1)}°`}
        l="Support arm angle"
        tooltip="Angle to set on your physical monitor stands"
      />
      <Card v={`${data.hFOVdeg.toFixed(1)}°`} l="Horizontal FOV" />
      <Card v={`${data.vFOVdeg.toFixed(1)}°`} l="Vertical FOV" />
      <Card v={`${data.cm.totalWidth.toFixed(1)} cm`} l="Total width" />
    </div>
  )
}
