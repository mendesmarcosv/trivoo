'use client'

import React from 'react'

interface PrimaryButtonProps {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  type?: 'button' | 'submit'
  fullWidth?: boolean
}

export default function PrimaryButton({ 
  onClick, 
  disabled = false, 
  children, 
  type = 'button',
  fullWidth = false 
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 24px',
        borderRadius: '24px',
        border: 'none',
        backgroundColor: 'var(--green-700)',
        color: 'white',
        fontSize: '14px',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.2s',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap'
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.backgroundColor = 'var(--green-800)')}
      onMouseLeave={e => !disabled && (e.currentTarget.style.backgroundColor = 'var(--green-700)')}
    >
      {children}
    </button>
  )
}
