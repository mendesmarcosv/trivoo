import Link from 'next/link'

interface ExplorarTeacherCardProps {
    id: string | number;
    name: string;
    sport: string;
    rating: number;
    reviews: number;
    image: string;
    location?: string;
}

const ExplorarTeacherCard: React.FC<ExplorarTeacherCardProps> = ({ id, name, sport, rating, reviews, image, location }) => {
    return (
        <Link href={`/professor/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article className="teacher-card" style={{
                backgroundColor: 'var(--neutral-200)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
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
            {/* Avatar e Rating */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <img 
                    src={image} 
                    alt={name} 
                    style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                    }} 
                />
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    fontSize: '14px',
                    color: 'var(--neutral-800)',
                    fontWeight: 500
                }}>
                    <span>{Number(rating || 0).toFixed(1)}</span>
                    <span style={{ color: 'var(--neutral-600)' }}>/5</span>
                    <i className="ph-fill ph-star" style={{ color: '#FFB800', fontSize: '14px' }}></i>
                </div>
            </div>

            {/* Nome */}
            <h4 style={{ 
                fontSize: '20px', 
                fontWeight: 600, 
                color: 'var(--neutral-800)',
                margin: 0,
                lineHeight: '1.3'
            }}>{name}</h4>

            {/* Esporte - Tag igual CT mas com neutral-100 */}
            <span style={{
                display: 'inline-block',
                padding: '6px 8px',
                backgroundColor: 'var(--neutral-100)',
                color: 'var(--green-900)',
                fontSize: '14px',
                borderRadius: '8px',
                fontWeight: 500,
                width: 'fit-content'
            }}>{sport}</span>

            {/* Localização */}
            {location && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--neutral-600)',
                    fontSize: '14px'
                }}>
                    <i className="ph ph-map-pin" style={{ fontSize: '16px' }}></i>
                    <span>{location}</span>
                </div>
            )}
        </article>
        </Link>
    )
};

export default ExplorarTeacherCard;


