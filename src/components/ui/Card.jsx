import React from 'react'

export default function Card({ v, l, tooltip }) {
  return (
    <div className="bg-gray-100 rounded p-4 shadow flex flex-col items-center" title={tooltip}>
      <div className="text-xl font-semibold leading-none">{v}</div>
      <div className="text-sm text-gray-600 mt-1">{l}</div>
    </div>
  )
}
