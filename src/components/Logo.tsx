import React from 'react';

export function Logo({
  className = 'w-8 h-8',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="logo-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="logo-secondary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Base stylized "P" shape with speech bubble tail */}
      <path
        d="M25 15 C25 12.2386 27.2386 10 30 10 H65 C81.5685 10 95 23.4315 95 40 C95 56.5685 81.5685 70 65 70 H50 V85 C50 87.7614 47.7614 90 45 90 H30 C27.2386 90 25 87.7614 25 85 V15 Z"
        fill="url(#logo-primary)"
      />

      {/* Inner glass overlay for depth */}
      <path
        d="M45 10 H65 C81.5685 10 95 23.4315 95 40 C95 52.887 86.8643 63.8727 75.6027 68.1098 C65.5165 47.882 45 42 25 40 V15 C25 12.2386 27.2386 10 30 10 H45 Z"
        fill="url(#logo-secondary)"
      />

      {/* Main AI Spark */}
      <path
        d="M65 25 L68.5 34.5 L78 38 L68.5 41.5 L65 51 L61.5 41.5 L52 38 L61.5 34.5 Z"
        fill="var(--primary-foreground)"
      />

      {/* Secondary AI Spark */}
      <path
        d="M42 45 L44 50 L49 52 L44 54 L42 59 L40 54 L35 52 L40 50 Z"
        fill="var(--primary-foreground)"
        opacity="0.9"
      />
    </svg>
  );
}
