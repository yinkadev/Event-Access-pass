import "./EventDetails.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      setPageLoading(true);
      setErrorMessage("");
      try {
        const response = await api.get(`/events/${id}`);
        if (isMounted) setEvent(response.data.event);
      } catch (error) {
        console.error("Unable to load event:", error);
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "Unable to load this event. Please try again."
          );
        }
      } finally {
        if (isMounted) setPageLoading(false);
      }
    };

    fetchEvent();
    return () => { isMounted = false; };
  }, [id]);

  const handleBooking = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    if (!event?._id) {
      setErrorMessage("Event details are not available. Please refresh and try again.");
      return;
    }

    if (event.ticketsAvailable < 1) {
      setErrorMessage("Sorry, this event is sold out.");
      return;
    }

    try {
      setBookingLoading(true);
      const response = await api.post(
        `/bookings/${event._id}`,
        { quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(response.data.message || "Booking created successfully.");
      navigate("/my-bookings", { state: { bookingSuccess: true } });
    } catch (error) {
      console.error("Booking request failed:", error);
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "Booking failed. Please check your connection and try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (pageLoading) return <h2>Loading event...</h2>;
  if (!event) return <section className="event-details"><p role="alert">{errorMessage || "Event not found."}</p></section>;

  return (
    <section className="event-details">
      <img src={event.image} alt={event.title} className="details-image" />
      <div className="details-content">
        <h1>{event.title}</h1>
        <p className="details-description">{event.description}</p>
        <div className="details-info">
          <p><strong>📍 Venue:</strong> {event.venue}</p>
          <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p className="price">₦{Number(event.price).toLocaleString()}</p>
          <p><strong>🎟 Tickets Left:</strong> {event.ticketsAvailable}</p>
        </div>

        {errorMessage && <p className="booking-feedback booking-error" role="alert">{errorMessage}</p>}
        {successMessage && <p className="booking-feedback booking-success" role="status">{successMessage}</p>}

        <button
          type="button"
          className="book-btn"
          onClick={handleBooking}
          disabled={bookingLoading || event.ticketsAvailable < 1}
        >
          {bookingLoading ? "Booking..." : event.ticketsAvailable < 1 ? "Sold Out" : "Book Now"}
        </button>
      </div>
    </section>
  );
}

export default EventDetails;
