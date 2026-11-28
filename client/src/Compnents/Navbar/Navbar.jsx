
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("accesspass-auth-change"));
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">🎟️ AccessPass</NavLink>
      </div>

      <button
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
        <li><NavLink to="/about">About Us</NavLink></li>
        <li><NavLink to="/contact">Contact Us</NavLink></li>
        <li><NavLink to="/faq">FAQs</NavLink></li>

        {token && (
          <>
            <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        )}

        {!token && (
          <>
            <li><NavLink to="/login">Login</NavLink></li>
            <li>
              <NavLink to="/register" className="register-btn">
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
