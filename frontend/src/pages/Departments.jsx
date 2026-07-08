// src/pages/Departments.jsx
// 💡 What is this file?
// Lets admins view and add departments.
// Calls GET /api/departments to list them, POST /api/departments to add one.

import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchDepartments() {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch {
      setError('Failed to load departments.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchDepartments(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/departments', { name: newName.trim() });
      setNewName('');
      setSuccess('Department added successfully!');
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add department.');
    } finally {
      setAdding(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Departments</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your organization's departments.</p>
      </div>

      {/* Add Department Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="text-base font-semibold text-white mb-4">Add New Department</h3>
        {error && <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        {success && <div className="bg-green-900/30 border border-green-700 text-green-400 text-sm rounded-lg px-4 py-3 mb-4">{success}</div>}
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Finance, Legal, Operations"
            className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={adding}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {adding ? 'Adding...' : '+ Add'}
          </button>
        </form>
      </div>

      {/* Departments List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold text-white">All Departments ({departments.length})</h3>
        </div>
        {loading ? (
          <div className="px-6 py-8 text-center text-gray-500 animate-pulse">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {departments.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">No departments yet. Add one above!</div>
            ) : (
              departments.map((d) => (
                <div key={d.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-900/50 border border-indigo-700 flex items-center justify-center text-indigo-400 text-sm font-bold">
                      {d.name[0]}
                    </div>
                    <span className="text-white font-medium">{d.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {d._count?.records ?? 0} records
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
