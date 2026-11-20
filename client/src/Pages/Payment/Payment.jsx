
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "./Payment.css";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    api.get(`/bookings/${id}`)
      .then(({ data }) => {
        if (active) setBooking(data.booking);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message || "Unable to load this booking."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handlePayment = async (simulateFailure = false) => {
    if (paying || !booking) return;

    setPaying(true);
    setError("");

    try {
      if (simulateFailure) {
        setError("Demo payment failed. No money was charged. You can try again.");
        return;
      }

      await api.patch(`/bookings/${id}/demo-payment`);

      navigate(`/ticket/${id}`, {
        state: { paymentSuccess: true },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Payment could not be completed."
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <main className="payment-page"><h2>Loading checkout...</h2></main>;
  }

  if (error && !booking) {
    return (
      <main className="payment-page">
        <p role="alert">{error}</p>
        <Link to="/my-bookings">Back to my bookings</Link>
      </main>
    );
  }

  if (!booking) {
    return <main className="payment-page"><p>Booking not found.</p></main>;
  }

  if (booking.paymentStatus === "paid") {
    return (
      <main className="payment-page">
        <div className="payment-card">
          <h1>Payment already completed</h1>
          <p>This booking has already been paid for.</p>
          <button onClick={() => navigate(`/ticket/${id}`)}>
            View your ticket
          </button>
        </div>
      </main>
    );
  }

  const event = booking.event || {};

  return (
    <main className="payment-page">
      <div className="payment-card">
        <p className="payment-eyebrow">ACCESSPASS DEMO CHECKOUT</p>
        <h1>Complete your booking</h1>
        <p className="payment-description">
          Review your booking and simulate a payment. No real money will be charged.
        </p>

        <div className="payment-summary">
          <h2>{event.title || "Event booking"}</h2>
          <p><strong>Venue:</strong> {event.venue || "To be confirmed"}</p>
          <p><strong>Quantity:</strong> {booking.quantity}</p>
          <p><strong>Booking reference:</strong> {booking.ticketCode}</p>
          <div className="payment-total">
            <span>Total amount</span>
            <strong>₦{Number(booking.totalPrice || 0).toLocaleString("en-NG")}</strong>
          </div>
        </div>

        <div className="demo-payment-notice">
          <strong>Demo payment only</strong>
          <p>This is a simulated transaction for testing AccessPass. No bank card or real payment is required.</p>
        </div>

        {error && <p className="payment-error" role="alert">{error}</p>}

        <button
          className="pay-now-btn"
          onClick={() => handlePayment(false)}
          disabled={paying}
        >
          {paying ? "Processing payment..." : "Complete demo payment"}
        </button>

        <button
          className="payment-fail-btn"
          onClick={() => handlePayment(true)}
          disabled={paying}
        >
          Simulate failed payment
        </button>

        <p className="payment-back">
          <Link to="/my-bookings">Back to my bookings</Link>
        </p>
      </div>
    </main>
  );
}

export default Payment;
