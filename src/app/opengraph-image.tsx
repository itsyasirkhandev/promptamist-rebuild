import { ImageResponse } from 'next/og';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(to bottom right, #2a110b, #0f0f0f)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '300px', height: '300px' }}
      >
        <path
          d="M25 15 C25 12.2386 27.2386 10 30 10 H65 C81.5685 10 95 23.4315 95 40 C95 56.5685 81.5685 70 65 70 H50 V85 C50 87.7614 47.7614 90 45 90 H30 C27.2386 90 25 87.7614 25 85 V15 Z"
          fill="#e1401a"
        />
        <path
          d="M45 10 H65 C81.5685 10 95 23.4315 95 40 C95 52.887 86.8643 63.8727 75.6027 68.1098 C65.5165 47.882 45 42 25 40 V15 C25 12.2386 27.2386 10 30 10 H45 Z"
          fill="rgba(255,255,255,0.15)"
        />
        <path
          d="M65 25 L68.5 34.5 L78 38 L68.5 41.5 L65 51 L61.5 41.5 L52 38 L61.5 34.5 Z"
          fill="#ffffff"
        />
        <path
          d="M42 45 L44 50 L49 52 L44 54 L42 59 L40 54 L35 52 L40 50 Z"
          fill="rgba(255,255,255,0.9)"
        />
      </svg>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
