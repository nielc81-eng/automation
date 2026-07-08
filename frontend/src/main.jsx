// src/main.jsx
// 💡 What is this file?
// The entry point of our React application. Vite boots the app from here.
// It mounts our <App /> component into the <div id="root"> in index.html.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
