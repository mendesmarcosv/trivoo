interface ClubCardProps {
    title: string;
    distance: string;
    image: string;
    chips?: string[];
}

const ClubCard: React.FC<ClubCardProps> = ({ title, distance, image, chips }) => {
    return (
        <div className="swiper-slide">
            <article className="club-card">
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
        </div>
    )
};

export default ClubCard;