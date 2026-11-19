import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./CreateEvents.css";

const initialForm = { title: "", description: "", venue: "", date: "", price: "0", totalTickets: "", image: "" };
function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const payload = { ...form, date: new Date(form.date).toISOString(), price: Number(form.price), totalTickets: Number(form.totalTickets), ticketsAvailable: Number(form.totalTickets) };
      const { data } = await api.post("/events", payload);
      navigate(`/events/${data.event._id}`);
    } catch (err) { setError(err.response?.data?.message || "Event could not be created. Check your details and permissions."); }
    finally { setLoading(false); }
  };
  const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } })();
  if (!localStorage.getItem("token")) return <main className="create-event-page"><p>Please <Link to="/login">log in</Link> to continue.</p></main>;
  if (user?.role !== "admin") return <main className="create-event-page"><h1>Host an event</h1><p>Event publishing is currently available to AccessPass administrators. Please contact the platform team if you need organiser access.</p></main>;
  return <main className="create-event-page"><header><span>ACCESSPASS ORGANISER</span><h1>Create an event</h1><p>Share the details so guests can discover and book their place.</p></header>{error && <p className="create-error" role="alert">{error}</p>}<form onSubmit={submit} className="create-event-form">
    <label>Event title<input name="title" value={form.title} onChange={update} required maxLength={120} /></label>
    <label>Description<textarea name="description" value={form.description} onChange={update} required rows={5} /></label>
    <label>Venue<input name="venue" value={form.venue} onChange={update} required /></label>
    <label>Date and time<input type="datetime-local" name="date" value={form.date} onChange={update} required /></label>
    <div className="create-event-row"><label>Ticket price (₦)<input type="number" name="price" min="0" step="0.01" value={form.price} onChange={update} required /></label><label>Available tickets<input type="number" name="totalTickets" min="1" step="1" value={form.totalTickets} onChange={update} required /></label></div>
    <label>Event image URL (optional)<input type="url" name="image" value={form.image} onChange={update} placeholder="https://…" /></label>
    <button type="submit" disabled={loading}>{loading ? "Publishing…" : "Publish event"}</button>
  </form></main>;
}
export default CreateEvent;
