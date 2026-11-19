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

    </main>
  );
}

export default Home;
