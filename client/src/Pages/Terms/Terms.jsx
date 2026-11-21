
import "./Terms.css";

function Terms() {
  return (
    <main className="terms-page">
      <section className="terms-hero">
        <span>ACCESSPASS POLICIES</span>
        <h1>Terms & Conditions</h1>
        <p>
          Please read these terms carefully before using AccessPass
          to discover events and book tickets.
        </p>
      </section>

      <section className="terms-content">
        <p className="terms-updated">
          Last updated: November 2026
        </p>

        <div className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to AccessPass. These Terms & Conditions explain
            the rules for accessing and using our event discovery
            and ticketing platform. By using AccessPass, you agree
            to these terms.
          </p>
        </div>

        <div className="terms-section">
          <h2>2. User Accounts</h2>
          <p>
            You may need to create an account to book and manage
            tickets. You are responsible for providing accurate
            information, keeping your login details secure and
            notifying us if you suspect unauthorised access to
            your account.
          </p>
        </div>

        <div className="terms-section">
          <h2>3. Event Information</h2>
          <p>
            Event descriptions, dates, venues, prices and other
            details are provided for informational purposes.
            Event organisers are responsible for the accuracy
            of the information they publish. Always review the
            event details before making a booking.
          </p>
        </div>

        <div className="terms-section">
          <h2>4. Bookings and Reservations</h2>
          <p>
            When you reserve a ticket, your booking is recorded
            in your account. A reservation does not automatically
            mean that admission has been confirmed. Your ticket
            becomes valid for admission only when the required
            payment is confirmed and the ticket is issued.
          </p>
        </div>

        <div className="terms-section">
          <h2>5. Payments</h2>
          <p>
            Where payment functionality is provided, you must
            follow the payment instructions displayed on the
            platform. The current AccessPass demonstration uses
            simulated payment functionality and does not process
            real financial transactions. A successful demo payment
            should not be treated as evidence of a real payment.
          </p>
        </div>

        <div className="terms-section">
          <h2>6. Tickets and QR Code Verification</h2>
          <p>
            Each issued ticket contains a unique QR code used
            for verification at the event entrance. Tickets
            must not be copied, altered, shared for duplicate
            admission or used fraudulently. A ticket that has
            already been checked in cannot be used for another
            admission.
          </p>
        </div>

        <div className="terms-section">
          <h2>7. Cancellations and Refunds</h2>
          <p>
            Event cancellations, postponements, booking changes
            and refunds are subject to the applicable event
            organiser's policies and any relevant consumer
            protection laws. Please contact the organiser or
            AccessPass support for assistance.
          </p>
        </div>

        <div className="terms-section">
          <h2>8. Acceptable Use</h2>
          <p>
            You agree not to misuse the platform, attempt
            unauthorised access, interfere with its operation,
            submit false information, manipulate bookings or
            use tickets fraudulently.
          </p>
        </div>

        <div className="terms-section">
          <h2>9. Platform Availability</h2>
          <p>
            We aim to keep AccessPass available and functioning
            properly, but uninterrupted access cannot be
            guaranteed. Maintenance, technical problems or
            circumstances outside our control may temporarily
            affect the service.
          </p>
        </div>

        <div className="terms-section">
          <h2>10. Changes to These Terms</h2>
          <p>
            These terms may be updated as AccessPass develops.
            Updated terms will be published on this page.
            Continued use of the platform after changes are
            published means you have had an opportunity to
            review the updated terms.
          </p>
        </div>

        <div className="terms-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have questions about these Terms & Conditions,
            please contact us through our Contact Us page.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Terms;
