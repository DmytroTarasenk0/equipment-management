# MedEquip - Medical Equipment Management System

A full-stack, responsive web application designed to track and manage the lifecycle and maintenance statuses of medical equipment. Originally conceived as a university laboratory project for the "WEB-oriented technologies" course, this application has been fully rewritten and modernised into a TypeScript monorepo to serve as a comprehensive portfolio piece.

## Features

- **Role-Based Access Control (RBAC):** Distinct permissions for Admins, Medics, and Engineers.
- **Interactive Dashboard:** Adaptive grid layout for viewing the equipment catalogue and current statuses.
- **Issue Tracking:** Medical staff can instantly report faulty equipment, automatically flagging it with a "Warning" status.
- **Maintenance Logging:** Engineers can submit detailed maintenance reports and update the operational status of machines.
- **Secure Authentication:** JWT-based login system with refresh token capabilities.
- **API Documentation:** Auto-generated interactive Swagger UI documentation.

## Tech Stack

**Backend (REST API):**

- Node.js & Express.js
- TypeScript
- Sequelize (ORM connected to Microsoft SQL Server)
- JSON Web Tokens (JWT) & bcryptjs for security
- express-validator & express-rate-limit

**Frontend (Client):**

- React 18 (Vite)
- TypeScript
- React Router v6
- Axios (with global interceptors for auth)
- Pure CSS (Custom responsive flexbox/grid architecture)

## Local Setup & Installation

### Prerequisites

- Node.js
- Microsoft SQL Server

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```
cd backend
npm install
```

Create a `.env` file in the `backend` root and configure environment variables:

```
PORT=3000
DB_SERVER=localhost
DB_USER=db_username
DB_PASSWORD=db_password
DB_DATABASE=equipment_db
JWT_SECRET=super_secret_jwt_key
```

Start the development server:

```
npm run dev
```

> _The API will be available at http://localhost:3000. You can view the Swagger documentation at http://localhost:3000/api-docs._

### 2. Frontend Setup

Open a new terminal window, navigate to the frontend directory, and install dependencies:

```
cd frontend
npm install
```

Start the Vite development server:

```
npm run dev
```

> _The React application will be available at http://localhost:5173. API requests are automatically proxied to port 3000._

## Default User Roles for Testing

Once the database is synchronised, you can register new users to test the following roles:

- **Admin:** Can add new equipment to the catalogue.
- **Medic:** Can view equipment and report issues.
- **Engineer:** Can view equipment, perform maintenance, and update statuses.

> \*On the frontend, only login is available. Please register via the direct endpoints."
