import React from 'react'

export default function CurvedScreens({ arcs, color = '#000', debug = false }) {
  if (!arcs || arcs.length === 0) return null

  return (
    <>
      {arcs.map((arc, i) => {
        // Determine path based on arc type
        let pathData = ''
        let startX, startY, endX, endY

        if (arc.type === 'bezier') {
          // Use pre-calculated Bézier curve points
          startX = arc.startX
          startY = arc.startY
          endX = arc.endX
          endY = arc.endY
          pathData = `M ${startX} ${startY} Q ${arc.controlX} ${arc.controlY} ${endX} ${endY}`
        } else {
          // For standard arcs, calculate points from center and angles
          startX = arc.startX || arc.centerX + arc.radius * Math.cos(arc.startAngle)
          startY = arc.startY || arc.centerY + arc.radius * Math.sin(arc.startAngle)
          endX = arc.endX || arc.centerX + arc.radius * Math.cos(arc.endAngle)
          endY = arc.endY || arc.centerY + arc.radius * Math.sin(arc.endAngle)

          const largeArcFlag = Math.abs(arc.endAngle - arc.startAngle) > Math.PI ? 1 : 0
          const sweepFlag = arc.endAngle > arc.startAngle ? 1 : 0

          pathData = `M ${startX} ${startY} A ${arc.radius} ${arc.radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`
        }

        // Screen thickness (to represent monitor body)
        const thickness = 5

        return (
          <g key={`screen-${i}`}>
            {/* Monitor body - darker background */}
            <path
              d={`${pathData} 
                 L ${endX} ${endY + thickness} 
                 L ${startX} ${startY + thickness} 
                 Z`}
              fill="rgba(60, 60, 70, 0.3)"
              stroke="none"
            />

            {/* Screen front face with flat ends */}
            <path
              d={pathData}
              stroke={color}
              strokeWidth={3}
              strokeLinecap="butt" // Flat end caps like real monitors
              fill="rgba(230, 240, 250, 0.2)"
            />

            {/* Screen side edges */}
            <line
              x1={startX}
              y1={startY}
              x2={startX}
              y2={startY + thickness}
              stroke={color}
              strokeWidth={1.5}
            />
            <line
              x1={endX}
              y1={endY}
              x2={endX}
              y2={endY + thickness}
              stroke={color}
              strokeWidth={1.5}
            />

            {/* Debug visualization if enabled */}
            {debug && (
              <>
                {arc.type === 'bezier' ? (
                  <>
                    {/* Control point */}
                    <circle cx={arc.controlX} cy={arc.controlY} r={3} fill="red" />
                    <line
                      x1={startX}
                      y1={startY}
                      x2={arc.controlX}
                      y2={arc.controlY}
                      stroke="rgba(255,0,0,0.5)"
                      strokeWidth={1}
                      strokeDasharray="3,2"
                    />
                    <line
                      x1={arc.controlX}
                      y1={arc.controlY}
                      x2={endX}
                      y2={endY}
                      stroke="rgba(255,0,0,0.5)"
                      strokeWidth={1}
                      strokeDasharray="3,2"
                    />

                    {/* Add actual curve midpoint (true deepest point) */}
                    <circle
                      cx={(startX + endX) / 2}
                      cy={arc.actualDeepestY || arc.controlY}
                      r={3}
                      fill="yellow"
                      stroke="black"
                      strokeWidth={0.5}
                    />
                    <text
                      x={(startX + endX) / 2}
                      y={arc.actualDeepestY || arc.controlY - 10}
                      fontSize="8px"
                      textAnchor="middle"
                      fill="black"
                    >
                      Actual Deepest Point
                    </text>
                  </>
                ) : (
                  <>
                    <circle cx={arc.centerX} cy={arc.centerY} r={3} fill="red" />
                    <line
                      x1={arc.centerX}
                      y1={arc.centerY}
                      x2={startX}
                      y2={startY}
                      stroke="rgba(0,0,255,0.5)"
                      strokeWidth={1}
                      strokeDasharray="3,2"
                    />
                    <line
                      x1={arc.centerX}
                      y1={arc.centerY}
                      x2={endX}
                      y2={endY}
                      stroke="rgba(0,255,0,0.5)"
                      strokeWidth={1}
                      strokeDasharray="3,2"
                    />
                  </>
                )}

                <circle cx={startX} cy={startY} r={2} fill="blue" />
                <circle cx={endX} cy={endY} r={2} fill="green" />
                <text
                  x={(startX + endX) / 2}
                  y={(startY + endY) / 2 - 10}
                  fontSize="8px"
                  textAnchor="middle"
                >
                  {`Screen ${i + 1}`}
                </text>
              </>
            )}
          </g>
        )
      })}
    </>
  )
}
