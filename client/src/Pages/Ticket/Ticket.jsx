
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
  const [downloadError, setDownloadError] = useState("");

  const ticketRefs = useRef([]);

  useEffect(() => {
    let active = true;

    const fetchBooking = async () => {
      try {
        const { data } = await api.get(`/bookings/${id}`);

        if (active) {
          setBooking(data.booking);
        }
      } catch (err) {
        console.error("Ticket load failed:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
              "We couldn't load this booking."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchBooking();

    return () => {
      active = false;
    };
  }, [id]);

  // Download one individual ticket as a PDF
  const downloadTicket = async (ticket, index) => {
    try {
      setDownloadError("");

      const ticketElement = ticketRefs.current[index];

      if (!ticketElement) {
        setDownloadError("Unable to prepare this ticket for download.");
        return;
      }

      const canvas = await html2canvas(ticketElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const width = 190;
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        10,
        10,
        width,
        height
      );

      pdf.save(`AccessPass-${ticket.ticketCode}.pdf`);
    } catch (err) {
      console.error("Ticket download failed:", err);

      setDownloadError(
        "The PDF could not be created. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <main className="ticket-page">
        <h2>Loading your tickets...</h2>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="ticket-page">
        <p role="alert">{error || "Booking not found."}</p>
        <Link to="/my-bookings">Back to my bookings</Link>
      </main>
    );
  }

  const isPaid = booking.paymentStatus === "paid";
  const event = booking.event || {};
  const tickets = booking.tickets || [];

  return (
    <section className="ticket-page">
      <div className="booking-summary">
        <h1>Your Booking</h1>

        <p>
          <strong>Event:</strong>{" "}
          {event.title || "Event details unavailable"}
        </p>

        <p>
          <strong>Quantity:</strong> {booking.quantity}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          ₦{Number(booking.totalPrice || 0).toLocaleString("en-GB")}
        </p>

        <p>
          <strong>Payment:</strong>{" "}
          <span className={isPaid ? "confirmed" : "pending-payment"}>
            {isPaid ? "Paid" : "Pending"}
          </span>
        </p>
      </div>

      {!isPaid && (
        <div className="payment-notice">
          <p>
            Your booking has been recorded, but your individual tickets
            will only be valid for admission after payment is confirmed.
          </p>

          <Link
            to={`/payment/${booking._id}`}
            className="pay-ticket-btn"
          >
            Pay Now
          </Link>
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="booking-summary">
          <p>
            Individual tickets are not available for this booking.
            This may be an older booking created before individual
            tickets were introduced.
          </p>
        </div>
      ) : (
        <>
          <h2>Your Individual Tickets ({tickets.length})</h2>

          {downloadError && (
            <p role="alert">{downloadError}</p>
          )}

          <div className="individual-tickets">
            {tickets.map((ticket, index) => {
              const ticketUsed =
                ticket.checkedIn || ticket.ticketStatus === "used";

              const ticketCancelled =
                ticket.ticketStatus === "cancelled";

              return (
                <div className="individual-ticket-wrapper" key={ticket._id || ticket.ticketCode}>
                  <div
                    className="ticket"
                    ref={(element) => {
                      ticketRefs.current[index] = element;
                    }}
                  >
                    <img
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={event.title || "Event"}
                      className="ticket-banner"
                    />

                    <div className="ticket-body">
                      <h2>{event.title || "AccessPass Ticket"}</h2>

                      <p>
                        <strong>📍 Venue:</strong>{" "}
                        {event.venue || "To be confirmed"}
                      </p>

                      <p>
                        <strong>📅 Date:</strong>{" "}
                        {event.date
                          ? new Date(event.date).toLocaleDateString("en-GB")
                          : "To be confirmed"}
                      </p>

                      <p>
                        <strong>Ticket:</strong> {index + 1} of {tickets.length}
                      </p>

                      <p>
                        <strong>Payment:</strong>{" "}
                        <span className={isPaid ? "confirmed" : "pending-payment"}>
                          {isPaid ? "Paid" : "Pending"}
                        </span>
                      </p>

                      <p>
                        <strong>Ticket status:</strong>{" "}
                        {ticketCancelled
                          ? "Cancelled"
                          : ticketUsed
                            ? "Already checked in"
                            : "Active"}
                      </p>

                      <div className="ticket-code">
                        <h3>Individual Ticket Code</h3>
                        <p>{ticket.ticketCode}</p>
                      </div>

                      <div className="qr-section">
                        <h3>
                          {isPaid
                            ? "Your Admission QR Code"
                            : "QR Code Available After Payment"}
                        </h3>

                        {isPaid && ticket.qrCode ? (
                          <img
                            src={ticket.qrCode}
                            alt={`QR code for ticket ${index + 1}`}
                            className="ticket-qr-code"
                          />
                        ) : (
                          <p>
                            Complete payment to activate this ticket
                            and access its admission QR code.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="download-btn"
                    onClick={() => downloadTicket(ticket, index)}
                  >
                    Download Ticket {index + 1} PDF
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="back-bookings-wrapper">
        <Link to="/my-bookings" className="back-bookings-btn">
          Back to my bookings
        </Link>
      </p>
    </section>
  );
}

export default Ticket;
