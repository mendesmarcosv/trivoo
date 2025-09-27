import { MockUser } from '@/data/mockUsers'

// Tipo que pode ser tanto MockUser quanto Supabase User
export type User = MockUser | {
  id: string
  email?: string
  user_metadata?: {
    name?: string
    email?: string
  }
}

// Função utilitária para obter o nome do usuário de forma segura
export function getUserName(user: User | null | undefined): string {
  if (!user) return 'Usuário'
  
  // Se é MockUser, usar a propriedade name diretamente
  if ('name' in user && user.name) {
    return user.name
  }
  
  // Se tem user_metadata, tentar usar o nome de lá
  if (user.user_metadata?.name) {
    return user.user_metadata.name
  }
  
  // Fallback para email (tanto direto quanto em user_metadata)
  const email = user.email || user.user_metadata?.email
  if (email) {
    return email.split('@')[0]
  }
  
  return 'Usuário'
}

// Função utilitária para obter o email do usuário de forma segura
export function getUserEmail(user: User | null | undefined): string {
  if (!user) return ''
  
  // Se é MockUser, usar a propriedade email diretamente
  if ('email' in user && user.email) {
    return user.email
  }
  
  // Se tem user_metadata, tentar usar o email de lá
  if (user.user_metadata?.email) {
    return user.user_metadata.email
  }
  
  return ''
}

// Função utilitária para obter o primeiro nome do usuário
export function getUserFirstName(user: User | null | undefined): string {
  const fullName = getUserName(user)
  return fullName.split(' ')[0]
}
