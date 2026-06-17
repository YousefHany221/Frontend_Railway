// src/pages/admin/OrganizationPolice.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/adminLayout";
import { adminService } from "../../api/admin";

export default function OrganizationPolice() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepartments = async () => {
      setLoading(true);
      try {
        const response = await adminService.getUsers({ role: "police", per_page: 100 });
        setDepartments(response.data ?? []);
      } catch (error) {
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDepartments();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Police Departments</h1>
        <p className="text-gray-400 text-sm mt-1">Manage registered police departments in the system</p>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-8 text-sm text-gray-400">Loading police departments...</div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Name", "Location", "Phone", "Email", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">{dept.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">N/A</td>
                <td className="px-6 py-3 text-sm text-gray-500">{dept.phone ?? "N/A"}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{dept.email}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${dept.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {dept.status ?? "active"}
                  </span>
                </td>
                <td className="px-6 py-3 text-xs text-gray-400">Managed from Members</td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                  No police departments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        )}
      </div>
    </AdminLayout>
  );
}
