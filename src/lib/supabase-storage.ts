// =====================================================
// TRIVOO - FUNÇÕES PARA SUPABASE STORAGE
// =====================================================

import { supabase } from '@/lib/supabase'

// =====================================================
// FUNÇÕES DE UPLOAD DE IMAGENS
// =====================================================

/**
 * Upload de avatar do usuário
 */
export async function uploadUserAvatar(userId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar.${fileExt}`
    const filePath = `user-${userId}/${fileName}`

    // Upload do arquivo
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return null
    }

    // Obter URL pública
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Erro no upload do avatar:', error)
    return null
  }
}

/**
 * Upload de imagem de clube
 */
export async function uploadClubImage(clubId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `image.${fileExt}`
    const filePath = `club-${clubId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('clubs')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('clubs')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Erro no upload da imagem do clube:', error)
    return null
  }
}

/**
 * Upload de avatar de professor
 */
export async function uploadTeacherAvatar(teacherId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `avatar.${fileExt}`
    const filePath = `teacher-${teacherId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('teachers')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('teachers')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Erro no upload do avatar do professor:', error)
    return null
  }
}

/**
 * Upload de imagem de evento
 */
export async function uploadEventImage(eventId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `image.${fileExt}`
    const filePath = `event-${eventId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('events')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('events')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Erro no upload da imagem do evento:', error)
    return null
  }
}

/**
 * Upload de imagem de banner
 */
export async function uploadBannerImage(bannerId: string, file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `image.${fileExt}`
    const filePath = `banner-${bannerId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('banners')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Erro no upload da imagem do banner:', error)
    return null
  }
}

// =====================================================
// FUNÇÕES DE DELEÇÃO DE IMAGENS
// =====================================================

/**
 * Deletar avatar do usuário
 */
export async function deleteUserAvatar(userId: string): Promise<boolean> {
  try {
    const filePath = `user-${userId}/avatar.jpg`

    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath])

    if (error) {
      console.error('Erro ao deletar avatar:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao deletar avatar:', error)
    return false
  }
}

/**
 * Deletar imagem de clube
 */
export async function deleteClubImage(clubId: string): Promise<boolean> {
  try {
    const filePath = `club-${clubId}/image.jpg`

    const { error } = await supabase.storage
      .from('clubs')
      .remove([filePath])

    if (error) {
      console.error('Erro ao deletar imagem do clube:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao deletar imagem do clube:', error)
    return false
  }
}

/**
 * Deletar avatar de professor
 */
export async function deleteTeacherAvatar(teacherId: string): Promise<boolean> {
  try {
    const filePath = `teacher-${teacherId}/avatar.jpg`

    const { error } = await supabase.storage
      .from('teachers')
      .remove([filePath])

    if (error) {
      console.error('Erro ao deletar avatar do professor:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao deletar avatar do professor:', error)
    return false
  }
}

/**
 * Deletar imagem de evento
 */
export async function deleteEventImage(eventId: string): Promise<boolean> {
  try {
    const filePath = `event-${eventId}/image.jpg`

    const { error } = await supabase.storage
      .from('events')
      .remove([filePath])

    if (error) {
      console.error('Erro ao deletar imagem do evento:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro ao deletar imagem do evento:', error)
    return false
  }
}

// =====================================================
// FUNÇÕES DE BUSCA DE DADOS
// =====================================================

/**
 * Buscar todos os clubes
 */
export async function getClubs() {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('distance_km')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar clubes:', error)
    return []
  }
}

/**
 * Buscar todos os professores
 */
export async function getTeachers() {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('rating', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar professores:', error)
    return []
  }
}

/**
 * Buscar todos os eventos próximos
 */
export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar eventos:', error)
    return []
  }
}

/**
 * Buscar perfil do usuário
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar perfil:', error)
    return null
  }
}

/**
 * Atualizar perfil do usuário
 */
export async function updateUserProfile(userId: string, profileData: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profileData })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return null
  }
}
