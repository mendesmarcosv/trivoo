'use client'

interface AvatarProps {
  name?: string
  email?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export default function Avatar({ name, email, size = 'md', className = '' }: AvatarProps) {
  // Obter primeira letra do nome
  const getInitial = () => {
    if (name && name.trim()) {
      return name.trim()[0].toUpperCase()
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return 'U'
  }

  // Tamanhos responsivos
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-lg sm:text-xl md:text-2xl',
    xl: 'w-24 h-24 text-2xl'
  }

  return (
    <div className={`
      ${sizeClasses[size]}
      rounded-full 
      bg-green-700 
      flex 
      items-center 
      justify-center 
      text-white 
      font-semibold
      ${className}
    `}>
      {getInitial()}
    </div>
  )
}
