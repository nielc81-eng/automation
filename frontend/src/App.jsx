// src/App.jsx
// 💡 What is this file?
// This is the root of our React application.
// It defines all the URL routes and wraps protected pages with ProtectedRoute.
// Analogy: Like a building directory — tells you which room is on which floor.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

import Login       from './pages/Login';
import Register    from './pages/Register';
import Dashboard   from './pages/Dashboard';
import Compliance  from './pages/Compliance';
import Departments from './pages/Departments';
import EmailLogs   from './pages/EmailLogs';

// DashboardLayout wraps all /dashboard/* pages with the sidebar
function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout><Dashboard /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/compliance"
          element={
            <ProtectedRoute>
              <DashboardLayout><Compliance /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/departments"
          element={
            <ProtectedRoute>
              <DashboardLayout><Departments /></DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/emaillogs"
          element={
            <ProtectedRoute>
              <DashboardLayout><EmailLogs /></DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
