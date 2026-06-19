// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/adminLayout";
import { adminService } from "../../api/admin";

// ── CONFIGURATIONS الموحدة ─────────────────────────────────────────────────
const API_URL = "https://graduation-project-2026-nbis-backend-production.up.railway.app";
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
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>\
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Child Diagnostics Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Infant Live Photo</p>
              {childPhotoUrl ? (
                <img src={childPhotoUrl} alt="Child" className="w-full h-48 object-cover rounded-xl border" />
              ) : (
                <div className="w-full h-48 bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-400 border border-dashed">No Photo Uploaded</div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Registered Bio-Footprint</p>
              {footprintUrl ? (
                <img src={footprintUrl} alt="Footprint" className="w-full h-48 object-contain rounded-xl bg-gray-50 border" />
              ) : (
                <div className="w-full h-48 bg-gray-50 rounded-xl flex items-center justify-center text-xs text-gray-400 border border-dashed">No Footprint Scanned</div>
              )}
            </div>
          </div>
          <div className="bg-gray-50/60 p-4 rounded-xl space-y-2 border border-gray-100 text-xs">
            <p><strong>Full Name:</strong> {child.name_en || child.name || "N/A"}</p>
            <p><strong>Mother Name:</strong> {child.mother_name || "N/A"}</p>
            <p><strong>System Status:</strong> <span className="uppercase font-bold text-blue-600">{child.status}</span></p>
            <p><strong>Record UUID:</strong> #{child.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN DASHBOARD ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const childrenData = await adminService.loadChildren();
        const usersData = await adminService.getUsers({ limit: 5 });
        setChildren(Array.isArray(childrenData) ? childrenData : (childrenData.data || []));
        setUsers(usersData.data || []);
      } catch (err) {
        console.error("Dashboard failed to stream data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">System Overview & Management</h1>
        <p className="text-xs text-gray-400 mt-1">Real-time status monitoring across all national nodes and live user actions.</p>
      </div>

      {/* Grid Display for Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left: Recent Children Logs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Latest Registered Infants</h3>
          <div className="space-y-3">
            {loading ? <p className="text-xs text-gray-400">Loading...</p> : children.slice(0, 4).map((c, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">👶</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{c.name_en || "Unknown"}</p>
                    <p className="text-[10px] text-gray-400 font-mono">ID: #{c.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedChild(c)} className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 transition">Inspect</button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: User Management Stream */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Active System Nodes / Members</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 border-b pb-2">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.slice(0, 4).map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-medium text-gray-700">{u.name || u.email}</td>
                    <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[10px] uppercase">{u.role}</span></td>
                    <td className="py-2.5"><button onClick={() => navigate(`/admin/members/list`)} className="text-blue-600 font-semibold hover:underline">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedChild && <ChildDetailModal child={selectedChild} onClose={() => setSelectedChild(null)} />}
    </AdminLayout>
  );
}