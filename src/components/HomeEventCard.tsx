import Link from 'next/link'

interface HomeEventCardProps {
    id: string | number;
    title: string;
    image: string;
    location: string;
    date: string;
    time?: string;
    sport?: string;
}

const HomeEventCard: React.FC<HomeEventCardProps> = ({ id, title, image, location, date, time, sport }) => {
    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }

    return (
        <div className="swiper-slide" style={{ height: 'auto' }}>
            <Link href={`/evento/${id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}>
                <article className="event-card" style={{
                    backgroundColor: 'var(--neutral-200)',
                    borderRadius: '16px',
                    padding: '16px 16px 24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
                >
                {/* Imagem */}
                <div style={{
                    width: '100%',
                    aspectRatio: '3/2',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    <img 
                        src={image} 
                        alt={title} 
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                {/* Conteúdo */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    flex: 1
                }}>
                    {/* Título com ícone */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                    }}>
                        <h4 style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            color: 'var(--neutral-800)',
                            margin: 0,
                            flex: 1
                        }}>{title}</h4>
                        <i className="ph ph-arrow-up-right" style={{
                            fontSize: '24px',
                            width: '24px',
                            height: '24px',
                            color: 'var(--neutral-600)',
                            flexShrink: 0
                        }}></i>
                    </div>

                    {/* Endereço e Data */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {/* Endereço */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            color: 'var(--neutral-600)',
                            fontSize: '14px'
                        }}>
                            <i className="ph ph-map-pin" style={{ fontSize: '16px', flexShrink: 0 }}></i>
                            <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>{location}</span>
                        </div>
                        
                        {/* Data */}
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px',
                            color: 'var(--neutral-600)',
                            fontSize: '14px'
                        }}>
                            <i className="ph ph-calendar" style={{ fontSize: '16px', flexShrink: 0 }}></i>
                            <span>{date}</span>
                        </div>
                    </div>
                </div>
            </article>
            </Link>
        </div>
    )
};

export default HomeEventCard;

