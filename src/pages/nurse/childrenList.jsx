// src/pages/nurse/ChildrenList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NurseLayout from "../../components/nurseLayout";

const statusStyle = {
  verified: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  missing: "bg-red-100 text-red-500",
};

export default function ChildrenList() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // 1. جلب البيانات من الـ API Route الفعلي على Railway
  useEffect(() => {
    async function fetchChildren() {
      try {
        const token = localStorage.getItem("nbis_token"); // 🚀 تم التعديل لتوحيد التوكن
        const response = await fetch("https://graduation-project-2026-nbis-backend-production.up.railway.app/api/children", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok) {
          // الباك إند قد يرجع البيانات مباشرة كمصفوفة أو داخل غلاف data
          setChildren(Array.isArray(data) ? data : (data.data || []));
        }
      } catch (error) {
        console.error("Error fetching children list:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChildren();
  }, []);

  // 2. الفلترة والبحث النصي بشكل آمن
  const filteredChildren = children.filter(child => {
    const nameStr = (child.name_en || child.name_ar || child.name || "").toLowerCase();
    const matchesSearch = nameStr.includes(search.toLowerCase()) ||
      (child.id && child.id.toString().includes(search));

    // توحيد الحروف الصغيرة للحالة لضمان التطابق
    const currentStatus = (child.status || "pending").toLowerCase();
    const matchesStatus = statusFilter === "All Status" || currentStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <NurseLayout>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Newborns & Children Registry</h1>
          <p className="text-xs text-gray-400 mt-1">Manage and view all registered infants within the hospital system.</p>
        </div>
        <button
          onClick={() => navigate("/nurse/register-child")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          + Register New Infant
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by child name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-blue-400 bg-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-xs outline-none bg-white font-medium text-gray-600"
        >
          <option value="All Status">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="missing">Missing</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              {["Infant Details", "Mother Name", "Status", "Date Registered", "Actions"].map((h) => (
                <th key={h} className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-xs text-gray-400">Loading registry from node server...</td>
              </tr>
            ) : filteredChildren.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-xs text-gray-400">No matching child records found.</td>
              </tr>
            ) : (
              filteredChildren.map((child, i) => {
                const currentChildName = child.name_en || child.name_ar || child.name || "Unknown";
                const currentStatus = (child.status || "pending").toLowerCase();

                return (
                  <tr key={child.id || i} className="hover:bg-gray-50/40 transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-100/30">
                          {currentChildName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{currentChildName}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">UUID: #{child.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-500 font-medium">{child.mother_name || "-"}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusStyle[currentStatus] || 'bg-gray-100 text-gray-600'}`}>
                        ● {child.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-400 font-medium">
                      {child.created_at ? child.created_at.split('T')[0] : (child.date_registered || 'N/A')}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => navigate(`/nurse/child/${child.id}`)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg transition shadow-sm"
                      >
                        View Details
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </NurseLayout>
  );
}