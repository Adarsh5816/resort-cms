import React from 'react';

interface LexurLogoProps {
  className?: string;
  variant?: 'white' | 'dark' | 'full';
  showSubtitle?: boolean;
}

export const LexurLogo: React.FC<LexurLogoProps> = ({
  className = 'h-12',
  variant = 'full',
  showSubtitle = true
}) => {
  const textColor = variant === 'dark' ? 'text-emerald-950' : 'text-white';
  const subColor = variant === 'dark' ? 'text-emerald-800' : 'text-emerald-200';
  const logoFill = variant === 'dark' ? '#0A2E1C' : '#FFFFFF';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Deer & Leaf Emblem matching business card */}
      <svg className="h-full w-auto aspect-square shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Circular Leaf Crescent */}
        <path
          d="M 50 10 C 25 10 10 28 10 50 C 10 72 25 90 50 90 C 72 90 88 74 90 52 C 86 68 70 80 50 80 C 32 80 20 66 20 50 C 20 34 32 20 50 20 C 60 20 68 24 74 30 C 66 22 58 18 48 18 C 30 18 18 32 18 50 C 18 68 30 82 48 82 C 66 82 80 68 80 50 C 80 40 76 32 70 26 Z"
          fill={logoFill}
          opacity="0.9"
        />
        {/* Deer Head with Antlers */}
        <path
          d="M 45 42 C 40 32 32 22 28 16 C 34 24 38 32 40 40 C 34 30 26 24 20 20 C 28 28 34 36 36 44 C 42 46 48 48 52 54 C 54 57 56 62 55 66 C 53 72 47 76 40 76 C 34 76 30 72 28 66 C 30 70 34 72 38 72 C 43 72 47 69 48 64 C 49 60 48 56 46 52 C 44 48 40 44 45 42 Z"
          fill={logoFill}
        />
        {/* 3 Forest Tea / Plant Leaves */}
        <path
          d="M 58 40 C 66 32 76 30 84 32 C 78 40 70 44 60 42 Z"
          fill={logoFill}
        />
        <path
          d="M 64 50 C 74 44 84 44 90 48 C 82 54 74 56 66 52 Z"
          fill={logoFill}
        />
        <path
          d="M 60 60 C 70 58 78 60 84 66 C 76 68 68 66 62 62 Z"
          fill={logoFill}
        />
      </svg>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-wider text-lg md:text-xl font-sans leading-none uppercase ${textColor}`}>
          LEXUR GREEN
        </span>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className={`h-[1px] w-3 ${variant === 'dark' ? 'bg-emerald-800' : 'bg-emerald-300'}`} />
            <span className={`text-[10px] md:text-[11px] font-semibold tracking-widest uppercase font-sans ${subColor}`}>
              SERVICED VILLA
            </span>
            <div className={`h-[1px] w-3 ${variant === 'dark' ? 'bg-emerald-800' : 'bg-emerald-300'}`} />
          </div>
        )}
      </div>
    </div>
  );
};
