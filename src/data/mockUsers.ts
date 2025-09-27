export interface MockUser {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  location: string
  location_coords: {
    lat: number
    lng: number
  }
  avatar_url: string
  created_at: string
  updated_at: string
}

export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(21) 99999-1111',
    bio: 'Professora de natação há 8 anos. Especialista em técnicas de respiração e coordenação.',
    location: '',
    location_coords: {
      lat: -22.9068,
      lng: -43.1729
    },
    avatar_url: '/images/teachers/profile Ana Bechara.png',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-09-26T15:30:00Z'
  },
  {
    id: 'user-2',
    name: 'Bruno Santos',
    email: 'bruno.santos@email.com',
    phone: '(21) 99999-2222',
    bio: 'Instrutor de futebol com experiência em categorias de base. Apaixonado por desenvolver talentos.',
    location: 'São Gonçalo',
    location_coords: {
      lat: -22.8269,
      lng: -43.0539
    },
    avatar_url: '/images/teachers/profile Bruno Dantas.png',
    created_at: '2024-02-20T14:15:00Z',
    updated_at: '2024-09-26T16:45:00Z'
  },
  {
    id: 'user-3',
    name: 'Clarice Oliveira',
    email: 'clarice.oliveira@email.com',
    phone: '(21) 99999-3333',
    bio: 'Personal trainer especializada em funcional e pilates. Foco em bem-estar e qualidade de vida.',
    location: 'Maricá',
    location_coords: {
      lat: -22.9194,
      lng: -42.8186
    },
    avatar_url: '/images/teachers/profile Clarice Neri.png',
    created_at: '2024-03-10T09:30:00Z',
    updated_at: '2024-09-26T17:20:00Z'
  },
  {
    id: 'user-4',
    name: 'Gabriel Costa',
    email: 'gabriel.costa@email.com',
    phone: '(21) 99999-4444',
    bio: 'Professor de tênis com formação internacional. Técnico de alto rendimento.',
    location: 'Rio de Janeiro',
    location_coords: {
      lat: -22.9068,
      lng: -43.1729
    },
    avatar_url: '/images/teachers/profile Gabriel Mitter.png',
    created_at: '2024-04-05T11:45:00Z',
    updated_at: '2024-09-26T18:10:00Z'
  },
  {
    id: 'user-5',
    name: 'Helena Moraes',
    email: 'helena.moraes@email.com',
    phone: '(21) 99999-5555',
    bio: 'Instrutora de yoga e meditação. Certificada em Hatha e Vinyasa Flow.',
    location: 'Itaboraí',
    location_coords: {
      lat: -22.7444,
      lng: -42.8594
    },
    avatar_url: '/images/teachers/profile Helena Moraes.png',
    created_at: '2024-05-12T16:20:00Z',
    updated_at: '2024-09-26T19:00:00Z'
  }
]

// Usuário padrão que será usado quando não houver autenticação
export const defaultUser: MockUser = mockUsers[0]
