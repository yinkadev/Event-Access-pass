
import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./ManageBookings.css";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [ticketFilter, setTicketFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/admin/all");
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings
      .map((booking) => {
        const tickets = booking.tickets || [];

        const matchingTickets = tickets.filter((ticket) => {
          const searchTerm = search.toLowerCase();

          const attendeeName =
            booking.user?.name?.toLowerCase() || "";
          const attendeeEmail =
            booking.user?.email?.toLowerCase() || "";
          const eventTitle =
            booking.event?.title?.toLowerCase() || "";

          const matchesSearch =
            attendeeName.includes(searchTerm) ||
            attendeeEmail.includes(searchTerm) ||
            eventTitle.includes(searchTerm) ||
            ticket.ticketCode?.toLowerCase().includes(searchTerm);

          const matchesTicket =
            ticketFilter === "all" ||
            ticket.ticketStatus === ticketFilter;

          return matchesSearch && matchesTicket;
        });

        const matchesPayment =
          paymentFilter === "all" ||
          booking.paymentStatus === paymentFilter;

        return {
          ...booking,
          matchingTickets,
          matchesPayment,
        };
      })
      .filter(
        (booking) =>
          booking.matchesPayment &&
          booking.matchingTickets.length > 0
      );
  }, [bookings, search, paymentFilter, ticketFilter]);

  const paidCount = bookings.filter(
    (booking) => booking.paymentStatus === "paid"
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.paymentStatus === "pending"
  ).length;

  const checkedInCount = bookings.reduce(
    (total, booking) =>
      total +
      (booking.tickets || []).filter(
        (ticket) => ticket.checkedIn
      ).length,
    0
  );

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return `₦${Number(price || 0).toLocaleString("en-NG")}`;
  };

  return (
    <main className="manage-bookings-page">
      <div className="manage-bookings-header">
        <div>
          <p className="manage-bookings-eyebrow">ADMINISTRATION</p>
          <h1>Manage Bookings</h1>
          <p>View and monitor all event bookings on AccessPass.</p>
        </div>

        <button
          className="bookings-refresh-btn"
          onClick={fetchBookings}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh bookings"}
        </button>
      </div>

      <section className="booking-stats">
        <article className="booking-stat-card">
          <span>Total bookings</span>
          <strong>{bookings.length}</strong>
        </article>

        <article className="booking-stat-card">
          <span>Paid bookings</span>
          <strong>{paidCount}</strong>
        </article>

        <article className="booking-stat-card">
          <span>Pending payments</span>
          <strong>{pendingCount}</strong>
        </article>

        <article className="booking-stat-card">
          <span>Checked-in tickets</span>
          <strong>{checkedInCount}</strong>
        </article>
      </section>

      <section className="booking-management-panel">
        <div className="booking-filters">
          <input
            type="text"
            placeholder="Search attendee, event or ticket code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All payment statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={ticketFilter}
            onChange={(e) => setTicketFilter(e.target.value)}
          >
            <option value="all">All ticket statuses</option>
            <option value="active">Active</option>
            <option value="used">Used</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <p className="bookings-message">Loading bookings...</p>
        ) : error ? (
          <div className="bookings-error">
            <p>{error}</p>
            <button onClick={fetchBookings}>Try again</button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <p className="bookings-message">No bookings found.</p>
        ) : (
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Attendee</th>
                  <th>Event</th>
                  <th>Ticket code</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Ticket status</th>
                  <th>Check-in</th>
                  <th>Date booked</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) =>
                  booking.matchingTickets.map((ticket, index) => (
                    <tr key={ticket._id || ticket.ticketCode}>
                      <td>
                        <strong>
                          {booking.user?.name || "Unknown user"}
                        </strong>
                        <small>
                          {booking.user?.email || "No email available"}
                        </small>
                      </td>

                      <td>
                        <strong>
                          {booking.event?.title || "Event unavailable"}
                        </strong>
                        <small>
                          {booking.event?.venue || "Venue unavailable"}
                        </small>
                      </td>

                      <td className="booking-code">
                        {ticket.ticketCode}
                      </td>

                      <td>
                        {index + 1} of {booking.quantity}
                      </td>

                      <td>{formatPrice(booking.totalPrice)}</td>

                      <td>
                        <span
                          className={`booking-status ${booking.paymentStatus}`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`booking-status ${ticket.ticketStatus}`}
                        >
                          {ticket.ticketStatus}
                        </span>
                      </td>

                      <td>
                        {ticket.checkedIn ? (
                          <span className="checkin-yes">
                            Checked in
                          </span>
                        ) : (
                          <span className="checkin-no">
                            Not checked in
                          </span>
                        )}
                      </td>

                      <td>{formatDate(booking.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && (
          <p className="booking-results-count">
            Showing{" "}
            {filteredBookings.reduce(
              (total, booking) =>
                total + booking.matchingTickets.length,
              0
            )}{" "}
            tickets across {filteredBookings.length} bookings
          </p>
        )}
      </section>
    </main>
  );
}

export default ManageBookings;
