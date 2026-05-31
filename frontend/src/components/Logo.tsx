import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl" | number;
}

export const Logo: React.FC<LogoProps> = ({ size = "md", className = "", ...props }) => {
  // Map size keys to dimensions, or allow a direct number
  const dimension = typeof size === "number" 
    ? size 
    : size === "sm" 
      ? 28 
      : size === "md" 
        ? 40 
        : size === "lg" 
          ? 48 
          : 64;

  return (
    <svg
      viewBox="0 0 100 100"
      width={dimension}
      height={dimension}
      className={`inline-block ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* 1. Styled head circle (Green) */}
      <circle cx="43" cy="38" r="5.8" fill="#8CC63F" />

      {/* 2. Left dynamic body segment with hand and leg (Green) */}
      <path
        d="M48.2 48.2 C38.5 40.5 31.2 29.5 29.3 22 C29.3 22 27.5 25.5 30.5 34 C33.5 42.5 37.8 51.5 38.6 60.5 C39.4 69.5 34.5 88 34.5 88 C34.8 88 40.5 81 42.3 73.2 C44.1 65.4 45.1 55.4 48.2 48.2 Z"
        fill="#8CC63F"
      />

      {/* 3. Right dynamic body segment (Green) */}
      <path
        d="M49 48.5 C51.5 43.8 53.8 38.2 54.3 32.5 C54.3 32.5 54.8 35.5 52.8 44 C50.8 52.5 49.3 59.5 47.8 66 C46.3 72.5 44 80 44 80 C44 80 46.2 77 47.8 70.5 C49.4 64 50 56 49 48.5 Z"
        fill="#8CC63F"
      />

      {/* 4. Elegant, wrapping 3D orbit swoosh (Blue) */}
      <path
        d="M26.5 30.2 C26.5 30.2 20.8 36.5 22.8 47.5 C24.8 58.5 34 72 49 81 C64 90 67.5 85.5 67.5 85.5 C67.5 85.5 61.2 87.5 52.8 84.5 C44.4 81.5 29.2 71.5 25.4 59.2 C21.6 46.9 26.5 30.2 26.5 30.2 Z"
        fill="#0d5cb5"
      />
    </svg>
  );
};
