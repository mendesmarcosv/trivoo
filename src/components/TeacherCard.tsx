interface TeacherCardProps {
    name: string;
    sport: string;
    rating: string;
    location: string;
    avatar: string;
}

const TeacherCard: React.FC<TeacherCardProps> = ({ name, sport, rating, location, avatar }) => {
    return (
        <div className="swiper-slide">
            <article className="teacher-card">
                <header className="teacher-head">
                    <div className="profile">
                        <img className="avatar-sm" src={avatar} alt={name} />
                        <div className="rating"><strong>{rating}</strong><span>/5</span><i className="ph-fill ph-star"></i></div>
                    </div>
                    <h4>{name}</h4>
                    <span className="chip chip-grey">{sport}</span>
                </header>
                <footer className="teacher-footer">
                    <i className="ph ph-map-pin"></i>
                    <span>{location}</span>
                </footer>
            </article>
        </div>
    )
};

export default TeacherCard; 