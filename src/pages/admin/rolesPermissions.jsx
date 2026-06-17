// src/pages/admin/RolesPermissions.jsx
import { useState } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function RolesPermissions() {
  const [roles, setRoles] = useState([
    {
      name: "Admin",
      description: "Full system access",
      permissions: ["dashboard", "users", "children", "organizations", "roles", "settings", "verification_logs"],
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Nurse",
      description: "Register and manage children",
      permissions: ["dashboard", "children", "register_child"],
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Police",
      description: "Search and verify children",
      permissions: ["dashboard", "search", "verification", "found_children"],
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Parent",
      description: "View and manage own children",
      permissions: ["dashboard", "my_children", "report_missing"],
      color: "bg-orange-100 text-orange-600",
    },
  ]);

  const allPermissions = [
    { key: "dashboard", label: "Dashboard Access" },
    { key: "users", label: "User Management" },
    { key: "children", label: "Children Management" },
    { key: "register_child", label: "Register Child" },
    { key: "search", label: "Search Children" },
    { key: "verification", label: "Verification Access" },
    { key: "found_children", label: "Manage Found Children" },
    { key: "organizations", label: "Organization Management" },
    { key: "roles", label: "Role Management" },
    { key: "settings", label: "System Settings" },
    { key: "verification_logs", label: "Verification Logs" },
    { key: "my_children", label: "View Own Children" },
    { key: "report_missing", label: "Report Missing" },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
        <p className="text-gray-400 text-sm mt-1">Manage user roles and their permissions</p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {roles.map((role, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full ${role.color} flex items-center justify-center font-bold text-lg`}>
                {role.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{role.name}</h3>
                <p className="text-xs text-gray-400">{role.description}</p>
              </div>
            </div>
            <div className="space-y-2">
              {role.permissions.map(perm => (
                <div key={perm} className="flex items-center gap-2 text-sm text-gray-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {allPermissions.find(p => p.key === perm)?.label || perm}
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-xs text-blue-500 hover:underline">Edit Permissions</button>
          </div>
        ))}
      </div>

      {/* Add New Role */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Add New Role</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Role Name</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 focus:border-blue-400" placeholder="Enter role name" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 focus:border-blue-400" placeholder="Enter description" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs font-semibold text-gray-600 mb-2 block">Permissions</label>
          <div className="grid grid-cols-3 gap-2">
            {allPermissions.map(perm => (
              <label key={perm.key} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                {perm.label}
              </label>
            ))}
          </div>
        </div>
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">
          Create Role
        </button>
      </div>
    </AdminLayout>
  );
}
