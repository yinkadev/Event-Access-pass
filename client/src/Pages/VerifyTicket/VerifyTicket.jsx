import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./VerifyTicket.css";

function VerifyTicket() {
  const { ticketCode } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkInMessage, setCheckInMessage] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    let active = true;
    api.get(`/bookings/verify/${encodeURIComponent(ticketCode)}`)
      .then(({ data }) => { if (active) setBooking(data.booking); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "This ticket could not be verified."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [ticketCode]);

  if (loading) return <section className="verify-page"><h2>Verifying ticket…</h2></section>;
  if (error || !booking) return <section className="verify-page"><div className="verify-card invalid"><h1>Ticket not verified</h1><p>{error || "This ticket could not be verified."}</p></div></section>;

  const event = booking.event || {};
  const signedInUser = (() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } })();
  const paid = booking.paymentStatus === "paid";
  const used = booking.checkedIn || booking.ticketStatus === "used";
  const validForEntry = paid && !used && booking.ticketStatus === "active";

  const handleCheckIn = async () => {
    setCheckingIn(true); setCheckInMessage("");
    try {
      const { data } = await api.patch(`/bookings/check-in/${encodeURIComponent(booking.ticketCode)}`);
      setBooking(data.booking); setCheckInMessage(data.message);
    } catch (err) { setCheckInMessage(err.response?.data?.message || "Check-in failed."); }
    finally { setCheckingIn(false); }
  };

  return <section className="verify-page"><div className="verify-card">
    <h1>{validForEntry ? "Ticket verified" : used ? "Ticket already used" : "Payment not confirmed"}</h1>
    {event.image && <img src={event.image} alt={event.title || "Event"} className="verify-image" />}
    <h2>{event.title || "Event"}</h2>
    <p><strong>📍 Venue:</strong> {event.venue || "To be confirmed"}</p>
    <p><strong>📅 Date:</strong> {event.date ? new Date(event.date).toLocaleDateString("en-GB") : "To be confirmed"}</p>
    <p><strong>🎟 Quantity:</strong> {booking.quantity}</p>
    <p><strong>Payment:</strong> {booking.paymentStatus}</p>
    <p><strong>Ticket Code:</strong> {booking.ticketCode}</p>
    <span className="status">{validForEntry ? "VALID FOR ENTRY" : used ? "ALREADY CHECKED IN" : "NOT VALID FOR ENTRY"}</span>
    {checkInMessage && <p role="status">{checkInMessage}</p>}
    {signedInUser?.role === "admin" && validForEntry && <button type="button" onClick={handleCheckIn} disabled={checkingIn}>{checkingIn ? "Checking in…" : "Check in attendee"}</button>}
  </div></section>;
}
export default VerifyTicket;
