import React from 'react'

interface SelectProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur?: () => void
  required?: boolean
  disabled?: boolean
  error?: string | null
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  options,
  placeholder = 'Selecione uma opção'
}) => {
  return (
    <div style={{ 
      width: '100%', 
      flexDirection: 'column', 
      justifyContent: 'flex-start', 
      alignItems: 'flex-start', 
      gap: '10px', 
      display: 'inline-flex' 
    }}>
      <div style={{ 
        alignSelf: 'stretch', 
        height: '24px', 
        color: '#4C4C4C', 
        fontSize: '14px', 
        fontFamily: 'Raleway', 
        fontWeight: 600, 
        lineHeight: '28px', 
        wordWrap: 'break-word' 
      }}>
        {label} {required && '*'}
      </div>
      <select
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        style={{ 
          alignSelf: 'stretch', 
          height: '38px', 
          padding: '10px', 
          paddingRight: '35px',
          background: disabled ? '#E8E8E8' : '#F3F3F5', 
          borderRadius: '7px', 
          border: error ? '2px solid #E53E3E' : 'none',
          color: value ? '#1A1A1A' : '#7A7E8B',
          fontSize: '14px',
          fontFamily: 'Raleway',
          fontWeight: 600,
          lineHeight: '18px',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%237A7E8B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        required={required}
      >
        <option value="" disabled style={{ color: '#7A7E8B' }}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} style={{ color: '#1A1A1A' }}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ 
          color: '#E53E3E', 
          fontSize: '12px', 
          marginTop: '4px',
          fontFamily: 'Raleway',
          fontWeight: 500
        }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default Select

