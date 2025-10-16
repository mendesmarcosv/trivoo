import React from 'react'

interface InputProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: () => void
  required?: boolean
  disabled?: boolean
  error?: string | null
  maxLength?: number
  isLoading?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  error,
  maxLength,
  isLoading = false
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
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          maxLength={maxLength}
          style={{ 
            width: '100%',
            height: '38px', 
            padding: '10px', 
            paddingRight: isLoading ? '40px' : '10px',
            background: disabled ? '#E8E8E8' : '#F3F3F5', 
            borderRadius: '7px', 
            border: error ? '2px solid #E53E3E' : 'none',
            color: disabled ? '#A0A0A0' : '#1A1A1A',
            fontSize: '14px',
            fontFamily: 'Raleway',
            fontWeight: 600,
            lineHeight: '28px',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            colorScheme: 'light'
          }}
          className={type === 'date' ? 'date-input' : ''}
          required={required}
        />
        {isLoading && (
          <div style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '18px',
            height: '18px',
            border: '2px solid #E5E5E5',
            borderTopColor: '#10B981',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
        )}
      </div>
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
      <style jsx>{`
        @keyframes spin {
          from {
            transform: translateY(-50%) rotate(0deg);
          }
          to {
            transform: translateY(-50%) rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default Input

