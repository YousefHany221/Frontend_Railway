// src/pages/admin/UserList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { adminService } from "../../api/admin";
import { useAuth } from "../../context/AuthContext";

export default function UserList() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      loadUsers();
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({ search });
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers(u => u.filter(x => x.id !== id));
      setDeleteModal(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleEditSave = async () => {
    if (!editModal) return;
    try {
      const payload = {
        name: editModal.name,
        email: editModal.email,
        phone: editModal.phone,
        role: editModal.role,
      };
      if (editModal.password?.trim()) {
        payload.password = editModal.password;
      }
      const response = await adminService.updateUser(editModal.id, payload);
      const updated = response.data;
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)));
      setEditModal(null);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-72">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            placeholder="Search Users..." />
        </div>
        <button onClick={() => navigate("/admin/members/add")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-100">
          <span className="text-lg leading-none">+</span> Add User
        </button>
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
                {["Name", "Email", "Role", "Status", "Last Login", "Actions"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = Boolean(currentUser?.id) && currentUser.id === user.id;
                return (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 capitalize">{user.role}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                      ${user.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-400">{user.last_login}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        disabled={isSelf}
                        className={`text-xs flex items-center gap-1 ${isSelf ? "text-gray-300 cursor-not-allowed" : "text-blue-500 hover:underline"}`}
                        onClick={() => { if (!isSelf) setEditModal({ ...user, password: "" }); }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      <button
                        disabled={isSelf}
                        onClick={() => { if (!isSelf) setDeleteModal(user); }}
                        className={`text-xs flex items-center gap-1 ${isSelf ? "text-gray-300 cursor-not-allowed" : "text-red-400 hover:underline"}`}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.18)" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center">
            <h3 className="font-bold text-gray-800 text-lg mb-1">Delete User ?</h3>
            <p className="text-gray-400 text-sm mb-5">Do You Want To Permanently Delete This User?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => handleDelete(deleteModal.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-6 py-2 rounded-xl transition">
                Delete
              </button>
              <button onClick={() => setDeleteModal(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-6 py-2 rounded-xl transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.18)" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[420px]">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Edit User</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600">Name</label>
                <input
                  value={editModal.name}
                  onChange={(e) => setEditModal((p) => ({ ...p, name: e.target.value }))}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600">Email</label>
                <input
                  value={editModal.email}
                  onChange={(e) => setEditModal((p) => ({ ...p, email: e.target.value }))}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Phone</label>
                <input
                  value={editModal.phone ?? ""}
                  onChange={(e) => setEditModal((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Role</label>
                <select
                  value={editModal.role}
                  onChange={(e) => setEditModal((p) => ({ ...p, role: e.target.value }))}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
                >
                  <option value="nurse">nurse</option>
                  <option value="police">police</option>
                  <option value="user">user</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-600">New Password (optional)</label>
                <input
                  type="password"
                  value={editModal.password ?? ""}
                  onChange={(e) => setEditModal((p) => ({ ...p, password: e.target.value }))}
                  className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
                  placeholder="Leave empty to keep current password"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setEditModal(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}