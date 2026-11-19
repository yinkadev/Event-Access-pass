# AccessPass – Event Discovery & Ticket Booking Platform

AccessPass is a full-stack event discovery and ticket-booking application that makes it easier for users to explore events, reserve tickets and manage their bookings. It also provides administrators with tools to create and manage events and verify tickets.

## Features

### User Features
- User registration and login.
- Browse and search available events.
- View individual event details.
- Book event tickets.
- View personal booking history.
- Access booking references and download PDF tickets.

### Admin Features
- Create and publish events.
- Edit existing event details.
- Cancel events while preserving booking records.
- Delete events that have no existing bookings.
- Verify tickets and manage event check-in.

### Ticket Management
- Unique ticket references.
- Ticket quantity validation.
- Automatic ticket inventory updates.
- Protection against overselling.
- Booking and payment status tracking.
- Ticket check-in protection against duplicate admission.

## Technologies Used

**Frontend**
- React
- Vite
- JavaScript
- CSS
- React Router
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

**Other Tools**
- Git and GitHub
- PDF ticket generation

## Project Structure

```text
accesspass/
├── client/
│   ├── public/
│   └── src/
│       ├── Compnents/
│       ├── Pages/
│       ├── context/
│       ├── services/
│       └── App.jsx
├── server/
│   ├── configs/
│   ├── Controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── .gitignore
└── README.md
```

## Requirements

- Node.js 20.19+ (Node.js 22+ recommended)
- npm
- MongoDB database (local or MongoDB Atlas)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/yinkadev/Event-Access-pass.git
cd Event-Access-pass
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder using `.env.example` as a guide.

Configure the following environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_secret_key
PORT=2000
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

`http://localhost:2000`

### 3. Set up the frontend

Open a second terminal from the main project folder:

```bash
cd client
npm install
npm run dev
```

The frontend normally runs at:

`http://localhost:5173`

If your API URL is configurable, set `VITE_API_URL` to:

`http://localhost:2000/api`

## Application Usage

1. Register a new account.
2. Log in to your AccessPass account.
3. Browse and search for available events.
4. View event details and select the number of tickets.
5. Complete a booking.
6. Access your bookings and download the available PDF ticket.
7. Administrators can create and manage events and verify eligible tickets.

## Booking and Payment Status

The payment gateway integration is still under development.

New bookings are currently created with a `pending` payment status. Ticket inventory is reserved when a booking is created, but pending bookings are not valid for admission.

Payment confirmation and webhook integration will be implemented as a separate feature.

## Current Development Status

AccessPass is actively being developed.

**Implemented**
- User authentication and authorisation.
- Event creation and browsing.
- Event search.
- Ticket booking and inventory management.
- Booking history.
- PDF ticket downloads.
- Event editing, cancellation and deletion backend endpoints.
- Ticket verification and check-in backend functionality.

**Planned Improvements**
- Complete the administrator event management interface.
- QR code generation and scanning.
- Payment gateway integration.
- Email booking confirmations and notifications.
- Additional testing and responsive design improvements.

## Security

- Never commit `.env` files or expose database credentials.
- Keep JWT secrets private.
- Use secure environment variables for production.
- Protect administrative routes with authentication and role-based authorisation.

## Testing Checklist

- Register and log in.
- Browse and search events.
- Create an event using an administrator account.
- Book tickets and check inventory updates.
- View bookings and download PDF tickets.
- Test event editing, cancellation and deletion.
- Verify that events with bookings cannot be permanently deleted.
- Test ticket verification and prevent duplicate check-ins.

## Author

**YinkaDev**

GitHub: [https://github.com/yinkadev](https://github.com/yinkadev)

---

*AccessPass – Discover events. Book experiences. Keep your tickets close.*