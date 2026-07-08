// src/components/StatCard.jsx
// 💡 What is this file?
// A reusable summary card for the dashboard.
// Instead of copy-pasting the same card HTML 4 times, we make a component
// and just pass different props (title, value, color, icon) each time.
// Analogy: Like a template — same shape, different content.

export default function StatCard({ title, value, icon, colorClass }) {
  return (
    <div className={`rounded-xl p-5 border ${colorClass} bg-gray-800/60`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{title}</p>
    </div>
  );
}
