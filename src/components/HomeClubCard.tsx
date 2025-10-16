import Link from 'next/link'

interface HomeClubCardProps {
    id: string | number;
    title: string;
    distance: string;
    image: string;
    chips?: string[];
}

const HomeClubCard: React.FC<HomeClubCardProps> = ({ id, title, distance, image, chips }) => {
    return (
        <div className="swiper-slide" style={{ height: 'auto' }}>
            <Link href={`/ct/${id}`} style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}>
                <article className="club-card" style={{
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

                    {/* Tags */}
                    {chips && chips.length > 0 && (
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px'
                        }}>
                            {chips.slice(0, 3).map((chip, chipIdx) => (
                                <span key={chipIdx} style={{
                                    padding: '6px 8px',
                                    backgroundColor: 'var(--neutral-300)',
                                    color: 'var(--green-900)',
                                    fontSize: '14px',
                                    borderRadius: '8px',
                                    fontWeight: 500
                                }}>{chip}</span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
            </Link>
        </div>
    )
};

export default HomeClubCard;

