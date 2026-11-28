
import { useEffect, useState } from "react";
import api from "../../services/api";
import "./MyBookings.css";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/my-bookings");
        setBookings(response.data.bookings || []);
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error.response?.data?.message || "Failed to load bookings."
        );

        if (error.response?.status === 401) {
          navigate("/login", {
            state: { from: "/my-bookings" },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return <h2>Loading bookings...</h2>;
  }

  if (errorMessage) {
    return (
      <section className="my-bookings">
        <p role="alert">{errorMessage}</p>
      </section>
    );
  }

  if (bookings.length === 0) {
    return (
      <section className="my-bookings">
        <h2>You haven't booked any events yet.</h2>
        <button onClick={() => navigate("/events")}>
          Explore events
        </button>
      </section>
    );
  }

  return (
    <section className="my-bookings">
      <h2>My Bookings</h2>

      <div className="bookings-container">
        {bookings.map((booking) => {
          const tickets = booking.tickets || [];

          return (
            <div className="ticket-card" key={booking._id}>
              <div className="ticket-left">
                <img
                  src={
                    booking.event?.image ||
                    "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=700&q=80"
                  }
                  alt={booking.event?.title || "Event"}
                  className="ticket-image"
                />
              </div>

              <div className="ticket-right">
                <div className="ticket-header">
                  <h2>
                    {booking.event?.title || "Event details unavailable"}
                  </h2>

                  <span
                    className={`status status-${booking.paymentStatus || "pending"}`}
                  >
                    {booking.paymentStatus === "paid"
                      ? "Paid"
                      : booking.paymentStatus === "failed"
                        ? "Payment failed"
                        : "Payment pending"}
                  </span>
                </div>

                <p>
                  <strong>📍 Venue:</strong>{" "}
                  {booking.event?.venue || "Venue to be confirmed"}
                </p>

                <p>
                  <strong>📅 Date:</strong>{" "}
                  {booking.event?.date
                    ? new Date(booking.event.date).toLocaleDateString("en-GB")
                    : "To be confirmed"}
                </p>

                <p>
                  <strong>🎟 Quantity:</strong> {booking.quantity}
                </p>

                <p className="ticket-price">
                  ₦{Number(booking.totalPrice || 0).toLocaleString("en-GB")}
                </p>

                <div className="ticket-code">
                  <strong>Individual Ticket References</strong>

                  {tickets.length > 0 ? (
                    tickets.map((ticket, index) => (
                      <p key={ticket._id || ticket.ticketCode}>
                        Ticket {index + 1}: {ticket.ticketCode}
                      </p>
                    ))
                  ) : (
                    <p>
                      Individual ticket references are unavailable for this
                      older booking.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="view-ticket-btn"
                  onClick={() => navigate(`/ticket/${booking._id}`)}
                >
                  View Tickets
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MyBookings;
