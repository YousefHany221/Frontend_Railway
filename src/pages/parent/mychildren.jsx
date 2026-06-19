// src/pages/parent/MyChildren.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ParentLayout from "../../components/parentLayout";
import { parentService } from "../../api/parent";

const statusStyle = {
  verified: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  missing: "bg-red-100 text-red-600",
};

export default function MyChildren() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const data = await parentService.getMyChildren();
        setChildren(data || []);
      } catch (err) {
        setError('Failed to load children');
        console.error('Error fetching children:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  const filtered = children.filter(c => {
    const childName = (c.name || c.name_en || c.name_ar || "").toLowerCase();
    const matchSearch = childName.includes(search.toLowerCase()) || c.id?.toString().includes(search);
    const matchStatus = statusFilter === "All Status" || c.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <ParentLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          My Children
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage Your Registered Children</p>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent flex-1"
            placeholder="Search By Name Or ID..." />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-600 appearance-none bg-white pr-8 focus:border-blue-400 cursor-pointer">
            <option>All Status</option>
            <option>Verified</option>
            <option>Pending</option>
            <option>Missing</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-400">Loading children...</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">No children found</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {["Child Name", "Mother", "Status", "Last Check", "Actions"].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((child) => (
                <tr key={child.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {(child.name_en || child.name_ar || child.name || 'C').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{child.name_en || child.name_ar || child.name}</p>
                        <p className="text-xs text-gray-400">{child.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{child.mother_name || "-"}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[child.status?.toLowerCase()] || 'bg-gray-100 text-gray-600'}`}>
                      ● {child.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-400">
                    {child.updated_at ? child.updated_at.split('T')[0] : (child.last_check || 'N/A')}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => navigate(`/parent/child-details/${child.id}`)}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
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
        )}
      </div>
    </ParentLayout>
  );
}