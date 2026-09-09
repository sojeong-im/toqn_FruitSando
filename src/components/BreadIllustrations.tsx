import React from 'react';

// 1. 촉촉하고 도톰한 식빵 베이스 일러스트 (Bottom Slice)
export const BreadSliceBase: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-56 h-14 ${className}`}
    >
      <defs>
        {/* Crust Gradient */}
        <linearGradient id="crustGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D98A38" />
          <stop offset="100%" stopColor="#A85717" />
        </linearGradient>
        {/* Crumb (Inner Bread) Gradient */}
        <linearGradient id="crumbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9EE" />
          <stop offset="100%" stopColor="#F7E6C8" />
        </linearGradient>
      </defs>

      {/* Outer Golden Crust */}
      <rect
        x="2"
        y="4"
        width="236"
        height="48"
        rx="16"
        fill="url(#crustGrad)"
        stroke="#8B420C"
        strokeWidth="2.5"
      />

      {/* Inner Soft Fluffy Bread Crumb */}
      <rect
        x="8"
        y="9"
        width="224"
        height="38"
        rx="11"
        fill="url(#crumbGrad)"
        stroke="#E6BC8B"
        strokeWidth="1.5"
      />

      {/* Subtle Bread Pores & Texture Dots */}
      <circle cx="28" cy="24" r="1.5" fill="#E6C89C" opacity="0.6" />
      <circle cx="45" cy="32" r="1.2" fill="#E6C89C" opacity="0.5" />
      <circle cx="85" cy="20" r="1.5" fill="#E6C89C" opacity="0.6" />
      <circle cx="120" cy="28" r="1.8" fill="#E6C89C" opacity="0.5" />
      <circle cx="165" cy="22" r="1.3" fill="#E6C89C" opacity="0.6" />
      <circle cx="205" cy="30" r="1.5" fill="#E6C89C" opacity="0.5" />

      {/* Soft Top Butter Highlight */}
      <path
        d="M 20 12 Q 120 10 220 12"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
};

// 2. 구름처럼 몽실몽실 풍성한 생크림 일러스트
export const FluffyCreamLayer: React.FC<{ progress: number }> = ({ progress }) => {
  // Height expands dynamically with progress
  const creamHeight = Math.min(50, 24 + (progress / 100) * 26);

  return (
    <div
      className="w-52 transition-all duration-500 relative flex items-center justify-center -my-2 z-10"
      style={{ height: `${creamHeight}px` }}
    >
      <svg
        viewBox="0 0 220 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-sm"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="creamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F9F4E8" />
          </linearGradient>
        </defs>

        {/* Cloud-like billowing whipped cream contours */}
        <path
          d="M 6 36 
             C 4 20, 18 10, 32 18
             C 42 6, 65 6, 76 16
             C 88 4, 114 4, 126 15
             C 138 6, 162 6, 174 16
             C 186 8, 208 12, 214 26
             C 218 36, 212 40, 200 40
             L 20 40
             C 10 40, 6 38, 6 36 Z"
          fill="url(#creamGrad)"
          stroke="#EADECB"
          strokeWidth="1.5"
        />

        {/* Cream Swirl Highlight Waves */}
        <path
          d="M 26 22 Q 34 16 44 24"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 72 18 Q 82 12 94 20"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 122 17 Q 134 11 146 19"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 170 19 Q 180 14 192 22"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// 3. 갓 구운 봉긋한 윗면 식빵 뚜껑 일러스트 (Top Loaf Slice)
export const BreadSliceTop: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 240 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-56 h-16 ${className}`}
    >
      <defs>
        <linearGradient id="topCrustGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C97A28" />
          <stop offset="60%" stopColor="#E09240" />
          <stop offset="100%" stopColor="#A85717" />
        </linearGradient>
        <linearGradient id="topCrumbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9EE" />
          <stop offset="100%" stopColor="#F5E4C4" />
        </linearGradient>
      </defs>

      {/* Characteristic Bread Loaf Rounded Top Crown ("봉긋한 식빵 윗곡선") */}
      <path
        d="M 8 60
           C 6 35, 18 10, 58 10
           C 90 10, 105 18, 120 18
           C 135 18, 150 10, 182 10
           C 222 10, 234 35, 232 60
           L 8 60 Z"
        fill="url(#topCrustGrad)"
        stroke="#7A3907"
        strokeWidth="2.5"
      />

      {/* Inner Soft Crumb */}
      <path
        d="M 16 56
           C 14 38, 26 18, 60 18
           C 88 18, 105 24, 120 24
           C 135 24, 152 18, 180 18
           C 214 18, 226 38, 224 56
           L 16 56 Z"
        fill="url(#topCrumbGrad)"
        stroke="#E6BC8B"
        strokeWidth="1.5"
      />

      {/* Warm Golden Loaf Crown Highlights */}
      <path
        d="M 40 14 Q 60 12 80 15"
        stroke="#FFE8BD"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 160 15 Q 180 12 200 14"
        stroke="#FFE8BD"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

