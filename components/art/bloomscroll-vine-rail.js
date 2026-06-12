const VINE_FLOWER_POSITIONS = [
  { x: 42, y: 55, stage: "bud", rotate: -18, species: 0 },
  { x: 80, y: 110, stage: "half", rotate: 8, species: 3 },
  { x: 30, y: 170, stage: "full", rotate: -12, species: 1 },
  { x: 88, y: 235, stage: "bud", rotate: 20, species: 4 },
  { x: 20, y: 285, stage: "half", rotate: -8, species: 2 },
  { x: 72, y: 345, stage: "full", rotate: 14, species: 5 },
  { x: 38, y: 400, stage: "bud", rotate: -22, species: 0 },
  { x: 90, y: 455, stage: "half", rotate: 10, species: 3 },
  { x: 22, y: 510, stage: "full", rotate: -9, species: 1 },
  { x: 68, y: 565, stage: "bud", rotate: 18, species: 4 },
  { x: 30, y: 620, stage: "half", rotate: -14, species: 2 },
  { x: 84, y: 678, stage: "full", rotate: 8, species: 5 },
  { x: 18, y: 730, stage: "bud", rotate: -20, species: 0 },
  { x: 75, y: 790, stage: "half", rotate: 12, species: 3 },
  { x: 40, y: 845, stage: "full", rotate: -7, species: 1 },
  { x: 86, y: 900, stage: "bud", rotate: 16, species: 4 },
  { x: 24, y: 955, stage: "half", rotate: -11, species: 2 },
]

const VINE_LEAF_POSITIONS = [
  { x: 36, y: 82, rotate: -30, scale: 1 },
  { x: 82, y: 140, rotate: 38, scale: 0.9 },
  { x: 16, y: 210, rotate: -42, scale: 1.1 },
  { x: 78, y: 265, rotate: 28, scale: 0.85 },
  { x: 24, y: 320, rotate: -32, scale: 1.05 },
  { x: 90, y: 390, rotate: 44, scale: 0.95 },
  { x: 14, y: 470, rotate: -38, scale: 1.1 },
  { x: 84, y: 530, rotate: 26, scale: 1 },
  { x: 22, y: 600, rotate: -44, scale: 0.88 },
  { x: 76, y: 655, rotate: 36, scale: 1.05 },
  { x: 16, y: 710, rotate: -28, scale: 0.92 },
  { x: 88, y: 768, rotate: 40, scale: 1 },
  { x: 26, y: 820, rotate: -35, scale: 1.12 },
  { x: 80, y: 880, rotate: 30, scale: 0.9 },
  { x: 18, y: 940, rotate: -40, scale: 1 },
  { x: 74, y: 985, rotate: 34, scale: 0.95 },
]

const VINE_SPECIES = [
  { p1: "#fce7f3", p2: "#f9a8d4", p3: "#ec4899", center: "#831843", petals: 8 },
  { p1: "#ede9fe", p2: "#a78bfa", p3: "#7c3aed", center: "#2e1065", petals: 5 },
  { p1: "#f5f3ff", p2: "#c4b5fd", p3: "#8b5cf6", center: "#4c1d95", petals: 6 },
  { p1: "#fef9c3", p2: "#fde047", p3: "#ca8a04", center: "#713f12", petals: 8 },
  { p1: "#dbeafe", p2: "#60a5fa", p3: "#2563eb", center: "#1e3a8a", petals: 5 },
  { p1: "#fdf4ff", p2: "#e879f9", p3: "#a21caf", center: "#4a044e", petals: 7 },
]

const VINE_VINE_COLOR = "#276749"
const VINE_VINE_COLOR_DARK = "#14532d"
const VINE_LEAF_COLOR = "#4ade80"
const VINE_LEAF_COLOR_DARK = "#166534"

