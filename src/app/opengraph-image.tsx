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
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, color: 'white', textAlign: 'center' }}>
          FiberTools
        </div>
        <div style={{ fontSize: 32, color: '#94a3b8', marginTop: 24, textAlign: 'center' }}>
          Free Calculators for Knitters & Crocheters
        </div>
      </div>
    ),
    { ...size }
  )
}
