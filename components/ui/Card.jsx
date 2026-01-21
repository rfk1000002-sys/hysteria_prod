"use client";

import React from 'react';

/**
 * Card Component - Komponen kartu yang dinamis dan dapat disesuaikan
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Konten utama card
 * @param {string} props.title - Judul card (opsional)
 * @param {React.ReactNode} props.header - Custom header content (opsional)
 * @param {React.ReactNode} props.footer - Footer content (opsional)
 * @param {string} props.variant - Variant styling: 'default' | 'outlined' | 'elevated' | 'filled'
 * @param {string} props.className - Custom className tambahan
 * @param {Function} props.onClick - Click handler untuk seluruh card
 * @param {boolean} props.hoverable - Menambahkan hover effect
 * @param {boolean} props.loading - Status loading
 * @param {React.ReactNode} props.icon - Icon untuk header (opsional)
 * @param {React.ReactNode} props.actions - Action buttons di header (opsional)
 */
export default function Card({
  children,
  title,
  header,
  footer,
  variant = 'default',
  className = '',
  onClick,
  hoverable = false,
  loading = false,
  icon,
  actions,
  ...props
}) {
  // Base styles
  const baseStyles = 'rounded-lg transition-all duration-200';
  
  // Variant styles
  const variantStyles = {
    default: 'bg-white border border-zinc-200',
    outlined: 'bg-transparent border-2 border-zinc-300',
    elevated: 'bg-white shadow-lg border border-zinc-100',
    filled: 'bg-zinc-50 border border-zinc-200'
  };

  // Hover styles
  const hoverStyles = hoverable || onClick 
    ? 'hover:shadow-md hover:border-zinc-300 cursor-pointer' 
    : '';

  // Combined className
  const cardClassName = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`;

  // Loading overlay
  if (loading) {
    return (
      <div className={cardClassName} {...props}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClassName} onClick={onClick} {...props}>
      {/* Header Section */}
      {(header || title || icon || actions) && (
        <div className="px-6 py-4 border-b border-zinc-200">
          {header ? (
            header
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && <div className="flex-shrink-0">{icon}</div>}
                {title && (
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {title}
                  </h3>
                )}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {children}
      </div>

      {/* Footer Section */}
      {footer && (
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}

/**
 * CardHeader Component - Header terpisah untuk fleksibilitas lebih
 */
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-zinc-200 ${className}`}>
      {children}
    </div>
  );
}

/**
 * CardBody Component - Body terpisah untuk fleksibilitas lebih
 */
export function CardBody({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * CardFooter Component - Footer terpisah untuk fleksibilitas lebih
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 bg-zinc-50 border-t border-zinc-200 rounded-b-lg ${className}`}>
      {children}
    </div>
  );
}

/**
 * CardTitle Component - Title helper
 */
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-zinc-900 ${className}`}>
      {children}
    </h3>
  );
}

/**
 * CardDescription Component - Description helper
 */
export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-zinc-500 mt-1 ${className}`}>
      {children}
    </p>
  );
}
