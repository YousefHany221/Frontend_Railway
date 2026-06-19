// src/pages/police/PoliceDashboard.jsx
import { useEffect, useState } from "react";
import PoliceLayout from "../../components/policeLayout";

const priorityStyle = {
  High: "bg-red-100 text-red-500",
  Medium: "bg-yellow-100 text-yellow-600",
  Low: "bg-blue-100 text-blue-600",
};

const priorityIcon = {
  High: "⚠️",
  Medium: "⏳",
  Low: "ℹ️",
};

export default function PoliceDashboard() {
  // 1. تعريف الـ States لحفظ البيانات الديناميكية
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState([
    { label: "Total Active Cases", value: 0, color: "bg-blue-500", textColor: "text-white", icon: "📁" },
    { label: "Verified Matches", value: 0, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
    { label: "Pending Investigations", value: 0, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
    { label: "High Priority Alerts", value: 0, color: "bg-red-400", textColor: "text-white", icon: "⚠️" },
  ]);
  const [loading, setLoading] = useState(true);

  // 2. جلب البيانات من الباكيند عند تحميل الصفحة
  useEffect(() => {
    async function fetchPoliceDashboard() {
      try {
        // 🎯 توجيه الطلب لرابط جلب بلاغات ومطابقات الشرطة الحية
        const response = await fetch("https://your-laravel-railway-url.railway.app/api/verification-logs", {
          headers: {
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("nbis_token") // 🎯 تحديث المفتاح لـ nbis_token الموحد
          }
        });
        const data = await response.json();

        if (response.ok) {
          // تأمين الـ Array لضمان عدم حدوث Crash لو الباكيند رجع الـ Logs مباشرة
          const activeLogs = data.logs || data.reports || (Array.isArray(data) ? data : []);
          setReports(activeLogs);

          // تحديث كروت الإحصائيات بناءً على رد السيرفر الفعلي أو حسابها ديناميكياً
          if (data.stats) {
            setStats([
              { label: "Total Active Cases", value: data.stats.total || 0, color: "bg-blue-500", textColor: "text-white", icon: "📁" },
              { label: "Verified Matches", value: data.stats.verified || 0, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
              { label: "Pending Investigations", value: data.stats.pending || 0, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
              { label: "High Priority Alerts", value: data.stats.alerts || 0, color: "bg-red-400", textColor: "text-white", icon: "⚠️" },
            ]);
          } else {
            // حساب الإحصائيات ديناميكياً من الـ array لو مفيش stats مخصصة راجعة
            const total = activeLogs.length;
            const verified = activeLogs.filter(r => r.status === 'verified' || r.status === 'Success').length;
            const pending = activeLogs.filter(r => r.status === 'pending' || r.status === 'Pending').length;

            setStats([
              { label: "Total Active Cases", value: total, color: "bg-blue-500", textColor: "text-white", icon: "📁" },
              { label: "Verified Matches", value: verified, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
              { label: "Pending Investigations", value: pending, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
              { label: "High Priority Alerts", value: activeLogs.filter(r => r.priority === 'High').length, color: "bg-red-400", textColor: "text-white", icon: "⚠️" },
            ]);
          }
        }
      } catch (error) {
        console.error("Error fetching police dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPoliceDashboard();
  }, []);

  if (loading) {
    return (
      <PoliceLayout>
        <div className="flex items-center justify-center h-64 text-sm text-gray-500 font-medium">
          جاري تحميل بيانات لوحة تحكم الشرطة... 🚨
        </div>
      </PoliceLayout>
    );
  }

  return (
    <PoliceLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-4 flex items-center justify-between shadow-sm`}>
            <div>
              <p className={`text-xs font-medium ${s.textColor} opacity-80`}>{s.label}</p>
              <p className={`text-3xl font-bold ${s.textColor} mt-1`}>{s.value}</p>
            </div>
            <span className="text-3xl opacity-80">{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Active Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-sm text-gray-700">Active Police Cases & Verification Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Child Details", "Triggered By", "Priority", "Status", "Actions"].map(h => (
                  <th key={h} className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400 text-xs">
                    لا توجد سجلات مطابقة أو بلاغات نشطة حالياً في النظام.
                  </td>
                </tr>
              ) : (
                reports.map((r, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/80 transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {r.child?.name_en ? r.child.name_en.charAt(0).toUpperCase() : (r.child_name ? r.child_name.charAt(0).toUpperCase() : "C")}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{r.child?.name_en || r.child_name || "Unknown Child"}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">ID: #{r.child_id || r.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-600 font-medium">
                      {r.user?.name || r.officer_name || "System AI"}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${priorityStyle[r.priority] || "bg-gray-100 text-gray-600"}`}>
                        {priorityIcon[r.priority] || "•"} {r.priority || "Medium"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`text-xs font-semibold ${r.status === 'verified' || r.status === 'Success' ? 'text-green-600' : 'text-amber-500'}`}>
                        {r.status || "Under Review"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-xl transition shadow-sm">
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
    </PoliceLayout>
  );
}