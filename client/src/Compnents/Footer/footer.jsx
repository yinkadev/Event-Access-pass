
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>Access<span>Pass</span></h2>
          <p>
            Discover exciting events, book your tickets
            and enjoy unforgettable experiences.
          </p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>
          <Link to="/">Home</Link>
          <Link to="/events">Events</Link>
          <Link to="/about">About Us</Link>
        </div>

        <div className="footer-links">
          <h3>Support</h3>
          <Link to="/contact">Contact Us</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>

        <div className="footer-links">
          <h3>Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} AccessPass.
          All rights reserved.
        </p>
        <p>Discover. Book. Experience.</p>
      </div>
    </footer>
  );
};

export default Footer;
