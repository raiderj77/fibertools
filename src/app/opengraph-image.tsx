import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'FiberTools — Free Calculators for Knitters & Crocheters'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FAF6F1',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {/* Left: yarn ball */}
        <div
          style={{
            width: 480,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', width: 300, height: 300 }}>
            {/* Plum base */}
            <div
              style={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: '#7C5A6D',
              }}
            />
            {/* Arc wrap 1 — upper-right sweep */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                width: 260,
                height: 260,
                borderRadius: '50%',
                borderWidth: 15,
                borderStyle: 'solid',
                borderTopColor: 'rgba(250,246,241,0.55)',
                borderRightColor: 'rgba(250,246,241,0.55)',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
                transform: 'rotate(-25deg)',
              }}
            />
            {/* Arc wrap 2 — lower-left sweep */}
            <div
              style={{
                position: 'absolute',
                top: 40,
                left: 40,
                width: 220,
                height: 220,
                borderRadius: '50%',
                borderWidth: 15,
                borderStyle: 'solid',
                borderTopColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: 'rgba(250,246,241,0.45)',
                borderLeftColor: 'rgba(250,246,241,0.45)',
                transform: 'rotate(35deg)',
              }}
            />
            {/* Arc wrap 3 — diagonal */}
            <div
              style={{
                position: 'absolute',
                top: 60,
                left: 60,
                width: 180,
                height: 180,
                borderRadius: '50%',
                borderWidth: 12,
                borderStyle: 'solid',
                borderTopColor: 'rgba(250,246,241,0.4)',
                borderRightColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: 'rgba(250,246,241,0.4)',
                transform: 'rotate(-55deg)',
              }}
            />
            {/* White core */}
            <div
              style={{
                position: 'absolute',
                top: 100,
                left: 100,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: '#FAF6F1',
              }}
            />
            {/* Inner core arc */}
            <div
              style={{
                position: 'absolute',
                top: 110,
                left: 110,
                width: 80,
                height: 80,
                borderRadius: '50%',
                borderWidth: 8,
                borderStyle: 'solid',
                borderTopColor: '#7C5A6D',
                borderRightColor: '#7C5A6D',
                borderBottomColor: 'transparent',
                borderLeftColor: 'transparent',
                transform: 'rotate(15deg)',
              }}
            />
            {/* Sage accent circle */}
            <div
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                width: 58,
                height: 58,
                borderRadius: '50%',
                background: '#8FAE8B',
              }}
            />
            {/* Small sage dot — lower left */}
            <div
              style={{
                position: 'absolute',
                bottom: 22,
                left: 22,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#8FAE8B',
              }}
            />
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: 2,
            height: 380,
            background: '#EDE0D0',
          }}
        />

        {/* Right: text */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 72px',
          }}
        >
          <div
            style={{
              fontSize: 90,
              fontWeight: 700,
              color: '#2D2A2E',
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            FiberTools
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#6B5A45',
              lineHeight: 1.5,
              marginBottom: 44,
            }}
          >
            Free tools for knitters,
            crocheters &amp; fiber artists
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#7C5A6D',
              fontWeight: 600,
            }}
          >
            fibertools.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
