import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fill="black">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.5231 29.5231C22.544 29.5231 29.0462 23.0209 29.0462 15C29.0462 6.97913 22.544 0.476929 14.5231 0.476929C6.5022 0.476929 0 6.97913 0 15C0 23.0209 6.5022 29.5231 14.5231 29.5231ZM14.5231 23.6154C19.2812 23.6154 23.1385 19.7582 23.1385 15C23.1385 10.2419 19.2812 6.38462 14.5231 6.38462C9.76493 6.38462 5.90769 10.2419 5.90769 15C5.90769 19.7582 9.76493 23.6154 14.5231 23.6154Z" />
            <path d="M32 26.5692C32 28.2006 30.6775 29.5231 29.0462 29.5231C27.4148 29.5231 26.0923 28.2006 26.0923 26.5692C26.0923 24.9379 27.4148 23.6154 29.0462 23.6154C30.6775 23.6154 32 24.9379 32 26.5692Z" />
          </g>
        </svg>

      </div>
    ),
    {
      ...size,
    }
  )
}
