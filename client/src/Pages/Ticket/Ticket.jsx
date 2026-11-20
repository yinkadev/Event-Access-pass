import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Ticket.css";

function Ticket() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ticketRef = useRef(null);

  useEffect(() => {
    let active = true;
    api.get(`/bookings/${id}`)
      .then(({ data }) => { if (active) setBooking(data.booking); })
      .catch((err) => { console.error("Ticket load failed:", err); if (active) setError(err.response?.data?.message || "We couldn't load this booking."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const downloadTicket = async () => {
    try {
      if (!ticketRef.current || !booking) return;
      const canvas = await html2canvas(ticketRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const pdf = new jsPDF("p", "mm", "a4");
      const width = 190;
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 10, 10, width, height);
      pdf.save(`AccessPass-${booking.ticketCode}.pdf`);
    } catch (err) { console.error("Ticket download failed:", err); setError("The PDF could not be created. Please try again."); }
  };

  if (loading) return <main className="ticket-page"><h2>Loading your ticket…</h2></main>;
  if (error || !booking) return <main className="ticket-page"><p role="alert">{error || "Booking not found."}</p><Link to="/my-bookings">Back to my bookings</Link></main>;

  const isPaid = booking.paymentStatus === "paid";
  const event = booking.event || {};
 const verificationUrl = booking.ticketCode;

  return (
    <section className="ticket-page">
      <div className="ticket" ref={ticketRef}>
        <img src={event.image || "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80"} alt={event.title || "Event"} className="ticket-banner" />
        <div className="ticket-body">
          <h1>{event.title || "AccessPass booking"}</h1>
          <p><strong>📍 Venue:</strong> {event.venue || "To be confirmed"}</p>
          <p><strong>📅 Date:</strong> {event.date ? new Date(event.date).toLocaleDateString("en-GB") : "To be confirmed"}</p>
          <p><strong>🎟 Quantity:</strong> {booking.quantity}</p>
          <p><strong>💰 Total:</strong> ₦{Number(booking.totalPrice || 0).toLocaleString()}</p>
          <p><strong>Payment:</strong> <span className={isPaid ? "confirmed" : "pending-payment"}>{isPaid ? "Paid" : "Pending"}</span></p>
          <div className="ticket-code"><h3>Booking reference</h3><p>{booking.ticketCode}</p></div>
          <div className="qr-section">
           <h3>{isPaid ? "Scan at entrance" : "Booking QR code"}</h3>
           {isPaid ? (
  <img
    src={booking.qrCode}
    alt="AccessPass ticket QR code"
    className="ticket-qr-code"
  />
) : (
  <p>Your booking is recorded, but this is not an admission ticket until payment is confirmed.</p>
)}
          </div>
        </div>
      </div>
      <button className="download-btn" onClick={downloadTicket}>Download booking PDF</button>
      {!isPaid && (
  <Link
    to={`/payment/${booking._id}`}
    className="pay-ticket-btn"
  >
    Pay Now
  </Link>
)}
      <p><Link to="/my-bookings">Back to my bookings</Link></p>
    </section>
  );
}
export default Ticket;
