import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import EventCard from "../../Compnents/eventCards/eventCard";
import "./Event.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get("/events")
      .then(({ data }) => { if (active) setEvents(data.events || []); })
      .catch((err) => { console.error("Could not load events", err); if (active) setError(err.response?.data?.message || "We couldn't load events. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) => [event.title, event.description, event.venue].some((value) => value?.toLowerCase().includes(term)));
  }, [events, search]);

  return (
    <main className="events-page">
      <header className="events-page-header">
        <span className="events-eyebrow">FIND YOUR NEXT EXPERIENCE</span>
        <h1>Discover events</h1>
        <p>From unforgettable nights out to ideas worth sharing, find something happening near you.</p>
        <label className="events-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by event, description or venue" aria-label="Search events" /></label>
      </header>
      {loading ? <p className="events-state">Loading events…</p> : error ? <p className="events-state" role="alert">{error}</p> : filteredEvents.length ? <><p className="events-count">{filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"} to explore</p><div className="events-container">{filteredEvents.map((event) => <EventCard key={event._id} event={event} />)}</div></> : <section className="events-no-results"><h2>{events.length ? "No matching events" : "No events listed yet"}</h2><p>{events.length ? "Try another search term." : "New experiences will appear here as soon as they are published."}</p><Link to="/">Back to home</Link></section>}
    </main>
  );
}

export default Events;
