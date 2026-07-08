// src/pages/EmailLogs.jsx
// 💡 What is this file?
// Shows the history of every automated email sent by n8n.
// Every time the n8n workflow runs successfully, it calls POST /api/emaillogs.
// This page displays all those logs by calling GET /api/emaillogs.

import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function EmailLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await api.get('/emaillogs');
        setLogs(res.data.data);
      } catch {
        setError('Failed to load email logs.');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Email Logs</h2>
        <p className="text-gray-400 text-sm mt-1">History of all automated weekly report emails sent by n8n.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">All Email Logs</h3>
          <span className="text-xs text-gray-500">{logs.length} total</span>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-gray-500 animate-pulse">Loading logs...</div>
        ) : error ? (
          <div className="px-6 py-8 text-center text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800/50">
                <tr>
                  {['Subject', 'Recipient', 'Status', 'Week Start', 'Week End', 'Sent At'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No email logs yet. Run the n8n workflow to generate the first one!
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{log.subject}</td>
                      <td className="px-6 py-4 text-gray-400">{log.recipient}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          log.status === 'SENT'
                            ? 'bg-green-900/50 text-green-400 border-green-700'
                            : 'bg-red-900/50 text-red-400 border-red-700'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{new Date(log.weekStart).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(log.weekEnd).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-gray-400">{new Date(log.sentAt).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
