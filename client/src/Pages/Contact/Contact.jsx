
import { useState } from "react";
import api from "../../services/api";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await api.post("/contact", formData);

      setSuccess(response.data.message || "Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "We couldn't send your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <span className="contact-eyebrow">WE'RE HERE TO HELP</span>
        <h1>Let's talk.</h1>
        <p>
          Have a question about an event, booking or ticket?
          Send us a message and our team will be happy to help.
        </p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <span className="contact-eyebrow">GET IN TOUCH</span>
          <h2>How can we help you?</h2>
          <p>
            Whether you need help with a booking or have a question
            about using AccessPass, we'd love to hear from you.
          </p>

          <div className="contact-info-item">
            <span>✉</span>
            <div>
              <strong>Email support</strong>
              <p>Send us your questions using the form.</p>
            </div>
          </div>

          <div className="contact-info-item">
            <span>◷</span>
            <div>
              <strong>Support hours</strong>
              <p>We'll get back to you as soon as possible.</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send us a message</h2>
          <p>Fill in the details below and we'll be in touch.</p>

          {success && <div className="contact-success">{success}</div>}
          {error && <div className="contact-error">{error}</div>}

          <label htmlFor="contact-name">Full name</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <label htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What is your enquiry about?"
            required
          />

          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us how we can help..."
            rows="6"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending message..." : "Send message"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Contact;
