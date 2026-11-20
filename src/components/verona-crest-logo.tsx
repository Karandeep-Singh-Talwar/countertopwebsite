import React from 'react';

interface VeronaCrestLogoProps {
  className?: string;
  size?: number;
  textColor?: string;
  crestColor?: string;
  showSubtitle?: boolean;
}

/**
 * Verona Surfaces Heritage Architectural Crest & Wordmark
 * Inspired by classic Italian stone ateliers & heritage European houses.
 */
export function VeronaCrestLogo({
  className = '',
  size = 42,
  textColor = 'currentColor',
  crestColor = 'currentColor',
  showSubtitle = true,
}: VeronaCrestLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* 1. Heritage Architectural Crest Emblem */}
      <svg
        width={size}
        height={Math.round(size * 0.92)}
        viewBox="0 0 100 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
        style={{ color: crestColor }}
        aria-hidden="true"
      >
        {/* Crown / Architectural Keystone Pediment */}
        <path
          d="M50 4L54 11H46L50 4Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M38 12C41 8 46 6 50 6C54 6 59 8 62 12"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="10" r="1.5" fill="currentColor" />
        <circle cx="42" cy="12" r="1" fill="currentColor" opacity="0.7" />
        <circle cx="58" cy="12" r="1" fill="currentColor" opacity="0.7" />

        {/* Heraldic Shield Outline */}
        <path
          d="M32 18H68C68 18 70 42 50 62C30 42 32 18 32 18Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Inner Shield Hairline */}
        <path
          d="M35 21H65C65 21 66.5 40 50 57C33.5 40 35 21 35 21Z"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 1.5"
          opacity="0.6"
        />

        {/* Shield Interior: Classical Tuscan Keystone Arch & Chevron */}
        <path
          d="M44 50V33C44 29.6863 46.6863 27 50 27C53.3137 27 56 29.6863 56 33V50"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M41 42L50 33L59 42"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <circle cx="50" cy="22" r="1.5" fill="currentColor" />

        {/* Flanking Laurel Sprigs: Classical Italian Craftsmanship */}
        {/* Left Laurel Sprig */}
        <path
          d="M27 22C24 26 23 32 24 38C25 44 28 50 32 55"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M24 25C21 24 19 26 21 29C23 29 25 28 24 25Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M22 33C19 33 18 36 20 38C22 38 23 36 22 33Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M23 42C21 43 21 46 24 47C25 46 25 44 23 42Z"
          fill="currentColor"
          opacity="0.8"
        />

        {/* Right Laurel Sprig */}
        <path
          d="M73 22C76 26 77 32 76 38C75 44 72 50 68 55"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M76 25C79 24 81 26 79 29C77 29 75 28 76 25Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M78 33C81 33 82 36 80 38C78 38 77 36 78 33Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path
          d="M77 42C79 43 79 46 76 47C75 46 75 44 77 42Z"
          fill="currentColor"
          opacity="0.8"
        />

        {/* Ribbon / Scroll Base */}
        <path
          d="M26 66C38 63 62 63 74 66C70 70 65 71 50 71C35 71 30 70 26 66Z"
          stroke="currentColor"
          strokeWidth="1.1"
          fill="currentColor"
          fillOpacity="0.08"
        />
        {/* Star of Excellence */}
        <circle cx="50" cy="78" r="1.2" fill="currentColor" />
        <circle cx="45" cy="78" r="0.8" fill="currentColor" opacity="0.6" />
        <circle cx="55" cy="78" r="0.8" fill="currentColor" opacity="0.6" />
      </svg>

      {/* 2. Wordmark */}
      <div className="mt-1 flex flex-col items-center">
        <span
          className="font-serif text-lg sm:text-xl tracking-tight leading-none text-current"
          style={{ color: textColor }}
        >
          Verona <span className="italic font-light opacity-90">Surfaces</span>
        </span>
        {showSubtitle && (
          <span className="text-[8.5px] uppercase font-sans tracking-[0.3em] opacity-60 mt-1 font-medium">
            Atelier di Porcellana
          </span>
        )}
      </div>
    </div>
  );
}
