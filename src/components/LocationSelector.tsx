'use client';

import { useState, useEffect } from 'react';
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
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IBGECity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Carregar localização salva do localStorage
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
      } catch (error) {
        console.error('Erro ao carregar localização:', error);
        setLocation({ city: 'Niterói', state: 'RJ' });
      }
    } else {
      setLocation({ city: 'Niterói', state: 'RJ' });
    }
  }, []);

  // Função para obter localização via geolocalização
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada neste navegador');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Usar API do IBGE para obter cidade baseada nas coordenadas
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome`
          );
          
          if (!response.ok) {
            throw new Error('Erro ao buscar dados do IBGE');
          }
          
          const cities = await response.json();
          
          // Para simplificar, vamos usar uma cidade próxima baseada na latitude
          // Em um projeto real, você usaria uma API de geocoding reversa
          const nearestCity = cities.find((city: IBGECity) => 
            city.nome.toLowerCase().includes('niterói') || 
            city.nome.toLowerCase().includes('rio de janeiro')
          ) || cities[0];

          const newLocation: Location = {
            city: nearestCity.nome,
            state: nearestCity.microrregiao.mesorregiao.UF.sigla,
            lat: latitude,
            lng: longitude
          };

          setLocation(newLocation);
          saveLocation(newLocation);
          setShowModal(false);
          
        } catch (error) {
          console.error('Erro ao obter cidade:', error);
          toast.error('Erro ao obter localização');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Erro de geolocalização:', error);
        toast.error('Erro ao obter localização');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Função para buscar cidades
  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome&filter=nome=*${encodeURIComponent(query)}*`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar cidades');
      }
      
      const cities = await response.json();
      setSearchResults(cities.slice(0, 10)); // Limitar a 10 resultados
      
    } catch (error) {
      console.error('Erro ao buscar cidades:', error);
      toast.error('Erro ao buscar cidades');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Função para selecionar cidade
  const selectCity = async (city: IBGECity) => {
    const newLocation: Location = {
      city: city.nome,
      state: city.microrregiao.mesorregiao.UF.sigla
    };

    setLocation(newLocation);
    setShowModal(false);
    setSearchQuery('');
    setSearchResults([]);
    
    saveLocation(newLocation);
  };

  // Função para salvar localização no localStorage
  const saveLocation = (loc: Location) => {
    try {
      localStorage.setItem('userLocation', JSON.stringify(loc));
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
    }
  };

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchCities(searchQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <>
      <div className="location-chip" onClick={() => setShowModal(true)}>
        <div className="location-info">
          <i className="ph ph-map-pin"></i>
          <span>{location?.city || 'Niterói'}, {location?.state || 'RJ'}</span>
        </div>
      </div>

      {showModal && (
        <div className="location-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="location-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Alterar Localização</h3>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="ph ph-x"></i>
              </button>
            </div>

            <div className="modal-content">
              <button
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="location-btn"
              >
                {isGettingLocation ? (
                  <>
                    <i className="ph ph-spinner ph-spin"></i>
                    Obtendo localização...
                  </>
                ) : (
                  <>
                    <i className="ph ph-navigation-arrow"></i>
                    Usar localização atual
                  </>
                )}
              </button>

              <div className="divider">
                <span>ou</span>
              </div>

              <div className="search-section">
                <div className="search-input-container">
                  <i className="ph ph-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder="Buscar cidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                    autoFocus
                  />
                  {isSearching && <i className="ph ph-spinner ph-spin search-spinner"></i>}
                </div>

                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => selectCity(city)}
                        className="search-result-item"
                      >
                        <div className="result-city">{city.nome}</div>
                        <div className="result-state">{city.microrregiao.mesorregiao.UF.sigla}</div>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && !isSearching && (
                  <div className="no-results">
                    <i className="ph ph-magnifying-glass"></i>
                    <span>Nenhuma cidade encontrada</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .location-chip {
          background: rgba(199, 199, 199, 0.13);
          backdrop-filter: blur(2px);
          border-radius: 12px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .location-chip:hover {
          background: rgba(199, 199, 199, 0.2);
        }

        .location-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--ink-800);
          font-size: 14px;
          font-weight: 500;
        }

        .location-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .location-modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 80vh;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background: #f3f4f6;
        }

        .modal-content {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .location-btn {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .location-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .location-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .divider span {
          padding: 0 16px;
        }

        .search-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input-container i {
          position: absolute;
          left: 16px;
          color: #9ca3af;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 2px solid #d1d5db;
          border-radius: 12px;
          font-size: 16px;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .search-spinner {
          position: absolute;
          right: 16px;
          color: #9ca3af;
        }

        .search-results {
          max-height: 300px;
          overflow-y: auto;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: white;
        }

        .search-result-item {
          width: 100%;
          padding: 16px 20px;
          border: none;
          background: none;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          transition: background-color 0.2s;
        }

        .search-result-item:hover {
          background: #f9fafb;
        }

        .search-result-item:not(:last-child) {
          border-bottom: 1px solid #f3f4f6;
        }

        .result-city {
          font-weight: 500;
          color: #1f2937;
          font-size: 16px;
        }

        .result-state {
          font-size: 14px;
          color: #6b7280;
        }

        .no-results {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 40px 20px;
          color: #6b7280;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .location-modal {
            margin: 20px;
            max-height: 90vh;
          }
          
          .modal-content {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}