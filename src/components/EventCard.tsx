import Link from 'next/link'

interface EventCardProps {
    id: string | number;
    title: string;
    image: string;
    location: string;
    date: string;
}

const EventCard: React.FC<EventCardProps> = ({ id, title, image, location, date }) => {
    return (
        <div className="swiper-slide">
            <Link href={`/evento/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="event-card" style={{ cursor: 'pointer' }}>
                    <div className="thumb"><img src={image} alt={title} /></div>
                    <div className="event-body">
                        <h4>{title}</h4>
                        <div className="event-meta"><i className="ph ph-map-pin"></i><span>{location}</span></div>
                        <div className="event-meta"><i className="ph ph-calendar"></i><span>{date}</span></div>
                    </div>
                </article>
            </Link>
        </div>
    )
};

export default EventCard; 