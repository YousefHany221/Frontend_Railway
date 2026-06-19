// src/pages/parent/ParentDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParentLayout from "../../components/parentLayout";
import { parentService } from "../../api/parent";

const statusStyle = {
  verified: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  missing: "bg-red-100 text-red-600",
};

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "My Children Count", value: 0, color: "bg-blue-500", textColor: "text-white", icon: "👶" },
    { label: "Verified Children", value: 0, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
    { label: "Pending Scan", value: 0, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await parentService.getMyChildren();
        const childList = data ?? [];
        setChildren(childList);

        const total = childList.length;
        const verified = childList.filter(c => c.status?.toLowerCase() === 'verified').length;
        const pending = childList.filter(c => c.status?.toLowerCase() === 'pending').length;

        setStats([
          { label: "My Children Count", value: total, color: "bg-blue-500", textColor: "text-white", icon: "👶" },
          { label: "Verified Children", value: verified, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
          { label: "Pending Scan", value: pending, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <ParentLayout>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-4 flex items-center justify-between shadow-sm`}>
            <div>
              <p className={`text-xs ${s.textColor === 'text-white' ? 'text-blue-100' : 'text-gray-400'} font-medium`}>{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.textColor}`}>{s.value}</p>
            </div>
            <span className="text-2xl">{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Children Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">My Children</h2>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-center text-gray-400 text-sm">Loading dashboard data...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Child Name", "Mother Name", "Status", "Last Check", "Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {children.map((child, i) => (
                <tr key={child.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {(child.name_en || child.name_ar || child.name || "C").charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{child.name_en || child.name_ar || child.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{child.mother_name || "-"}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[child.status?.toLowerCase()] || "bg-gray-100 text-gray-600"}`}>
                      ● {child.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-400">
                    {child.updated_at ? child.updated_at.split('T')[0] : (child.last_check || 'Just now')}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => navigate(`/parent/child-details/${child.id}`)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold transition"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
              {children.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                    No children registered under your account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </ParentLayout>
  );
}