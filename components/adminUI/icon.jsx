import { useState, useId } from 'react';

export function Logo({ className = '', size = 32, initials = 'H', bgColor = '#F3F4F6', textColor = '#374151', label = 'Hysteria logo' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={label}
    >
      <rect x="6" y="6" width="36" height="36" rx="8" fill={bgColor} />
      <text x="24" y="30" textAnchor="middle" fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto" fontSize={18} fontWeight={700} fill={textColor}>{initials}</text>
    </svg>
  );
}

export function IconDashboard({ className = '', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8V3h-8zM3 21h8v-6H3v6z" fill="#6B7280" />
    </svg>
  );
}

export function IconUsers({ className = '', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M17 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSettings({ className = '', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 014.28 17.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.2 6.6A2 2 0 016.99 3.77l.06.06a1.65 1.65 0 001.82.33h.09A1.65 1.65 0 0010 3.9V3a2 2 0 014 0v.09c.2.07.39.18.56.31.7.49 1.57.4 2.16-.19l.06-.06A2 2 0 0119.4 6.6l-.06.06c-.49.7-.4 1.57.19 2.16.13.17.24.36.31.56H21a2 2 0 010 4h-.09c-.16.58-.72 1-1.31 1z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlatform({ className = '', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="1" stroke="#6B7280" strokeWidth="1.2" fill="none" />
      <rect x="13" y="3" width="8" height="8" rx="1" stroke="#6B7280" strokeWidth="1.2" fill="none" />
      <rect x="3" y="13" width="8" height="8" rx="1" stroke="#6B7280" strokeWidth="1.2" fill="none" />
      <rect x="13" y="13" width="8" height="8" rx="1" stroke="#6B7280" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function IconEvent({ className = '', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="#6B7280" strokeWidth="1.5" fill="none" />
      <path d="M16 3v4M8 3v4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 11h10M7 15h10" stroke="#6B7280" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPost({ className = '', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <path d="M8 6h8v2H8zM8 10h8v2H8zM8 14h5v2H8z" fill="#6B7280" />
      <rect x="3" y="4" width="14" height="16" rx="2" stroke="#6B7280" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

export function IconSocial({ className = '', size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <circle cx="6" cy="12" r="2" stroke="#6B7280" strokeWidth="1.4" fill="none" />
      <circle cx="12" cy="6" r="2" stroke="#6B7280" strokeWidth="1.4" fill="none" />
      <circle cx="18" cy="16" r="2" stroke="#6B7280" strokeWidth="1.4" fill="none" />
      <path d="M8 11l6-4" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13l6 3" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Avatar({
  className = '',
  size = 32,
  borderColor = '#D1D5DB',
  borderWidth = 1,
  hoverBorderColor = '#9CA3AF',
  hoverBorderWidth = 2.5,
  hoverScale = 1.05,
  src = '',
  alt = '',
  ariaLabel = 'User avatar',
}) {
  const [hover, setHover] = useState(false);
  const [imgError, setImgError] = useState(false);
  const id = useId();
  const uid = String(id).replace(/:/g, '');
  const clipId = `avatar-clip-${uid}`;

  const strokeColor = hover ? hoverBorderColor : borderColor;
  const strokeW = hover ? hoverBorderWidth : borderWidth;

  const showImage = src && !imgError;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      overflow="visible"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      focusable="false"
      style={{
        transform: hover ? `scale(${hoverScale})` : 'scale(1)',
        transformOrigin: 'center',
        transition: 'transform 180ms cubic-bezier(.2,.9,.2,1), stroke 180ms ease, box-shadow 180ms ease',
        boxShadow: hover ? '0 8px 20px rgba(15,23,42,0.12)' : 'none',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="10" />
        </clipPath>
      </defs>

      <circle cx="12" cy="12" r="12" stroke={strokeColor} strokeWidth={strokeW} fill="none" />

      {showImage ? (
        <>
          <circle cx="12" cy="12" r="10" fill="#E6E7EA" />
          <image
            href={src}
            x="2"
            y="2"
            width="20"
            height="20"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
            onError={() => setImgError(true)}
            alt={alt}
          />
        </>
      ) : (
        <>
          <circle cx="12" cy="12" r="10" fill="#E6E7EA" />
          <path d="M12 12c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z" fill="#6B7280" />
          <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4v1H4v-1z" fill="#6B7280" />
        </>
      )}
    </svg>
  );
}

export function IconMenu({ className = '', size = 20 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M3 5h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2zm0 4h14a1 1 0 010 2H3a1 1 0 110-2z"
        clipRule="evenodd"
      />
    </svg>
  );
}
