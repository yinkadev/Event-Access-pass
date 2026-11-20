
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  if (!localStorage.getItem("token")) {
    return (
      <main className="dashboard-page">
        <h1>Your AccessPass dashboard</h1>
        <p>Please log in to view your account.</p>
        <button onClick={() => navigate("/login", { state: { from: "/dashboard" } })}>
          Log in
        </button>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <span className="dashboard-eyebrow">YOUR ACCESSPASS</span>
      <h1>Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : " back"}.</h1>
      <p className="dashboard-intro">
        Manage your event experiences and keep your bookings close at hand.
      </p>

      <div className="dashboard-actions">
        <Link to="/events">
          <span>✦</span>
          <strong>Explore events</strong>
          <small>Find your next experience</small>
        </Link>

        <Link to="/my-bookings">
          <span>▤</span>
          <strong>My bookings</strong>
          <small>View reservations and tickets</small>
        </Link>

        {user?.role === "admin" && (
          <Link to="/create-event">
            <span>＋</span>
            <strong>Create an event</strong>
            <small>Publish a new experience</small>
          </Link>
        )}

        {user?.role === "admin" && (
          <Link to="/manage-events">
            <span>⚙</span>
            <strong>Manage events</strong>
            <small>Edit, cancel or delete events</small>
          </Link>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
