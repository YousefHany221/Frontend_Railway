// src/pages/admin/ReportMissing.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { parentService } from "../../api/parent";
import { adminService } from "../../api/admin";

export default function ReportMissing() {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [reporting, setReporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChildren = async () => {
      setLoading(true);
      try {
        const response = await adminService.getChildren({ per_page: 100 });
        setChildren(response.data ?? []);
      } catch (err) {
        setChildren([]);
      } finally {
        setLoading(false);
      }
    };
    loadChildren();
  }, []);

  const filteredChildren = children.filter((child) =>
    (child.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (child.mother_name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReportMissing = async () => {
    if (!selectedChild) return;
    
    setReporting(true);
    setError("");
    try {
      await parentService.reportMissing({ child_id: selectedChild.id });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to report child as missing");
    } finally {
      setReporting(false);
    }
  };

  if (success) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-100">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Report Submitted</h2>
            <p className="text-gray-400 text-sm">Child has been reported as missing</p>
            <button onClick={() => navigate("/admin/children")}
              className="mt-2 bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition">
              View Children List
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Report Missing Child</h1>
          <p className="text-gray-400 text-sm mt-1">Select a child to report as missing</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Search */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Search Child</label>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                placeholder="Search by name or national ID..." />
            </div>
          </div>

          {/* Children List */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {loading && (
              <p className="text-center text-gray-400 text-sm py-8">Loading children...</p>
            )}
            {filteredChildren.map(child => (
              <div
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  selectedChild?.id === child.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{child.name}</p>
                    <p className="text-xs text-gray-500">Mother: {child.mother_name ?? "-"}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                    child.status === "verified" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  }`}>
                    {child.status}
                  </span>
                </div>
              </div>
            ))}
            {!loading && filteredChildren.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-8">No children found</p>
            )}
          </div>

          {error && <p className="text-red-500 text-xs mt-4 text-center">⚠ {error}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
              Cancel
            </button>
            <button onClick={handleReportMissing} disabled={!selectedChild || reporting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed">
              {reporting ? 'Submitting...' : 'Report as Missing'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
