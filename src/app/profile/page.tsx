'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Button from '@/components/Button'
import Avatar from '@/components/Avatar'
import LocationSelector from '@/components/LocationSelector'
import { defaultUser } from '@/data/mockUsers'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    name: defaultUser.name,
    email: defaultUser.email,
    phone: defaultUser.phone,
    bio: defaultUser.bio
  })

  // Esportes fictícios para demonstração
  const mockSports = [
    { id: '1', name: 'Escalada esportiva (indoor)' },
    { id: '2', name: 'Parkour' },
    { id: '3', name: 'Slackline' },
    { id: '4', name: 'Esgrima' }
  ]

  const handleSave = () => {
    // Simular salvamento
    console.log('Dados salvos:', formData)
    setIsEditing(false)
  }

  return (
    <div className="layout">
      <Sidebar />
      
      <main className="content">
        {/* Header */}
        <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--ink-800)' }}>Meu Perfil</h1>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-green-900 hover:bg-green-950"
            >
              Editar perfil
            </Button>
          )}
        </div>

        {/* Profile Content */}
        <section className="greeting-and-promo">
          {/* Left Column - User Info */}
          <div className="greeting" style={{ flex: 1 }}>
            {/* Profile Picture */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
              <Avatar 
                name={formData.name}
                email={formData.email}
                size="xl"
              />
              
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--ink-800)' }}>
                  {formData.name || 'Usuário'}
                </h2>
                <p style={{ color: 'var(--ink-600)', marginBottom: '8px' }}>{formData.email}</p>
                {!isEditing && (
                  <div style={{ marginTop: '12px' }}>
                    <LocationSelector />
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isEditing ? 'white' : 'var(--neutral-100)',
                    fontSize: '14px',
                    color: 'var(--ink-800)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'var(--neutral-100)',
                    fontSize: '14px',
                    color: 'var(--ink-600)',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="(00) 00000-0000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isEditing ? 'white' : 'var(--neutral-100)',
                    fontSize: '14px',
                    color: 'var(--ink-800)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Biografia
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Conte um pouco sobre você..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: isEditing ? 'white' : '#F7F7F7',
                    fontSize: '14px',
                    color: 'var(--ink-800)',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Seção de Esportes */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--ink-700)', fontSize: '14px' }}>
                  Esportes de interesse
                </label>
                <div style={{ 
                  padding: '16px',
                  backgroundColor: 'var(--neutral-100)',
                  borderRadius: '12px'
                }}>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {mockSports.map(sport => (
                      <span 
                        key={sport.id} 
                        className="chip"
                        style={{
                          backgroundColor: 'var(--green-700)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '14px'
                        }}
                      >
                        {sport.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <Button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    Salvar alterações
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats/Info */}
          <div style={{ width: '400px' }}>
            <aside className="promo-card" style={{ 
              backgroundColor: 'var(--green-700)', 
              height: 'auto',
              padding: '32px'
            }}>
              <h2 style={{ color: 'white', marginBottom: '24px' }}>Suas estatísticas</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                    Esportes de interesse
                  </p>
                  <p style={{ color: 'white', fontSize: '32px', fontWeight: 600 }}>
                    {mockSports.length}
                  </p>
                </div>
                
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                    Aulas realizadas
                  </p>
                  <p style={{ color: 'white', fontSize: '32px', fontWeight: 600 }}>12</p>
                </div>
                
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                    Clubes visitados
                  </p>
                  <p style={{ color: 'white', fontSize: '32px', fontWeight: 600 }}>3</p>
                </div>
                
                <div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '4px' }}>
                    Membro desde
                  </p>
                  <p style={{ color: 'white', fontSize: '18px', fontWeight: 500 }}>
                    {new Date(defaultUser.created_at).toLocaleDateString('pt-BR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  )
}