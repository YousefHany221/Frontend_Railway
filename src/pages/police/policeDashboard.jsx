// src/pages/police/PoliceDashboard.jsx
import PoliceLayout from "../../components/policeLayout";

const stats = [
  { label: "Total Active Cases", value: 15, color: "bg-blue-500", textColor: "text-white", icon: "📁" },
  { label: "Verified Matches", value: 9, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
  { label: "Pending Investigations", value: 4, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
  { label: "High Priority Alerts", value: 1, color: "bg-red-400", textColor: "text-white", icon: "⚠️" },
];

const reports = [
  { name: "Tia Ahmed", type: "Biometric Mismatch", priority: "High", status: "Under Investigation", avatar: "T" },
  { name: "Rahma Saber", type: "Unauthorized Movement", priority: "Medium", status: "The Process Pending Review", avatar: "R" },
  { name: "Salma Mohamed", type: "Biometric Mismatch", priority: "High", status: "Under Investigation", avatar: "S" },
];

const priorityStyle = {
  High: "bg-red-100 text-red-500",
  Medium: "bg-yellow-100 text-yellow-600",
};

const priorityIcon = {
  High: "⚠",
  Medium: "⏳",
};

export default function PoliceDashboard() {
  return (
    <PoliceLayout>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Active Police Reports</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Child Name", "Report Type", "Priority", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">{r.avatar}</div>
                    <span className="text-sm font-medium text-gray-700">{r.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">{r.type}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyle[r.priority]}`}>
                    {priorityIcon[r.priority]} {r.priority}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">{r.status}</td>
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
    </PoliceLayout>
  );
}