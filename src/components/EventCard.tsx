interface EventCardProps {
    title: string;
    image: string;
    location: string;
    date: string;
}

const EventCard: React.FC<EventCardProps> = ({ title, image, location, date }) => {
    return (
        <div className="swiper-slide">
            <article className="event-card">
                <div className="thumb"><img src={image} alt={title} /></div>
                <div className="event-body">
                    <h4>{title}</h4>
                    <div className="event-meta"><i className="ph ph-map-pin"></i><span>{location}</span></div>
                    <div className="event-meta"><i className="ph ph-calendar"></i><span>{date}</span></div>
                </div>
            </article>
        </div>
    )
};

export default EventCard; 