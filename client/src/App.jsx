import { Routes, Route } from "react-router-dom";
import Navbar from "./Compnents/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Events from "./Pages/Event/Events";
import EventDetails from "./Pages/EventDetails/EventDetails";
import Dashboard from "./Pages/Dashboard/Dashboard";
import MyBookings from "./Pages/MyBooking/MyBookings";
import CreateEvent from "./Pages/CreateEvents/CreateEvent";
import Ticket from "./Pages/Ticket/Ticket";
import VerifyTicket from "./Pages/VerifyTicket/VerifyTicket";
import NotFound from "./Pages/NotFound/NotFound";
import Footer from "./Compnents/Footer/footer";
import About from "./Pages/About/About.jsx";
import ManageEvents from "./Pages/ManageEvents/ManageEvents";
import ManageBookings from "./Pages/ManageBookings/ManageBookings";
import QRScanner from "./Pages/QRScanner/QRScanner";
import Payment from "./Pages/Payment/Payment";
import Contact from "./Pages/Contact/Contact";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/verify-ticket/:ticketCode" element={<VerifyTicket />} />
        <Route path="/about" element={<About />} />
        <Route path="/manage-events" element={<ManageEvents />} />
        <Route path="/manage-bookings" element={<ManageBookings />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
    
      </Routes>

        <Footer />
    </>
  );
}

export default App;
