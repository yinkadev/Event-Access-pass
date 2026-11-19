import { Link } from "react-router-dom";
import "./hero.css";

function Hero() {
  return (
    <section className="home-hero">
      <div className="home-hero-overlay" />
      <div className="home-hero-inner">
        <div className="home-hero-copy">
          <span className="hero-eyebrow">YOUR NEXT GREAT EXPERIENCE STARTS HERE</span>
          <h1>Make room for <span>memorable</span> moments.</h1>
          <p>
            Discover concerts, conferences, workshops and unforgettable experiences.
            Find your event and secure your ticket in just a few clicks.
          </p>
          <div className="home-hero-actions">
            <Link to="/events" className="hero-primary-link">Explore events <span aria-hidden="true">→</span></Link>
            <Link to="/create-event" className="hero-secondary-link">Host an event</Link>
          </div>
          <div className="hero-proof">
            <span><strong>Discover</strong> events worth attending</span>
            <span><strong>Book</strong> in a few simple steps</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Live event audience">
          <div className="hero-visual-card">
            <span className="visual-card-label">THE EXPERIENCE</span>
            <strong>Find your people.<br />Feel the moment.</strong>
            <span className="visual-card-bottom">Discover something happening near you <b>↗</b></span>
          </div>
        </div>
      </div>
      <div className="hero-bottom-line">
        <span>LIVE EXPERIENCES</span><span>·</span><span>COMMUNITY</span><span>·</span><span>DISCOVERY</span>
      </div>
    </section>
  );
}

export default Hero;
