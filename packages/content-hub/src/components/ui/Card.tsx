import type { ComponentType, ComponentChildren } from 'preact'

interface CardProps {
  /** Primary value to display (e.g., calculated result) */
  v: ComponentChildren
  /** Label describing the value */
  l: ComponentChildren
  /** Optional tooltip text shown on hover */
  tooltip?: string
}

/**
 * Small, reusable information card.
 *
 * Mirrors the styling of the original React implementation
 * from `packages/screen-planner`, but rewritten for Preact/TypeScript.
 */
const Card: ComponentType<CardProps> = ({ v, l, tooltip }) => (
  <div class="bg-gray-100 rounded p-4 shadow flex flex-col items-center" title={tooltip}>
    <div class="text-lg font-semibold leading-none">{v}</div>
    <div class="text-xs text-gray-500 mt-1">{l}</div>
  </div>
)

export default Card
