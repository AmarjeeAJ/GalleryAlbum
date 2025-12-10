# PicEra - Album Design & Collaboration System

## Project Overview
**PicEra** is a next-generation album design platform tailored to streamline the workflow between professional album designers (Editors) and their clients. It solves the critical "Client Need" for a seamless, interactive way to review, comment on, and approve photo album designs without sending large files back and forth via email.

The system provides a robust **Editor** for creating layouts and a **Client Portal** for reviewing pages, leaving specific comments, and tracking the approval status of the album.

## Key Features

###  For Clients
*   **Interactive Review**: View album spreads in a realistic flip-book or grid view.
*   **Feedback Loop**: Click anywhere on a page to leave specific comments for the designer.
*   **Approval Workflow**: Mark albums as "Changes Requested" or "Approved" to move the process forward.
*   **Mobile Responsive**: Review albums on any device.

###  For Editors (Designers)
*   **Project Dashboard**: Manage multiple albums, track statuses (`Draft`, `Client Review`, `Approved`), and organize uploads.
*   **Visual Album Builder**:
    *   **Manual Mode**: Full control over image placement, sizing, and styling.
    *   **Automated Mode**: Intelligent layouts based on image metadata.
*   **Collaboration Hub**: See client comments in real-time and mark them as resolved as you fix them.
*   **Export**: (Planned) Generate high-resolution print-ready files.

## Technical Stack

### Frontend (User Interface)
*   **Framework**: [React](https://react.dev/) (v19) via [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for rapid, responsive UI development.
*   **Routing**: React Router DOM (v7).
*   **State Management**: React Context API (AuthContext).
*   **HTTP Client**: Axios.
*   **Key Libraries**:
    *   `react-pageflip`: For the realistic album book-turning effect.

### Backend (API & Database)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (via Mongoose ODM).
*   **Authentication**: JWT (JSON Web Tokens) with Bcrypt for password hashing.
*   **File Storage**: Multer (Local storage/Cloud support).

## Project Structure

This project uses a standard MERN architecture split into two main directories:

*   **`/client`**: The React frontend application.
    *   `src/pages`: Main views (Dashboard, Editor, Login, Register).
    *   `src/components`: Reusable UI components.
    *   `src/context`: Global state (Authentication).
*   **`/server`**: The Express backend API.
    *   `models`: Mongoose schemas (User, Album).
    *   `controllers`: Request logic.
    *   `routes`: API endpoints.
    *   `middleware`: Auth verification and error handling.

## Getting Started

### Prerequisites
*   Node.js (v14+ recommended)
*   MongoDB installed locally or a MongoDB Atlas connection string.

### 1. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server/` root (or use the existing one) with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
npm run dev
```

### 2. Client Setup
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.