const BloomscrollVineRail = ({ side = "left", segmentCount = 18, panelOpacity = 0.5, opacity = 0.65 }) => {
  const isRight = side === "right"

  return (
    <div className={`bloomscroll-vine-layer ${isRight ? "right" : "left"}`} aria-hidden="true" style={{ "--vine-panel-opacity": panelOpacity, opacity }}>
      <div className="bloomscroll-vine-panel" />
      <div className="bloomscroll-vine-track">
        {Array.from({ length: segmentCount }).map((_, segmentIndex) => {
          const glowId = `bsglow-${side}-${segmentIndex}`
          const vgradId = `bsvg-${side}-${segmentIndex}`
          const specGrads = VINE_SPECIES.map((_, si) => ({
            pg: `bspg-${side}-${segmentIndex}-${si}`,
            cg: `bscg-${side}-${segmentIndex}-${si}`,
          }))

          return (
            <div key={`vine-segment-${side}-${segmentIndex}`} className="bloomscroll-vine-segment" style={{ "--segment-index": segmentIndex }}>
              <svg className="bloomscroll-vine-svg" viewBox="0 0 120 1000" preserveAspectRatio="xMidYMid none" overflow="visible">
                <defs>
                  <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="3.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id={vgradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={VINE_VINE_COLOR} stopOpacity="0.92" />
                    <stop offset="55%" stopColor={VINE_VINE_COLOR_DARK} stopOpacity="0.78" />
                    <stop offset="100%" stopColor={VINE_VINE_COLOR} stopOpacity="0.55" />
                  </linearGradient>
                  {VINE_SPECIES.map((sp, si) => [
                    <radialGradient key={`pg-${side}-${segmentIndex}-${si}`} id={specGrads[si].pg} cx="36%" cy="24%" r="74%">
                      <stop offset="0%" stopColor={sp.p1} />
                      <stop offset="45%" stopColor={sp.p2} />
                      <stop offset="100%" stopColor={sp.p3} />
                    </radialGradient>,
                    <radialGradient key={`cg-${side}-${segmentIndex}-${si}`} id={specGrads[si].cg} cx="50%" cy="40%" r="60%">
                      <stop offset="0%" stopColor={sp.p2} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={sp.center} />
                    </radialGradient>,
                  ])}
                </defs>

                <path
                  d="M62 0 C 18 82, 98 170, 44 260 C 8 316, 94 406, 48 500 C 16 570, 90 658, 46 742 C 10 808, 96 900, 62 1000"
                  stroke={`url(#${vgradId})`}
                  strokeWidth="4.5"
                  fill="none"
                  strokeLinecap="round"
                />

                <path d="M44 260 C 28 244, 8 248, 2 238" stroke={VINE_VINE_COLOR} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75" />
                <path d="M48 500 C 68 488, 96 478, 104 464" stroke={VINE_VINE_COLOR_DARK} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
                <path d="M46 742 C 22 728, 4 720, -4 706" stroke={VINE_VINE_COLOR} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.68" />
                <path d="M94 406 C 108 396, 118 380, 116 368" stroke={VINE_VINE_COLOR_DARK} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65" />
                <path d="M90 658 C 106 648, 114 632, 112 618" stroke={VINE_VINE_COLOR} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6" />
                <path d="M96 900 C 80 890, 62 898, 54 888" stroke={VINE_VINE_COLOR_DARK} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.62" />

                {VINE_LEAF_POSITIONS.map((leaf, li) => {
                  const s = leaf.scale || 1
                  const leafCol = li % 3 === 0 ? VINE_LEAF_COLOR_DARK : VINE_LEAF_COLOR
                  return (
                    <g key={`leaf-${li}`} transform={`translate(${leaf.x},${leaf.y}) rotate(${leaf.rotate})`}>
                      <ellipse cx="0" cy={-10 * s} rx={4 * s} ry={13 * s} fill={leafCol} opacity="0.78" />
                      <line x1="0" y1="0" x2="0" y2={-18 * s} stroke={VINE_VINE_COLOR_DARK} strokeWidth="0.8" opacity="0.55" />
                    </g>
                  )
                })}

                {VINE_FLOWER_POSITIONS.map((flower, fi) => {
                  const sp = VINE_SPECIES[flower.species % VINE_SPECIES.length]
                  const pg = specGrads[flower.species % VINE_SPECIES.length].pg
                  const cg = specGrads[flower.species % VINE_SPECIES.length].cg
                  const t = `translate(${flower.x},${flower.y}) rotate(${flower.rotate})`
                  const pCount = sp.petals || 6
                  const pAngles = Array.from({ length: pCount }, (_, i) => (360 / pCount) * i)

                  if (flower.stage === "bud") {
                    return (
                      <g key={`f-${fi}`} transform={t}>
                        <path d="M0,7 L-3,14 L0,10 L3,14 Z" fill={VINE_LEAF_COLOR} opacity="0.82" />
                        <ellipse cx="0" cy="-5" rx="5.5" ry="11" fill={`url(#${pg})`} />
                        <ellipse cx="0" cy="-9" rx="3" ry="5.5" fill={sp.p1} opacity="0.45" />
                      </g>
                    )
                  }

                  if (flower.stage === "half") {
                    return (
                      <g key={`f-${fi}`} transform={t}>
                        {pAngles.map((angle, pi) => (
                          <ellipse key={pi} cx="0" cy="-11" rx="5" ry="10" fill={`url(#${pg})`} opacity="0.85" transform={`rotate(${angle})`} />
                        ))}
                        <circle r="6" fill={`url(#${cg})`} />
                        <circle r="2.5" fill={sp.p1} opacity="0.6" />
                      </g>
                    )
                  }

                  return (
                    <g key={`f-${fi}`} transform={t} filter={`url(#${glowId})`}>
                      {pAngles.map((angle, pi) => (
                        <ellipse key={pi} cx="0" cy="-16" rx="6.5" ry="14" fill={`url(#${pg})`} opacity="0.88" transform={`rotate(${angle})`} />
                      ))}
                      <circle r="8" fill={`url(#${cg})`} />
                      <circle r="4" fill={sp.p2} opacity="0.6" />
                      <circle r="2" fill={sp.p1} opacity="0.85" />
                    </g>
                  )
                })}
              </svg>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .bloomscroll-vine-layer {
          position: relative;
          min-height: 100%;
          width: var(--vine-rail-width);
          pointer-events: none;
          z-index: 0;
        }

        .bloomscroll-vine-panel {
          position: absolute;
          inset: 0;
          background: color-mix(in srgb, var(--color-base-200) calc(var(--vine-panel-opacity) * 100%), transparent);
          box-shadow:
            inset -1px 0 0 rgba(255, 255, 255, 0.16),
            0 14px 28px rgba(10, 18, 12, 0.12);
          backdrop-filter: blur(2px);
        }

        .bloomscroll-vine-layer.left .bloomscroll-vine-panel {
          border-right: 1px solid color-mix(in srgb, var(--color-base-content) 20%, transparent);
          border-radius: 0 1.2rem 1.2rem 0;
        }

        .bloomscroll-vine-layer.right .bloomscroll-vine-panel {
          border-left: 1px solid color-mix(in srgb, var(--color-base-content) 20%, transparent);
          border-radius: 1.2rem 0 0 1.2rem;
        }

        .bloomscroll-vine-panel::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 10px;
        }

        .bloomscroll-vine-layer.left .bloomscroll-vine-panel::after {
          right: -10px;
          background: linear-gradient(to right, color-mix(in srgb, var(--color-base-content) 8%, transparent) 0%, transparent 100%);
        }

        .bloomscroll-vine-layer.right .bloomscroll-vine-panel::after {
          left: -10px;
          background: linear-gradient(to left, color-mix(in srgb, var(--color-base-content) 8%, transparent) 0%, transparent 100%);
        }

        .bloomscroll-vine-track {
          position: absolute;
          top: 0;
          bottom: 0;
          --segment-height: min(100vh, 56rem);
          z-index: 1;
        }

        .bloomscroll-vine-layer.left .bloomscroll-vine-track {
          left: 0;
          right: 10px;
        }

        .bloomscroll-vine-layer.right .bloomscroll-vine-track {
          left: 10px;
          right: 0;
        }

        .bloomscroll-vine-segment {
          position: absolute;
          left: 0;
          width: 100%;
          height: var(--segment-height);
          top: calc(var(--segment-index) * var(--segment-height));
        }

        .bloomscroll-vine-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        @media (max-width: 768px) {
          .bloomscroll-vine-track {
            --segment-height: 100svh;
          }
        }
      `}</style>
    </div>
  )
}

export default BloomscrollVineRail