// 4. 귀여운 일러스트 과일들 (딸기, 샤인머스캣, 애플망고, 감귤)
export const IllustratedFruit: React.FC<{ type: 'strawberry' | 'shine' | 'mango' | 'orange' }> = ({
  type,
}) => {
  if (type === 'strawberry') {
    return (
      <svg viewBox="0 0 40 46" className="w-10 h-11 filter drop-shadow-md animate-popIn">
        {/* Strawberry Body */}
        <path
          d="M 20 44 C 10 38, 2 24, 4 14 C 6 4, 34 4, 36 14 C 38 24, 30 38, 20 44 Z"
          fill="#FF3355"
          stroke="#C41535"
          strokeWidth="1.5"
        />
        {/* Seeds */}
        <circle cx="14" cy="18" r="1.2" fill="#FFE57F" />
        <circle cx="26" cy="18" r="1.2" fill="#FFE57F" />
        <circle cx="20" cy="26" r="1.2" fill="#FFE57F" />
        <circle cx="14" cy="32" r="1" fill="#FFE57F" />
        <circle cx="26" cy="32" r="1" fill="#FFE57F" />
        {/* Juicy Core Highlight */}
        <path d="M 10 14 Q 14 10 20 12" stroke="#FF99AA" strokeWidth="2" strokeLinecap="round" />
        {/* Green Calyx Leaf */}
        <path d="M 20 4 C 18 8, 10 6, 8 7 C 14 9, 16 11, 20 8 C 24 11, 26 9, 32 7 C 30 6, 22 8, 20 4 Z" fill="#38A137" />
      </svg>
    );
  }

  if (type === 'shine') {
    return (
      <svg viewBox="0 0 38 38" className="w-9 h-9 filter drop-shadow-md animate-popIn">
        <circle cx="19" cy="19" r="16" fill="#8CE071" stroke="#5EAA45" strokeWidth="1.5" />
        <ellipse cx="14" cy="13" rx="5" ry="3" fill="#B7F2A2" />
        <circle cx="13" cy="12" r="1.5" fill="#FFFFFF" />
      </svg>
    );
  }

  if (type === 'mango') {
    return (
      <svg viewBox="0 0 40 40" className="w-9 h-9 filter drop-shadow-md animate-popIn">
        <rect x="5" y="5" width="30" height="30" rx="8" fill="#FFAA00" stroke="#D98200" strokeWidth="1.5" />
        <path d="M 10 10 Q 20 8 30 10" stroke="#FFD875" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Orange
  return (
    <svg viewBox="0 0 42 34" className="w-10 h-8 filter drop-shadow-md animate-popIn">
      <path d="M 4 28 C 4 10, 38 10, 38 28 Z" fill="#FF8800" stroke="#C75E00" strokeWidth="1.5" />
      <path d="M 8 26 C 10 16, 32 16, 34 26 Z" fill="#FFAF40" />
      <circle cx="21" cy="20" r="2" fill="#FFF2D6" />
    </svg>
  );
};
