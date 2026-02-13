# Academic Wellness Performance Platform

A professional, interactive, and user-friendly dashboard-based web application where students can track their academic performance and wellness activities.

## Features
- **Authentication**: Secure Login and Registration with JWT.
- **Academic Tracking**: Add subjects, marks, semester, and date. View performance in charts.
- **Wellness Tracking**: Log mood, sleep, and exercise. Track trends over time.
- **Dashboard**: Summary statistics and quick overview.
- **Responsive Design**: Professional layout with Sidebar and modern UI components.
- **Dark Mode**: Toggle between light and dark themes.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Recharts, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running (or a MongoDB Atlas URI)

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following content:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure
- `backend/`: Server-side code (API models, routes, controllers).
- `frontend/`: Client-side code (React components, pages, styles).

## Usage
1. Open the frontend URL (usually http://localhost:5173).
2. Register a new account.
3. Login to access the dashboard.
4. Use the sidebar to navigate between Dashboard, Academic, and Wellness modules.
