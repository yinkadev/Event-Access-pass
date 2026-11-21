
import { useState } from "react";
import { Link } from "react-router-dom";
import "./FAQ.css";

const faqItems = [
  {
    question: "What is AccessPass?",
    answer:
      "AccessPass is an event ticketing platform that helps you discover events, reserve tickets and manage your event bookings digitally.",
  },
  {
    question: "How do I book an event?",
    answer:
      "Create an account or log in, browse available events, select your preferred event and follow the booking instructions to reserve your ticket.",
  },
  {
    question: "Do I need an account to book an event?",
    answer:
      "Yes. You need to register or log in to AccessPass before making and managing your event bookings.",
  },
  {
    question: "How do I receive my ticket?",
    answer:
      "After booking and completing the payment process, your ticket becomes available through your My Bookings section. You can view your QR code and download your ticket as a PDF.",
  },
  {
    question: "When is my ticket confirmed?",
    answer:
      "A booking is initially recorded as pending. Your admission ticket becomes active only after payment is confirmed.",
  },
  {
    question: "What is the QR code on my ticket for?",
    answer:
      "Your QR code contains your ticket verification information. Present it at the event entrance so an authorised event administrator can scan and verify your ticket.",
  },
  {
    question: "Can I use the same ticket more than once?",
    answer:
      "No. Once your ticket has been successfully checked in, it cannot be used for another admission.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Booking cancellation depends on the event's applicable terms and the organiser's policy. Please contact support for assistance.",
  },
  {
    question: "What should I do if I have a problem with my booking?",
    answer:
      "Visit our Contact Us page and send us a message with your booking details. Our support team will get back to you.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="faq-page">
      <section className="faq-hero">
        <span>HELP CENTRE</span>
        <h1>Frequently Asked Questions</h1>
        <p>
          Find answers to common questions about discovering events,
          booking tickets and using AccessPass.
        </p>
      </section>

      <section className="faq-content">
        <div className="faq-heading">
          <span>NEED SOME HELP?</span>
          <h2>How can we help you?</h2>
          <p>Browse the questions below to find the information you need.</p>
        </div>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <div className="faq-item" key={index}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleQuestion(index)}
                aria-expanded={activeIndex === index}
              >
                <span>{item.question}</span>
                <span className="faq-icon">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </button>

              {activeIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h2>Still have questions?</h2>
          <p>Our team is happy to help you with any additional enquiries.</p>
          <Link to="/contact">Contact Us</Link>
        </div>
      </section>
    </main>
  );
}

export default FAQ;
