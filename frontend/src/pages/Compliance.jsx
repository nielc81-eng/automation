// src/pages/Compliance.jsx
// 💡 What is this file?
// Full compliance records management. Lists all records and lets admins
// add new ones through a modal form.
// Calls GET /api/compliance and POST /api/compliance.

import { useState, useEffect } from 'react';
import api from '../api/axios';

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

const emptyForm = {
  title: '',
  description: '',
  status: 'PENDING',
  dueDate: '',
  departmentId: '',
  assignedToId: '',
};

export default function Compliance() {
  const [records, setRecords] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function fetchAll() {
    try {
      const [recRes, deptRes, userRes] = await Promise.all([
        api.get('/compliance'),
        api.get('/departments'),
        api.get('/auth/users').catch(() => ({ data: { data: [] } })),
      ]);
      setRecords(recRes.data.data);
      setDepartments(deptRes.data.data);
      setUsers(userRes.data.data);
    } catch {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAll(); }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/compliance', form);
      setShowModal(false);
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create record.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Compliance Records</h2>
          <p className="text-gray-400 text-sm mt-1">View and manage all compliance tasks.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          + Add Record
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50">
              <tr>
                {['Title', 'Description', 'Department', 'Status', 'Due Date'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 animate-pulse">Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No records yet. Add one!</td></tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{r.title}</td>
                    <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{r.description || '—'}</td>
                    <td className="px-6 py-4 text-gray-400">{r.department?.name || '—'}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-4 text-gray-400">{new Date(r.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Add Compliance Record</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
                <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Q2 Security Audit"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Optional details..."
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Due Date</label>
                  <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Department</label>
                <select name="departmentId" value={form.departmentId} onChange={handleChange} required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select department...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Assigned To (User ID)</label>
                <input name="assignedToId" value={form.assignedToId} onChange={handleChange} required placeholder="Paste a User ID from the database"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500" />
                <p className="text-xs text-gray-500 mt-1">You can find your User ID in the Postman register/login response.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                  {submitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
