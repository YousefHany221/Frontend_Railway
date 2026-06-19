// src/pages/admin/ChildrenList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/adminLayout";
import { adminService } from "../../api/admin";

// ── CONFIGURATIONS الموحدة لمنع التضارب 🎯 ──────────────────────────────────
const STORAGE_URL = "https://showcase-alienable-overspend.ngrok-free.dev";

const statusStyle = {
  verified: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  missing: "bg-red-100 text-red-500",
};

// ── CHILD DETAIL MODAL ─────────────────────────────────────────────────────
function ChildDetailModal({ child, onClose }) {
  if (!child) return null;

  const childPhotoUrl = child.child_photo_path
    ? `${STORAGE_URL}/storage/${child.child_photo_path}`
    : null;

  const footprintUrl = child.footprint_path
    ? `${STORAGE_URL}/storage/${child.footprint_path}`
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Child Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {/* Images */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Live Photo</p>
              {childPhotoUrl ? (
                <img src={childPhotoUrl} alt="Child" className="w-full h-48 object-cover rounded-xl border border-gray-100" />
              ) : (
                <div className="w-full h-48 bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-400 border border-dashed">No Photo Available</div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Biometric Footprint</p>
              {footprintUrl ? (
                <img src={footprintUrl} alt="Footprint" className="w-full h-48 object-contain rounded-xl bg-gray-50 border border-gray-100" />
              ) : (
                <div className="w-full h-48 bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-400 border border-dashed">No Footprint Scanned</div>
              )}
            </div>
          </div>
          {/* Metadata */}
          <div className="bg-gray-50/60 p-4 rounded-xl space-y-2 text-xs border border-gray-100">
            <p><strong>Name (EN):</strong> {child.name_en || "N/A"}</p>
            <p><strong>Mother Full Name:</strong> {child.mother_name || "N/A"}</p>
            <p><strong>Current Status:</strong> <span className="font-bold text-blue-600 uppercase">{child.status}</span></p>
            <p><strong>Database ID:</strong> #{child.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SYSTEM REGISTRY MAIN PAGE ──────────────────────────────────────────────
export default function ChildrenList() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedChild, setSelectedChild] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const response = await adminService.loadChildren();
      setChildren(Array.isArray(response) ? response : (response.data || []));
    } catch (err) {
      console.error("Failed to load children registry:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await adminService.deleteChild(deleteId);
      setChildren(prev => prev.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to terminate child record:", err);
    }
  };

  // الفلترة الآمنة بحروف صغيرة لتجنب مشاكل التطابق 🛠️
  const filteredChildren = children.filter(child => {
    const nameStr = (child.name_en || child.name || "").toLowerCase();
    const matchesSearch = nameStr.includes(search.toLowerCase()) || (child.id && child.id.toString().includes(search));

    const currentStatus = (child.status || "pending").toLowerCase();
    const matchesStatus = statusFilter === "All Status" || currentStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Master Children Registry</h1>
          <p className="text-xs text-gray-400 mt-1">Cross-node global view and manipulation of registered infants.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or UUID..."
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

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100">
              {["Infant Profile", "Mother Full Name", "Status", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-xs text-gray-400">Loading master records...</td></tr>
            ) : filteredChildren.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-xs text-gray-400">No infants found matching filters.</td></tr>
            ) : (
              filteredChildren.map((child, i) => {
                const currentStatus = (child.status || "pending").toLowerCase();
                return (
                  <tr key={child.id || i} className="hover:bg-gray-50/40 transition">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">👶</div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{child.name_en || "Unknown"}</p>
                          <p className="text-[10px] text-gray-400 font-mono">UUID: #{child.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-gray-500 font-medium">{child.mother_name || "-"}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusStyle[currentStatus] || "bg-gray-100 text-gray-600"}`}>
                        ● {child.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 flex gap-2">
                      <button onClick={() => setSelectedChild(child)} className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg transition shadow-sm">View</button>
                      <button onClick={() => setDeleteId(child.id)} className="bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-medium px-3 py-1.5 rounded-lg transition">Delete</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals Handling */}
      {selectedChild && <ChildDetailModal child={selectedChild} onClose={() => setSelectedChild(null)} />}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Destruction</h3>
              <p className="text-gray-500 text-xs mb-6">Are you sure you want to delete this child from national nodes? This cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border text-xs text-gray-500">Cancel</button>
                <button onClick={handleDeleteConfirm} className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold text-xs">Confirm Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
