'use client'

import React from 'react'

interface SecondaryButtonProps {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

export default function SecondaryButton({ 
  onClick, 
  disabled = false, 
  children, 
  type = 'button',
  fullWidth = false 
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 32px',
        borderRadius: '24px',
        border: 'none',
        backgroundColor: 'var(--neutral-200)',
        color: 'var(--ink-700)',
        fontSize: '14px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap'
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.backgroundColor = 'var(--neutral-300)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.backgroundColor = 'var(--neutral-200)')}
    >
      {children}
    </button>
  )
}
