import React from 'react'

interface LoadingProps {
  fullScreen?: boolean
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export default function Loading({ fullScreen = false, size = 'md', message }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4'
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-100 z-50">
        <div
          className={`${sizeClasses[size]} rounded-full animate-spin`}
          style={{
            border: '4px solid #E5E5E5',
            borderTopColor: '#10B981'
          }}
        />
        {message && (
          <p className="mt-4 text-neutral-600 text-sm font-medium">{message}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} rounded-full animate-spin`}
        style={{
          border: '4px solid #E5E5E5',
          borderTopColor: '#10B981'
        }}
      />
      {message && (
        <p className="mt-4 text-neutral-600 text-sm font-medium">{message}</p>
      )}
    </div>
  )
}

