import Hero from "../../Compnents/Hero/hero";
import FeaturedEvents from "../../Compnents/FeaturedEvents/FeaturedEvents";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <Hero />
      <section className="home-benefits" aria-label="Why use AccessPass">
        <div><span>01</span><strong>Discover</strong><p>Find events and experiences that interest you.</p></div>
        <div><span>02</span><strong>Book simply</strong><p>Reserve your place without the hassle.</p></div>
        <div><span>03</span><strong>Go digital</strong><p>Keep your ticket details ready when you arrive.</p></div>
      </section>
      <FeaturedEvents />


<section className="home-about">
  <div className="home-about-content">
    <span>GET TO KNOW US</span>

    <h2>
      More than tickets.
      <br />
      Access to experiences.
    </h2>

    <p>
      AccessPass makes discovering events and booking
      tickets simple. Find experiences that inspire you,
      secure your tickets and make unforgettable memories.
    </p>

    <Link to="/about" className="home-about-button">
      Discover AccessPass
    </Link>
  </div>
</section>
<section className="home-contact">
  <div className="home-contact-content">
    <span>WE'RE HERE TO HELP</span>
    <h2>Have a question?</h2>
    <p>
      Need help with a booking, a ticket or finding your next
      experience? Our team is ready to hear from you.
    </p>
    <Link to="/contact" className="home-contact-button">
      Get in Touch
    </Link>
  </div>
</section>


<section className="home-faq">
  <div className="home-faq-heading">
    <span>NEED SOME HELP?</span>
    <h2>Got Questions?</h2>
    <p>Here are some quick answers to help you get started with AccessPass.</p>
  </div>

  <div className="home-faq-list">
    <div className="home-faq-item">
      <h3>How do I book an event?</h3>
      <p>Create an account, browse available events, select your preferred event and follow the booking instructions.</p>
    </div>

    <div className="home-faq-item">
      <h3>How do I receive my ticket?</h3>
      <p>Once your payment is confirmed, your ticket will be available in My Bookings with a QR code and PDF download.</p>
    </div>

    <div className="home-faq-item">
      <h3>Can I use my ticket more than once?</h3>
      <p>No. Each ticket can only be used once. After successful check-in, it cannot be used for another admission.</p>
    </div>
  </div>

  <div className="home-faq-link">
    <Link to="/faq">View All FAQs →</Link>
  </div>
</section>

    </main>
    
  );
}

export default Home;
