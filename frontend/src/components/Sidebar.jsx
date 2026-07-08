// src/components/Sidebar.jsx
// 💡 What is this file?
// The sidebar navigation shared across all dashboard pages.
// It reads the user's name from localStorage and shows navigation links.

import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard',             label: '📊 Dashboard'    },
  { to: '/dashboard/compliance',  label: '✅ Compliance'   },
  { to: '/dashboard/departments', label: '🏢 Departments'  },
  { to: '/dashboard/emaillogs',   label: '📧 Email Logs'   },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <aside className="w-64 min-h-screen bg-gray-900 flex flex-col border-r border-gray-700">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">⚡ ComplianceApp</h1>
        <p className="text-xs text-gray-400 mt-1">Automated Reporting</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <p className="text-sm text-white font-medium">{user.name || 'User'}</p>
            <p className="text-xs text-gray-400">{user.role || 'EMPLOYEE'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors text-left"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
