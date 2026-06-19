// src/pages/nurse/NurseDashboard.jsx
import { useEffect, useState } from "react";
import NurseLayout from "../../components/nurseLayout";

const statusStyle = {
  Verified: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Alerts: "bg-red-100 text-red-500",
};

export default function NurseDashboard() {
  const [children, setChildren] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Children Today", value: 0, color: "bg-blue-500", textColor: "text-white", icon: "👶" },
    { label: "Verified Children", value: 0, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
    { label: "Pending Verification", value: 0, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
    { label: "Verification Issues", value: 0, color: "bg-red-400", textColor: "text-white", icon: "⚠️" },
  ]);
  const [loading, setLoading] = useState(true);

  // 1. جلب البيانات وتحديث الكروت ديناميكياً بناءً على رد الـ API
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const token = localStorage.getItem("nbis_token"); // 🚀 توحيد مفتاح التوكن
        const response = await fetch("https://graduation-project-2026-nbis-backend-production.up.railway.app/api/nurse/dashboard", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok) {
          // تحديث قائمة أحدث الأطفال المسجلين في النظام
          setChildren(data.recent_children || data.children || []);

          // تحديث الإحصائيات الحية القادمة من NurseDashboardController
          if (data.stats) {
            setStats([
              { label: "Total Children Today", value: data.stats.total_today || 0, color: "bg-blue-500", textColor: "text-white", icon: "👶" },
              { label: "Verified Children", value: data.stats.verified_count || 0, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
              { label: "Pending Verification", value: data.stats.pending_count || 0, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
              { label: "Verification Issues", value: data.stats.issues_count || 0, color: "bg-red-400", textColor: "text-white", icon: "⚠️" },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <NurseLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Nurse Station Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time status monitoring for hospital live-birth registrations and bio-print checks.</p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, index) => (
          <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{loading ? "..." : s.value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${s.color} ${s.textColor} bg-opacity-20 shadow-sm`}>
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/20">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Registrations</h2>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Live-birth Stream</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {["Child Name", "Mother Name", "Status", "Last Check", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-gray-400">Fetching live streams from node server...</td>
                </tr>
              ) : children.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-xs text-gray-400">No recent infants registered today.</td>
                </tr>
              ) : (
                children.map((child, i) => (
                  <tr key={child.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {child.name_en ? child.name_en.charAt(0).toUpperCase() : "C"}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{child.name_en || child.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-500 font-medium">{child.mother_name || "N/A"}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusStyle[child.status] || "bg-gray-100 text-gray-600"}`}>
                        {child.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-400 font-medium">
                      {child.created_at ? child.created_at.split('T')[0] : (child.last_check || "Just Now")}
                    </td>
                    <td className="px-6 py-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg transition shadow-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </NurseLayout>
  );
}