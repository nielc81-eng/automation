// src/pages/Dashboard.jsx
// 💡 What is this file?
// The main dashboard page. It shows:
// 1. Four summary stat cards (Total, Completed, Pending, Overdue)
// 2. A full compliance records table
// All data comes from the GET /api/reports/weekly endpoint.

import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';

function StatusBadge({ status }) {
  const styles = {
    COMPLETED: 'bg-green-900/50 text-green-400 border-green-700',
    PENDING:   'bg-yellow-900/50 text-yellow-400 border-yellow-700',
    OVERDUE:   'bg-red-900/50 text-red-400 border-red-700',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${styles[status] || ''}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await api.get('/reports/weekly');
        setReport(res.data.data);
      } catch (err) {
        setError('Failed to load report. Make sure you are logged in as an Admin.');
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400 text-lg animate-pulse">Loading report...</div>
    </div>
  );

  if (error) return (
    <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl p-6">{error}</div>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-1">
          Weekly Compliance Report &mdash; {new Date(report.period.start).toLocaleDateString()} to {new Date(report.period.end).toLocaleDateString()}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Records"    value={report.stats.total}     icon="📋" colorClass="border-gray-600" />
        <StatCard title="Completed"        value={report.stats.completed} icon="✅" colorClass="border-green-700" />
        <StatCard title="Pending"          value={report.stats.pending}   icon="⏳" colorClass="border-yellow-700" />
        <StatCard title="Overdue"          value={report.stats.overdue}   icon="🚨" colorClass="border-red-700" />
      </div>

      {/* Records Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">Compliance Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50">
              <tr>
                {['Title', 'Department', 'Assignee', 'Status', 'Due Date'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {report.records.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No records for this period.</td></tr>
              ) : (
                report.records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{r.title}</td>
                    <td className="px-6 py-4 text-gray-400">{r.department}</td>
                    <td className="px-6 py-4 text-gray-400">{r.assignee}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-4 text-gray-400">{new Date(r.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
