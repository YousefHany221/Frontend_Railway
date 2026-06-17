// src/pages/nurse/NurseDashboard.jsx
import NurseLayout from "../../components/nurseLayout";

const stats = [
  { label: "Total Children Today", value: 15, color: "bg-blue-500", textColor: "text-white", icon: "👶" },
  { label: "Verified Children", value: 9, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
  { label: "Pending Verification", value: 4, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
  { label: "Verification Issues", value: 1, color: "bg-red-400", textColor: "text-white", icon: "⚠️" },
];

const children = [
  { name: "Tia Ahmed", mother: "Eman Samy", status: "Verified", lastCheck: "5 Minutes Ago", avatar: "T" },
  { name: "Rahma Saber", mother: "May Ebrahim", status: "Pending", lastCheck: "10 Minutes Ago", avatar: "R" },
  { name: "Youssef Hany", mother: "Hoda Eslam", status: "Verified", lastCheck: "20 Minutes Ago", avatar: "Y" },
  { name: "Ahmed Mohamed", mother: "Hoda Eslam", status: "Alerts", lastCheck: "30 Minutes Ago", avatar: "A" },
  { name: "Maria Ahmed", mother: "Eman Samy", status: "Pending", lastCheck: "50 Minutes Ago", avatar: "M" },
];

const statusStyle = {
  Verified: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Alerts: "bg-red-100 text-red-500",
};

export default function NurseDashboard() {
  return (
    <NurseLayout>
      {/* Stats */}
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

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Children Overview</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Child Name", "Mother", "Status", "Last Check", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children.map((child, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {child.avatar}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{child.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">{child.mother}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[child.status]}`}>
                    {child.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-400">{child.lastCheck}</td>
                <td className="px-6 py-3">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </NurseLayout>
  );
}