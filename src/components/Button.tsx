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
      className={`bg-[#95B02F] text-white px-8 py-3 rounded-full font-medium hover:bg-[#7d9526] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border-0 focus:outline-none focus:ring-2 focus:ring-[#95B02F] focus:ring-opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}
