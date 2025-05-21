import type { ComponentType } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import {
  createCalculationState,
  createLayout,
  createVisualization,
  createScreenConfigState,
} from '@simrigbuild/screen-planner-core'

type ConfigState = ReturnType<typeof createScreenConfigState>

interface ScreenVisualizerProps {
  config: ConfigState
}

const ScreenVisualizer: ComponentType<ScreenVisualizerProps> = ({ config }) => {
  const calculations = createCalculationState(config)
  const containerRef = useRef<HTMLDivElement>(null)

  const renderSvg = () => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const layout = createLayout(config, calculations.results.value)
    const vis = createVisualization(layout, {
      width: rect.width,
      height: rect.height,
    })

    const basePts = vis.rigBase.corners.map(p => `${p.x},${p.y}`).join(' ')
    const screenPolys = vis.screens
      .map(
        s =>
          `<polygon points="${s.corners.map(c => `${c.x},${c.y}`).join(' ')}" stroke="blue" fill="none" stroke-width="2" />`
      )
      .join('')

    const svg = `\n      <svg width="100%" height="100%" viewBox="${vis.svgProps.viewBox}">\n        <polygon points="${basePts}" fill="#eee" stroke="black" stroke-width="1" />\n        ${screenPolys}\n        <circle cx="${vis.viewPoint.position.x}" cy="${vis.viewPoint.position.y}" r="${vis.viewPoint.radius}" fill="red" />\n      </svg>\n    `
    containerRef.current.innerHTML = svg
  }

  useEffect(() => {
    const observer = new ResizeObserver(renderSvg)
    if (containerRef.current) observer.observe(containerRef.current)
    renderSvg()
    return () => observer.disconnect()
  }, [calculations.results.value])

  return (
    <section class="bg-white rounded-lg shadow-sm border p-4">
      <div ref={containerRef} class="w-full h-64" />
    </section>
  )
}

export default ScreenVisualizer
