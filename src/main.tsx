import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext';
import './index.css'
import App from './App.tsx'
import { ConvexReactClient } from 'convex/react';
import { ConvexProvider } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)

import axios from 'axios';

axios.defaults.baseURL = "https://100x-brainly-backend.vercel.app"; // Production Mode
// axios.defaults.baseURL = "http://localhost:3001"; // Dev Mode
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(
  <ConvexProvider client={convex}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ConvexProvider>
)
