// src/pages/admin/OrganizationHospital.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/adminLayout";
import { adminService } from "../../api/admin";

export default function OrganizationHospital() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHospitals = async () => {
      setLoading(true);
      try {
        const response = await adminService.getUsers({ role: "nurse", per_page: 100 });
        setHospitals(response.data ?? []);
      } catch (error) {
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    loadHospitals();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hospitals</h1>
        <p className="text-gray-400 text-sm mt-1">Manage registered hospitals in the system</p>
      </div>

      {/* Hospitals Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-8 text-sm text-gray-400">Loading hospitals...</div>
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
            {hospitals.map((hospital) => (
              <tr key={hospital.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">{hospital.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">N/A</td>
                <td className="px-6 py-3 text-sm text-gray-500">{hospital.phone ?? "N/A"}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{hospital.email}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${hospital.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {hospital.status ?? "active"}
                  </span>
                </td>
                <td className="px-6 py-3 text-xs text-gray-400">Managed from Members</td>
              </tr>
            ))}
            {hospitals.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                  No hospital records found.
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
