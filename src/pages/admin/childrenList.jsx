// src/pages/admin/ChildrenList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { adminService } from "../../api/admin";

// ── CHILD DETAIL MODAL ─────────────────────────────────────────────────────
function ChildDetailModal({ child, onClose }) {
  if (!child) return null;

  const childPhotoUrl = child.child_photo_path 
    ? `http://localhost:8000/storage/${child.child_photo_path}`
    : null;
  const footprintUrl = child.footprint_path
    ? `http://localhost:8000/storage/${child.footprint_path}`
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Child Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Child Photo */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Child Photo</h3>
              {childPhotoUrl ? (
                <img src={childPhotoUrl} alt={child.name} className="w-full h-48 object-cover rounded-xl border border-gray-200" />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No photo available</p>
                </div>
              )}
            </div>

            {/* Footprint */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Footprint</h3>
              {footprintUrl ? (
                <img src={footprintUrl} alt="Footprint" className="w-full h-48 object-cover rounded-xl border border-gray-200" />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No footprint available</p>
                </div>
              )}
            </div>

            {/* Child Information */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Child Information</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-800">{child.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{child.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Birth Date</p>
                    <p className="text-sm font-medium text-gray-800">{child.birth_date || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimated Age</p>
                    <p className="text-sm font-medium text-gray-800">{child.estimated_age || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      child.status === 'safe' ? 'bg-blue-100 text-blue-600' :
                      child.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      child.status === 'verified' ? 'bg-green-100 text-green-600' :
                      child.status === 'missing' ? 'bg-red-100 text-red-500' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {child.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">NFC Tag ID</p>
                    <p className="text-sm font-medium text-gray-800">{child.nfc_tag_id || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mother's Name</p>
                    <p className="text-sm font-medium text-gray-800">{child.mother_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Father's Name</p>
                    <p className="text-sm font-medium text-gray-800">{child.father_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Father's Phone</p>
                    <p className="text-sm font-medium text-gray-800">{child.father_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Father's National ID</p>
                    <p className="text-sm font-medium text-gray-800">{child.father_national_id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Additional Information</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Found Location</p>
                    <p className="text-sm font-medium text-gray-800">{child.found_location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date Found</p>
                    <p className="text-sm font-medium text-gray-800">{child.date_found || 'N/A'}</p>
                  </div>
                </div>
                {child.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Notes</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">{child.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Parent Information */}
            {child.parent && (
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Parent Information</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Parent Name</p>
                      <p className="text-sm font-medium text-gray-800">{child.parent.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-800">{child.parent.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChildrenList() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadChildren();
  }, [search, statusFilter]);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      
      const response = await adminService.getChildren(params);
      setChildren(response.data?.data ?? response.data ?? []);
    } catch (err) {
      console.error('Failed to load children:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (childId) => {
    setDeleteId(childId);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      await adminService.deleteChild(deleteId);
      setChildren(children.filter(c => c.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete child:', err);
      alert('Failed to delete child');
    }
  };

  const statusColors = {
    verified: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    missing: "bg-red-100 text-red-600",
    safe: "bg-blue-100 text-blue-600",
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Children List</h1>
          <p className="text-gray-400 text-sm mt-1">View and manage all registered children</p>
        </div>
        <button onClick={() => navigate("/admin/children/register")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-100">
          <span className="text-lg leading-none">+</span> Register Child
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-72">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              placeholder="Search children..." />
          </div>
          <div className="flex gap-2">
            {["all", "verified", "pending", "missing"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                  statusFilter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Child Name", "Mother", "Father", "Gender", "Birth Date", "Status", "Parent", "Actions"].map(h => (
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
                        {child.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{child.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{child.mother_name || '-'}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{child.father_name || '-'}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 capitalize">{child.gender}</td>
                  <td className="px-6 py-3 text-sm text-gray-400">{child.birth_date || '-'}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[child.status] || 'bg-gray-100 text-gray-600'}`}>
                      {child.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{child.parent?.name || '-'}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button onClick={() => setSelectedChild(child)} className="text-xs text-blue-500 hover:underline">View</button>
                      <button onClick={() => handleDelete(child.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {children.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400 text-sm">
                    No children found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {selectedChild && <ChildDetailModal child={selectedChild} onClose={() => setSelectedChild(null)} />}
      
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Child</h3>
              <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this child? This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
