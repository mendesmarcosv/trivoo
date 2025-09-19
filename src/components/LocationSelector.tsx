'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks/useAuth';
import toast from 'react-hot-toast';

interface Location {
  city: string;
  state: string;
  lat?: number;
  lng?: number;
}

interface IBGECity {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
        nome: string;
      }
    }
  }
}

export default function LocationSelector() {
  const { user, userProfile, fetchUserProfile } = useAuth();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IBGECity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Carregar localização salva do usuário
  useEffect(() => {
    if (userProfile?.location_coords) {
      const coords = userProfile.location_coords as any;
      setLocation({
        city: coords.city || userProfile.location || 'Niterói',
        state: coords.state || 'RJ',
        lat: coords.lat,
        lng: coords.lng
      });
    } else if (userProfile?.location) {
      setLocation({
        city: userProfile.location,
        state: 'RJ'
      });
    }
  }, [userProfile]);

  // Função para obter localização via geolocalização
  const getGeolocation = async () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada pelo seu navegador');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Usar API de reverse geocoding (nominatim)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt-BR`
          );
          
          if (!response.ok) throw new Error('Erro ao buscar localização');
          
          const data = await response.json();
          
          const newLocation: Location = {
            city: data.address.city || data.address.town || data.address.village || 'Desconhecida',
            state: data.address.state || 'RJ',
            lat: latitude,
            lng: longitude
          };
          
          setLocation(newLocation);
          // Fechar modal imediatamente
          setShowSearch(false);
          await saveLocation(newLocation);
        } catch (error) {
          console.error('Erro ao obter cidade:', error);
          toast.error('Erro ao obter sua localização');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error('Não foi possível obter sua localização');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Função para buscar cidades via API do IBGE
  const searchCities = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      // Buscar todas as cidades do Brasil
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome`
      );
      
      if (!response.ok) throw new Error('Erro ao buscar cidades');
      
      const allCities: IBGECity[] = await response.json();
      
      // Filtrar cidades pelo nome
      const filtered = allCities.filter(city => 
        city.nome.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10); // Limitar a 10 resultados
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      toast.error('Erro ao buscar cidades');
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para a busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchCities(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Função para selecionar uma cidade da busca
  const selectCity = async (city: IBGECity) => {
    const newLocation: Location = {
      city: city.nome,
      state: city.microrregiao.mesorregiao.UF.sigla
    };
    
    setLocation(newLocation);
    // Fechar modal imediatamente
    setShowSearch(false);
    await saveLocation(newLocation);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Função para salvar localização no banco
  const saveLocation = async (loc: Location) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // 1) Tenta salvar com location_coords (se a coluna existir)
      const { error } = await supabase
        .from('profiles')
        .update({
          location: loc.city,
          location_coords: {
            city: loc.city,
            state: loc.state,
            lat: loc.lat,
            lng: loc.lng
          }
        })
        .eq('id', user.id);

      if (error) {
        // 2) Se a coluna não existir (banco ainda sem migration), faz fallback só com location
        const isMissingColumn =
          (error as any)?.code === '42703' ||
          String((error as any)?.message || '').toLowerCase().includes('location_coords');

        if (isMissingColumn) {
          const { error: fallbackError } = await supabase
            .from('profiles')
            .update({ location: loc.city })
            .eq('id', user.id);

          if (fallbackError) {
            console.error('Erro ao salvar localização (fallback):', fallbackError);
            toast.error('Erro ao salvar localização');
            return;
          }
        } else {
          console.error('Erro ao salvar localização:', error);
          toast.error('Erro ao salvar localização');
          return;
        }
      }

      // Atualizar o perfil no contexto somente em caso de sucesso
      await fetchUserProfile();
      toast.success(`Localização atualizada: ${loc.city}, ${loc.state}`, {
        duration: 2500,
        position: 'bottom-right',
        icon: (
          <i className="ph ph-check-circle" style={{ fontSize: 18, color: '#ffffff' }}></i>
        ),
        style: {
          background: '#22C55E',
          color: '#ffffff',
          border: 'none'
        }
      });
    } catch (error) {
      console.error('Erro ao salvar localização:', error);
      toast.error('Erro ao salvar localização');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className="chip chip-filled" 
        type="button"
        onClick={() => setShowSearch(!showSearch)}
        style={{ position: 'relative' }}
      >
        <span className="chip-icon">
          <i className="ph ph-map-pin"></i>
        </span>
        <span className="chip-text">
          {location ? `${location.city}, ${location.state}` : 'Selecionar localização'}
        </span>
        <i className="ph ph-caret-down chevron"></i>
      </button>

      {/* Modal de seleção */}
      {showSearch && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => {
              setShowSearch(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 40
            }}
          />

          {/* Modal */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '500px',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            zIndex: 50,
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '24px 24px 16px',
              borderBottom: '1px solid #F0F0F0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--ink-800)',
                  margin: 0
                }}>
                  Selecionar Localização
                </h3>
                <button
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: 'var(--ink-600)'
                  }}
                >
                  <i className="ph ph-x" style={{ fontSize: '20px' }}></i>
                </button>
              </div>

              {/* Campo de busca */}
              <div style={{
                position: 'relative'
              }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite o nome da cidade..."
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 44px',
                    border: '1px solid #E0E0E0',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#95B02F'}
                  onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                  autoFocus
                />
                <i 
                  className="ph ph-magnifying-glass" 
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '18px',
                    color: 'var(--ink-500)'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: 'var(--ink-400)'
                    }}
                  >
                    <i className="ph ph-x-circle" style={{ fontSize: '18px' }}></i>
                  </button>
                )}
              </div>

              {/* Botão de geolocalização */}
              <button
                onClick={getGeolocation}
                disabled={isGettingLocation}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: '#F7F7F7',
                  border: '1px solid #E0E0E0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: isGettingLocation ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  color: 'var(--ink-700)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isGettingLocation) {
                    e.currentTarget.style.backgroundColor = '#95B02F';
                    e.currentTarget.style.borderColor = '#95B02F';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F7F7F7';
                  e.currentTarget.style.borderColor = '#E0E0E0';
                  e.currentTarget.style.color = 'var(--ink-700)';
                }}
              >
                {isGettingLocation ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid currentColor',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span>Obtendo localização...</span>
                  </>
                ) : (
                  <>
                    <i className="ph ph-crosshair" style={{ fontSize: '18px' }}></i>
                    <span>Usar minha localização atual</span>
                  </>
                )}
              </button>
            </div>

            {/* Conteúdo */}
            <div style={{
              maxHeight: '350px',
              overflowY: 'auto',
              padding: '16px 24px 24px'
            }}>
              {/* Resultados da busca */}
              {isSearching && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '40px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid #95B02F',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--ink-500)',
                    marginBottom: '12px',
                    fontWeight: 500
                  }}>
                    RESULTADOS DA BUSCA
                  </p>
                  {searchResults.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => selectCity(city)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '12px 16px',
                        backgroundColor: 'white',
                        border: 'none',
                        borderBottom: '1px solid #F0F0F0',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F7F7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{
                        fontSize: '14px',
                        color: 'var(--ink-800)',
                        fontWeight: 500
                      }}>
                        {city.nome}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: 'var(--ink-500)',
                        marginTop: '2px'
                      }}>
                        {city.microrregiao.mesorregiao.UF.nome}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!isSearching && searchQuery.length >= 3 && searchResults.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: 'var(--ink-500)',
                  fontSize: '14px'
                }}>
                  Nenhuma cidade encontrada
                </div>
              )}

              {!searchQuery && (
                <div>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--ink-500)',
                    marginBottom: '12px',
                    fontWeight: 500
                  }}>
                    SUGESTÕES RÁPIDAS
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <button
                      onClick={() => selectCity({
                        id: 3303302,
                        nome: 'Niterói',
                        microrregiao: {
                          mesorregiao: {
                            UF: {
                              sigla: 'RJ',
                              nome: 'Rio de Janeiro'
                            }
                          }
                        }
                      } as IBGECity)}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        backgroundColor: 'white',
                        border: 'none',
                        borderBottom: '1px solid #F0F0F0',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F7F7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ fontSize: '14px', color: 'var(--ink-800)', fontWeight: 500 }}>
                        Niterói, RJ
                      </div>
                    </button>
                    <button
                      onClick={() => selectCity({
                        id: 3304557,
                        nome: 'Rio de Janeiro',
                        microrregiao: {
                          mesorregiao: {
                            UF: {
                              sigla: 'RJ',
                              nome: 'Rio de Janeiro'
                            }
                          }
                        }
                      } as IBGECity)}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        backgroundColor: 'white',
                        border: 'none',
                        borderBottom: '1px solid #F0F0F0',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F7F7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ fontSize: '14px', color: 'var(--ink-800)', fontWeight: 500 }}>
                        Rio de Janeiro, RJ
                      </div>
                    </button>
                    <button
                      onClick={() => selectCity({
                        id: 3550308,
                        nome: 'São Paulo',
                        microrregiao: {
                          mesorregiao: {
                            UF: {
                              sigla: 'SP',
                              nome: 'São Paulo'
                            }
                          }
                        }
                      } as IBGECity)}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        backgroundColor: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F7F7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ fontSize: '14px', color: 'var(--ink-800)', fontWeight: 500 }}>
                        São Paulo, SP
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </>
      )}
    </>
  );
}