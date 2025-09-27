'use client'

import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  className = ''
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-green-700 text-white px-8 py-3 rounded-full min-h-[44px] text-base font-bold hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}
