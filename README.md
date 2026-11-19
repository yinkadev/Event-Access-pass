# AccessPass

AccessPass is an event discovery and ticket-booking application built with React, Vite, Express, Node.js and MongoDB.

## Requirements

- Node.js 20.19+ (Node.js 22+ recommended)
- npm
- A MongoDB database (local or MongoDB Atlas)

## Setup

### 1. Configure the backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and set your own values:

- `MONGO_URI`: your MongoDB connection string
- `JWT_SECRET`: a long, private random string
- `PORT`: optional; defaults to `2000`
- `CLIENT_URL`: optional frontend origin; defaults to permissive development CORS

Start the API:

```bash
npm run dev
```

The health endpoint is `http://localhost:2000/`.

### 2. Configure the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`. If the API runs elsewhere, copy `client/.env.example` to `client/.env` and set `VITE_API_URL` to the API base URL, including `/api`.

## Main application flows

1. Register an account and log in.
2. Browse events at `/events` and open an event's details.
3. Select **Book Now**. You must be logged in; after a successful booking you are taken to **My Bookings**.
4. Open a booking to view its reference and download a PDF summary.
5. A QR admission code is only displayed when `paymentStatus` is `paid`.
6. An administrator can create events and check in paid tickets. The check-in endpoint is protected by the admin role.

## Important current limitation

A payment gateway is not connected yet. New bookings are therefore created with `paymentStatus: pending`; they reserve ticket inventory but are not valid for admission. Do not mark bookings as paid manually in production. The payment confirmation/webhook flow is a separate implementation step.

## Security

Never commit or share `.env` files. Keep MongoDB credentials and `JWT_SECRET` private. If credentials were previously included in a shared ZIP, rotate them before using the application again.

## Testing checklist

- Register a new user and log in.
- Browse the events list and search for an event.
- Open an event detail page and try booking while logged out; confirm the app sends you to login and returns you to the event after login.
- Book an event while logged in; confirm the booking appears in My Bookings with a pending payment status.
- Try an invalid quantity through the API (0, negative, decimal or greater than 10); it should be rejected.
- Confirm the available ticket count decreases after a successful booking and does not become negative.
- Confirm an unpaid booking is not presented as valid for admission.
- With an admin account and a paid test booking, verify the ticket and use the admin check-in action. A second check-in attempt should be rejected.
