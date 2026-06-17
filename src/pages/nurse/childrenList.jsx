// src/pages/nurse/ChildrenList.jsx
import { useState } from "react";
import NurseLayout from "../../components/nurseLayout";

const children = [
  { name: "Tia Ahmed", id: "ID:304010112", mother: "Eman Samy", status: "Verified", lastCheck: "5 Minutes Ago", avatar: "T" },
  { name: "Rahma Saber", id: "ID:404011112", mother: "May Ebrahim", status: "Pending", lastCheck: "10 Minutes Ago", avatar: "R" },
  { name: "Youssef Hany", id: "ID:504022132", mother: "Hoda Eslam", status: "Verified", lastCheck: "20 Minutes Ago", avatar: "Y" },
  { name: "Ahmed Mohamed", id: "ID:306050112", mother: "Hoda Eslam", status: "Alerts", lastCheck: "30 Minutes Ago", avatar: "A" },
];

const statusStyle = {
  Verified: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Alerts: "bg-red-100 text-red-500",
};

export default function ChildrenList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const filtered = children.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.id.includes(search);
    const matchStatus = statusFilter === "All Status" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <NurseLayout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
          </svg>
          Children List
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage All Registered Children</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent flex-1"
            placeholder="Search By Child Name Or ID..." />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-600 appearance-none bg-white pr-8 focus:border-blue-400">
            <option>All Status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Alerts</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Child Name", "Mother", "Status", "Last Check", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((child, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {child.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{child.name}</p>
                      <p className="text-xs text-gray-400">{child.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">{child.mother}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[child.status]}`}>
                    ● {child.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-400">{child.lastCheck}</td>
                <td className="px-6 py-3">
                  <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition">
                    View Details
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-3 flex items-center gap-2 border-t border-gray-100">
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <span className="text-xs text-gray-400">1–{filtered.length}</span>
        </div>
      </div>
    </NurseLayout>
  );
}