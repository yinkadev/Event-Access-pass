import { useEffect, useState } from "react";
import "./FeaturedEvents.css";
import EventCard from "../eventCards/eventCard";
import { Link } from "react-router-dom";
import api from "../../services/api";

function FeaturedEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        if (isMounted) setEvents(response.data.events || []);
      } catch (requestError) {
        console.error("Error fetching events:", requestError);
        if (isMounted) setError("We couldn't load events right now. Please try again shortly.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => { isMounted = false; };
  }, []);

  return (
    <section className="featured-events">
      <div className="featured-heading">
        <div>
          <span className="section-eyebrow">DON'T MISS OUT</span>
          <h2>Events worth showing up for</h2>
          <p>Explore what's happening and find your next experience.</p>
        </div>
        <Link to="/events" className="all-events-link">View all events <span aria-hidden="true">→</span></Link>
      </div>

      {loading ? (
        <p className="events-message">Finding events for you...</p>
      ) : error ? (
        <p className="events-message" role="alert">{error}</p>
      ) : events.length === 0 ? (
        <div className="events-empty">
          <span aria-hidden="true">✦</span>
          <h3>Your next experience is on its way</h3>
          <p>There are no events listed yet. Check back soon.</p>
        </div>
      ) : (
        <div className="events-container">
          {events.slice(0, 6).map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedEvents;
