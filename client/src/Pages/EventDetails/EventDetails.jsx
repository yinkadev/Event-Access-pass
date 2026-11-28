
import "./EventDetails.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const maxQuantity = Math.min(
    10,
    Math.max(0, Number(event?.ticketsAvailable) || 0)
  );

  const totalPrice = Number(event?.price || 0) * quantity;

  useEffect(() => {
    let isMounted = true;

    const fetchEvent = async () => {
      setPageLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get(`/events/${id}`);

        if (isMounted) {
          setEvent(response.data.event);
          setQuantity(1);
        }
      } catch (error) {
        console.error("Unable to load event:", error);

        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message ||
              "Unable to load this event. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    };

    fetchEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const decreaseQuantity = () => {
    setQuantity((previous) => Math.max(1, previous - 1));
    setErrorMessage("");
  };

  const increaseQuantity = () => {
    setQuantity((previous) =>
      Math.min(maxQuantity, previous + 1)
    );
    setErrorMessage("");
  };

  const handleQuantityChange = (value) => {
    if (value === "") {
      setQuantity("");
      return;
    }

    const selectedQuantity = Number(value);

    if (!Number.isInteger(selectedQuantity)) {
      return;
    }

    setQuantity(
      Math.min(maxQuantity, Math.max(1, selectedQuantity))
    );

    setErrorMessage("");
  };

  const handleBooking = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: { from: `/events/${id}` },
      });
      return;
    }

    if (!event?._id) {
      setErrorMessage(
        "Event details are not available. Please refresh and try again."
      );
      return;
    }

    if (maxQuantity < 1) {
      setErrorMessage("Sorry, this event is sold out.");
      return;
    }

    if (
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1 ||
      Number(quantity) > maxQuantity
    ) {
      setErrorMessage(
        `Please select between 1 and ${maxQuantity} tickets.`
      );
      return;
    }

    try {
      setBookingLoading(true);

      const response = await api.post(
        `/bookings/${event._id}`,
        { quantity: Number(quantity) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(
        response.data.message || "Booking created successfully."
      );

      navigate("/my-bookings", {
        state: { bookingSuccess: true },
      });
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

  if (pageLoading) {
    return <h2>Loading event...</h2>;
  }

  if (!event) {
    return (
      <section className="event-details">
        <p role="alert">
          {errorMessage || "Event not found."}
        </p>
      </section>
    );
  }

  return (
    <section className="event-details">
      <img
        src={event.image}
        alt={event.title}
        className="details-image"
      />

      <div className="details-content">
        <h1>{event.title}</h1>

        <p className="details-description">
          {event.description}
        </p>

        <div className="details-info">
          <p>
            <strong>📍 Venue:</strong> {event.venue}
          </p>

          <p>
            <strong>📅 Date:</strong>{" "}
            {new Date(event.date).toLocaleDateString("en-GB")}
          </p>

          <p className="price">
            ₦{Number(event.price).toLocaleString("en-NG")}
            <span className="per-ticket"> per ticket</span>
          </p>

          <p>
            <strong>🎟 Tickets Left:</strong>{" "}
            {event.ticketsAvailable}
          </p>
        </div>

        {maxQuantity > 0 && (
          <div className="ticket-quantity">
            <label htmlFor="ticket-quantity">
              Number of tickets
            </label>

            <div className="quantity-selector">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={bookingLoading || Number(quantity) <= 1}
                aria-label="Decrease ticket quantity"
              >
                −
              </button>

              <input
                id="ticket-quantity"
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) =>
                  handleQuantityChange(e.target.value)
                }
                disabled={bookingLoading}
              />

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={
                  bookingLoading ||
                  Number(quantity) >= maxQuantity
                }
                aria-label="Increase ticket quantity"
              >
                +
              </button>
            </div>

            <p className="quantity-hint">
              You can book up to {maxQuantity} ticket
              {maxQuantity === 1 ? "" : "s"}.
            </p>

            <div className="booking-total">
              <span>Total price:</span>
              <strong>
                ₦{totalPrice.toLocaleString("en-NG")}
              </strong>
            </div>
          </div>
        )}

        {errorMessage && (
          <p
            className="booking-feedback booking-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p
            className="booking-feedback booking-success"
            role="status"
          >
            {successMessage}
          </p>
        )}

        <button
          type="button"
          className="book-btn"
          onClick={handleBooking}
          disabled={bookingLoading || maxQuantity < 1}
        >
          {bookingLoading
            ? "Booking..."
            : maxQuantity < 1
              ? "Sold Out"
              : `Book ${quantity} Ticket${Number(quantity) === 1 ? "" : "s"}`}
        </button>
      </div>
    </section>
  );
}

export default EventDetails;
