
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./ManageEvents.css";

function toLocalDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

function formatDate(value) {
  if (!value) return "Date not available";
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    price: "0",
    totalTickets: "",
    image: "",
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/events/admin");
      setEvents(data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;

    return events.filter((event) =>
      [event.title, event.description, event.venue]
        .some((value) => value?.toLowerCase().includes(term))
    );
  }, [events, search]);

  const handleEdit = (event) => {
    setEditingId(event._id);
    setMessage("");
    setError("");

    setForm({
      title: event.title || "",
      description: event.description || "",
      venue: event.venue || "",
      date: toLocalDateTime(event.date),
      price: String(event.price ?? 0),
      totalTickets: String(event.totalTickets ?? ""),
      image: event.image || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const { data } = await api.put(`/events/${editingId}`, {
        ...form,
        price: Number(form.price),
        totalTickets: Number(form.totalTickets),
      });

      setEvents((previous) =>
        previous.map((event) =>
          event._id === editingId ? data.event : event
        )
      );

      setEditingId(null);
      setMessage(data.message || "Event updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update this event.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (event) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel "${event.title}"? It will no longer appear in public events.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const { data } = await api.patch(`/events/${event._id}/cancel`);

      setEvents((previous) =>
        previous.map((item) =>
          item._id === event._id ? data.event : item
        )
      );

      setMessage(data.message || "Event cancelled successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel this event.");
    }
  };

  const handleDelete = async (event) => {
    const confirmed = window.confirm(
      `Permanently delete "${event.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const { data } = await api.delete(`/events/${event._id}`);

      setEvents((previous) =>
        previous.filter((item) => item._id !== event._id)
      );

      setMessage(data.message || "Event deleted successfully.");

      if (editingId === event._id) {
        setEditingId(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete this event.");
    }
  };

  const closeEditor = () => {
    setEditingId(null);
    setError("");
  };

  return (
    <main className="manage-events-page">
      <header className="manage-events-header">
        <span className="manage-events-eyebrow">ADMINISTRATION</span>
        <h1>Manage events</h1>
        <p>View, update, cancel and manage your published events.</p>
      </header>

      {message && <p className="manage-message" role="status">{message}</p>}
      {error && <p className="manage-error" role="alert">{error}</p>}

      {editingId && (
        <section className="manage-edit-section">
          <div className="manage-section-heading">
            <div>
              <span className="manage-events-eyebrow">EVENT DETAILS</span>
              <h2>Edit event</h2>
            </div>
            <button type="button" className="manage-close-button" onClick={closeEditor}>
              Close
            </button>
          </div>

          <form className="manage-event-form" onSubmit={handleSave}>
            <label>
              Event title
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>

            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} required rows="4" />
            </label>

            <label>
              Venue
              <input name="venue" value={form.venue} onChange={handleChange} required />
            </label>

            <label>
              Date and time
              <input type="datetime-local" name="date" value={form.date} onChange={handleChange} required />
            </label>

            <div className="manage-form-row">
              <label>
                Ticket price (₦)
                <input type="number" name="price" min="0" step="0.01" value={form.price} onChange={handleChange} required />
              </label>

              <label>
                Total tickets
                <input type="number" name="totalTickets" min="1" step="1" value={form.totalTickets} onChange={handleChange} required />
              </label>
            </div>

            <label>
              Event image URL
              <input type="url" name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            </label>

            <div className="manage-form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button type="button" className="manage-secondary-button" onClick={closeEditor}>
                Discard
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="manage-events-list">
        <div className="manage-list-heading">
          <div>
            <span className="manage-events-eyebrow">YOUR EVENTS</span>
            <h2>All events ({events.length})</h2>
          </div>
          <button type="button" className="manage-refresh-button" onClick={loadEvents}>
            Refresh
          </button>
        </div>

        <input
          className="manage-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events by title, description or venue..."
          aria-label="Search events"
        />

        {loading ? (
          <p className="manage-empty">Loading events...</p>
        ) : filteredEvents.length === 0 ? (
          <p className="manage-empty">
            {events.length ? "No events match your search." : "You haven't created any events yet."}
          </p>
        ) : (
          <div className="manage-event-grid">
            {filteredEvents.map((event) => {
              const sold = Number(event.totalTickets || 0) - Number(event.ticketsAvailable || 0);

              return (
                <article className="manage-event-card" key={event._id}>
                  {event.image && (
                    <img className="manage-event-image" src={event.image} alt={event.title} />
                  )}

                  <div className="manage-event-content">
                    <div className="manage-event-title-row">
                      <h3>{event.title}</h3>
                      <span className={event.isCancelled ? "manage-status cancelled" : "manage-status active"}>
                        {event.isCancelled ? "Cancelled" : "Active"}
                      </span>
                    </div>

                    <p className="manage-event-venue">{event.venue}</p>
                    <p className="manage-event-date">{formatDate(event.date)}</p>

                    <div className="manage-event-stats">
                      <span>Price: <strong>₦{Number(event.price || 0).toLocaleString("en-NG")}</strong></span>
                      <span>Sold: <strong>{sold}</strong></span>
                      <span>Available: <strong>{event.ticketsAvailable}</strong></span>
                    </div>

                    <div className="manage-event-actions">
                      <button type="button" onClick={() => handleEdit(event)}>
                        Edit
                      </button>

                      <button
                        type="button"
                        className="manage-cancel-button"
                        onClick={() => handleCancel(event)}
                        disabled={event.isCancelled}
                      >
                        Cancel event
                      </button>

                      <button
                        type="button"
                        className="manage-delete-button"
                        onClick={() => handleDelete(event)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default ManageEvents;
