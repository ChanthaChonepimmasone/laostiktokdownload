# YOUWARE - Room Finder (React PWA)

This project is a React + Tailwind CSS application for finding rental rooms (Apartments, Condos, Houses, etc.). It features a map-based interface, user authentication, and a real backend using Cloudflare Workers and D1 Database.

## Project Overview

- **Type**: React PWA (Progressive Web App)
- **Stack**: React 18, TypeScript, Vite, Tailwind CSS, React Leaflet, Zustand
- **Backend**: Cloudflare Worker + D1 Database (SQLite)
- **State Management**: Zustand (persisted to localStorage + API sync)
- **Map**: Leaflet (via react-leaflet)
- **Styling**: Tailwind CSS

## Key Features

1.  **Map Interface**: Interactive map showing room locations.
2.  **Room Management**: Add new rooms (using current location), view details, filter by type.
3.  **User System**: Login/Signup, Profile management.
4.  **PWA**: Offline support via Service Worker.
5.  **Real Backend**: Data is stored in Youware Backend (D1 Database).

## Architecture

### Directory Structure
- `src/components/`: UI Components (Header, Sidebar, Map, Auth, Modals)
- `src/store/`: Zustand store (`useAppStore`) for global state and API calls
- `src/types/`: TypeScript definitions
- `backend/`: Cloudflare Worker backend code (Hono framework)

### Backend API
The backend is deployed at `https://backend.youware.com`.
- `GET /api/rooms`: Get all rooms
- `POST /api/rooms`: Add a room
- `POST /api/register`: Register user
- `POST /api/login`: Login user
- `PUT /api/users/:id`: Update user profile

### Database Schema (D1)
**Table: `rooms`**
- `id`: INTEGER PRIMARY KEY
- `title`: TEXT
- `description`: TEXT
- `type`: TEXT (apartment, condo, house, dormitory, other)
- `address`: TEXT
- `lat`: REAL
- `lng`: REAL
- `price`: REAL
- `rating`: REAL
- `user_id`: INTEGER (FK)
- `username`: TEXT

**Table: `users`**
- `id`: INTEGER PRIMARY KEY
- `username`: TEXT
- `email`: TEXT
- `password`: TEXT
- `bio`: TEXT

## Development Commands

- **Install**: `npm install`
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Deploy Backend**: `npm run deploy` (inside `backend/` directory)

## Colors (Tailwind Config)
- `primary`: #4A90E2 (Blue)
- `success`: #27AE60 (Green)
- `warning`: #F39C12 (Orange)
- `danger`: #E74C3C (Red)
