import Link from 'next/link'

interface ClubCardProps {
    id: string | number;
    title: string;
    distance: string;
    image: string;
    chips?: string[];
}

const ClubCard: React.FC<ClubCardProps> = ({ id, title, distance, image, chips }) => {
    return (
        <div className="swiper-slide">
            <Link href={`/ct/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="club-card" style={{ cursor: 'pointer' }}>
                    <img className="card-bg" src={image} alt={title} />
                    <div className="overlay"></div>
                    <div className="card-top">
                        <span className="chip glass">~{distance}</span>
                    </div>
                    <div className="card-body">
                        <h4>{title}</h4>
                        {chips && (
                            <div className="chips">
                                {chips.map((chip, id) => (
                                    <span key={id} className="chip glass">{chip}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </article>
            </Link>
        </div>
    )
};

export default ClubCard;