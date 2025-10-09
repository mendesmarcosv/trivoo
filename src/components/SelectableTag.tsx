'use client'

import React from 'react'

interface SelectableTagProps {
  label: string
  selected: boolean
  onClick: () => void
}

export default function SelectableTag({ label, selected, onClick }: SelectableTagProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        border: selected ? 'none' : '1.5px solid #006FCA',
        backgroundColor: selected ? '#006FCA' : 'transparent',
        color: selected ? 'white' : '#006FCA',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = 'rgba(0, 111, 202, 0.1)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = 'transparent'
        }
      }}
    >
      {label}
    </button>
  )
}

