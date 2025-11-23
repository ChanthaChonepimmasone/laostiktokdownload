import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  createdAt: string;
}

export interface Room {
  id: number;
  title: string;
  description: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  price: number;
  userId: number;
  username: string;
  createdAt: string;
}

const API_URL = 'https://backend.youware.com/api';

interface AppState {
  currentUser: User | null;
  userLocation: { lat: number; lng: number } | null;
  rooms: Room[];
  
  login: (credentials: any) => Promise<boolean>;
  logout: () => void;
  register: (data: any) => Promise<boolean>;
  updateProfile: (data: any) => Promise<boolean>;
  addRoom: (data: any) => Promise<boolean>;
  fetchRooms: () => Promise<void>;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      userLocation: null,
      rooms: [],

      fetchRooms: async () => {
        try {
          const res = await fetch(`${API_URL}/rooms`);
          if (res.ok) {
            const data = await res.json();
            set({ rooms: data });
          }
        } catch (e) {
          console.error("Failed to fetch rooms", e);
        }
      },

      login: async ({ email, password }) => {
        try {
          const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (res.ok) {
            const user = await res.json();
            set({ currentUser: user });
            return true;
          }
        } catch (e) {
          console.error(e);
        }
        return false;
      },

      logout: () => set({ currentUser: null }),

      register: async ({ username, email, password, bio }) => {
        try {
          const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, bio })
          });
          if (res.ok) {
            const user = await res.json();
            set({ currentUser: user });
            return true;
          }
        } catch (e) {
          console.error(e);
        }
        return false;
      },

      updateProfile: async (data) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        try {
          const res = await fetch(`${API_URL}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            const updatedUser = await res.json();
            set({ currentUser: updatedUser });
            return true;
          }
        } catch (e) {
          console.error(e);
        }
        return false;
      },

      addRoom: async (data) => {
        try {
          const res = await fetch(`${API_URL}/rooms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            const newRoom = await res.json();
            set((state) => ({ rooms: [newRoom, ...state.rooms] }));
            return true;
          }
        } catch (e) {
          console.error(e);
        }
        return false;
      },

      setUserLocation: (location) => set({ userLocation: location }),
    }),
    { name: 'room-finder-storage' }
  )
);
