import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext';
import './index.css'
import App from './App.tsx'

import axios from 'axios';

axios.defaults.baseURL = "https://100x-brainly-backend.vercel.app";
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
)
