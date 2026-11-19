import "./eventCards.css";
import { useNavigate } from "react-router-dom";

function EventCard({ event }) {
  const navigate = useNavigate();
  const date = event.date ? new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Date to be announced";
  return (
    <article className="event-card">
      <img src={event.image || "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80"} alt={event.title || "Event"} className="event-image" />
      <div className="event-content">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p><strong>📍 Venue:</strong> {event.venue}</p>
        <p><strong>📅 Date:</strong> {date}</p>
        <p className="price">{Number(event.price) === 0 ? "Free" : `₦${Number(event.price).toLocaleString()}`}</p>
        <button type="button" onClick={() => navigate(`/events/${event._id}`)}>View Details</button>
      </div>
    </article>
  );
}
export default EventCard;
