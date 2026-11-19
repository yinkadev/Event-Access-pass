
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <main className="about-page">

      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-tag">ABOUT ACCESSPASS</span>

          <h1>
            Every great experience
            <span> starts with a ticket.</span>
          </h1>

          <p>
            AccessPass makes discovering events and securing
            tickets simple. From concerts and conferences to
            special celebrations, we help connect people with
            experiences worth remembering.
          </p>

          <Link to="/events" className="about-cta">
            Explore Events
          </Link>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="about-intro">
        <div className="about-intro-image">
          <img
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000&auto=format&fit=crop"
            alt="People enjoying a live event"
          />
        </div>

        <div className="about-intro-content">
          <span className="about-tag">WHO WE ARE</span>

          <h2>
            Making every event
            <span> more accessible.</span>
          </h2>

          <p>
            AccessPass is an event discovery and ticketing
            platform designed to make attending events easier.
            We provide a convenient way for people to discover
            events, book tickets and manage their event
            experiences.
          </p>

          <p>
            Our goal is to make the journey from discovering
            an event to arriving at the venue straightforward,
            convenient and reliable.
          </p>
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="about-purpose">
        <div className="purpose-heading">
          <span className="about-tag">OUR PURPOSE</span>
          <h2>What drives AccessPass</h2>
          <p>
            We believe great experiences should be easier
            to discover and access.
          </p>
        </div>

        <div className="purpose-cards">

          <div className="purpose-card">
            <div className="purpose-icon">✦</div>
            <h3>Our Mission</h3>
            <p>
              To simplify event discovery and ticket booking
              by providing a convenient platform that brings
              event organisers and attendees together.
            </p>
          </div>

          <div className="purpose-card">
            <div className="purpose-icon">◎</div>
            <h3>Our Vision</h3>
            <p>
              To become a trusted destination for discovering
              and accessing memorable events, creating
              connections through shared experiences.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="about-how">
        <div className="purpose-heading">
          <span className="about-tag">HOW IT WORKS</span>
          <h2>Your next experience is just a few steps away.</h2>
          <p>
            Getting access to your favourite events is simple.
          </p>
        </div>

        <div className="how-cards">

          <div className="how-card">
            <span className="how-number">01</span>
            <h3>Discover</h3>
            <p>
              Explore available events and find experiences
              that interest you.
            </p>
          </div>

          <div className="how-card">
            <span className="how-number">02</span>
            <h3>Book</h3>
            <p>
              Select your event and complete your ticket
              booking through the platform.
            </p>
          </div>

          <div className="how-card">
            <span className="how-number">03</span>
            <h3>Experience</h3>
            <p>
              Access your ticket and present it at the venue
              for verification and entry.
            </p>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="about-bottom">
        <span className="about-tag">YOUR NEXT EXPERIENCE AWAITS</span>

        <h2>Don't just hear about it. Be there.</h2>

        <p>
          Discover something exciting and find your next
          unforgettable experience with AccessPass.
        </p>

        <Link to="/events" className="about-cta">
          Discover Events
        </Link>
      </section>

    </main>
  );
};

export default About;
