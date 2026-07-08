// src/components/ProtectedRoute.jsx
// 💡 What is this file?
// This is a "guard" component. It wraps any page that requires login.
// If there's no token in localStorage, it kicks the user back to the login page.
// Analogy: Like a bouncer at a VIP section — no wristband, no entry.

import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}
