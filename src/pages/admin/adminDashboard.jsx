// src/pages/admin/AdminDashboard.jsx
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
                <img src={childPhotoUrl} alt="Child photo" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
              ) : (
                <div className="w-full h-40 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  No photo available
                </div>
              )}
            </div>

            {/* Footprint */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Footprint</h3>
              {footprintUrl ? (
                <img src={footprintUrl} alt="Footprint" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
              ) : (
                <div className="w-full h-40 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  No footprint available
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
          </div>
        </div>
      </div>
    </div>
  );
}

const statusStyle = {
  verified: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  missing: "bg-red-100 text-red-500",
  safe: "bg-blue-100 text-blue-600",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [children, setChildren] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, childrenRes, usersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getChildrenOverview(),
        adminService.getUsers(),
      ]);
      setStats(statsRes.data);
      setChildren(childrenRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  const dashboardStats = [
    { label: "Total Children", value: stats?.total_children || 0, color: "bg-blue-500", textColor: "text-white", icon: "👶" },
    { label: "Registered Users", value: stats?.total_users || 0, color: "bg-purple-100", textColor: "text-purple-600", icon: "👥" },
    { label: "Total Organizations", value: stats?.total_organizations || 0, color: "bg-orange-100", textColor: "text-orange-600", icon: "🏢" },
    { label: "Verified Children", value: stats?.verified_children || 0, color: "bg-green-100", textColor: "text-green-600", icon: "✅" },
    { label: "Pending Verification", value: stats?.pending_children || 0, color: "bg-yellow-100", textColor: "text-yellow-600", icon: "⏳" },
    { label: "Missing Children", value: stats?.missing_children || 0, color: "bg-red-400", textColor: "text-white", icon: "⚠️" },
  ];

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {dashboardStats.map((s, i) => (
          <div key={i} className={`${s.color} rounded-2xl p-4 flex items-center justify-between shadow-sm`}>
            <div>
              <p className={`text-xs font-medium ${s.textColor} opacity-80`}>{s.label}</p>
              <p className={`text-3xl font-bold ${s.textColor} mt-1`}>{s.value}</p>
            </div>
            <span className="text-3xl opacity-80">{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Children Overview Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Children Overview</h2>
          <button onClick={() => navigate('/admin/children')} className="text-xs text-blue-500 hover:underline">View All</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Child Name", "Mother", "Status", "Registered", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {children.slice(0, 5).map((child, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {child.name.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{child.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">{child.mother_name || '-'}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[child.status] || 'bg-gray-100 text-gray-600'}`}>
                    {child.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-400">{child.created_at}</td>
                <td className="px-6 py-3">
                  <button onClick={() => setSelectedChild(child)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {children.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                  No children registered yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Users Overview Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700">Recent Users</h2>
          <button onClick={() => navigate('/admin/members/list')} className="text-xs text-blue-500 hover:underline">View All</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Name", "Email", "Role", "Registered", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map((user, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{user.name || 'Unknown'}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-blue-100 text-blue-600">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-400">{user.created_at}</td>
                <td className="px-6 py-3">
                  <button onClick={() => navigate(`/admin/members/list`)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                  No users registered yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selectedChild && <ChildDetailModal child={selectedChild} onClose={() => setSelectedChild(null)} />}
    </AdminLayout>
  );
}