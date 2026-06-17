// src/pages/admin/Organization.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminService } from "../../api/admin";

export default function Organization() {
  const [activeTab, setActiveTab] = useState("hospital");
  const [organizations, setOrganizations] = useState({ hospital: [], police: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrganizations = async () => {
      setLoading(true);
      try {
        const [hospitals, police] = await Promise.all([
          adminService.getUsers({ role: "nurse", per_page: 100 }),
          adminService.getUsers({ role: "police", per_page: 100 }),
        ]);
        setOrganizations({
          hospital: (hospitals.data ?? []).map((item) => ({
            id: item.id,
            name: item.name,
            location: "N/A",
            phone: item.phone ?? "N/A",
            status: item.status ?? "active",
          })),
          police: (police.data ?? []).map((item) => ({
            id: item.id,
            name: item.name,
            location: "N/A",
            phone: item.phone ?? "N/A",
            status: item.status ?? "active",
          })),
        });
      } catch (error) {
        setOrganizations({ hospital: [], police: [] });
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
        <p className="text-gray-400 text-sm mt-1">Manage hospitals and police departments</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex gap-2">
          {[
            { key: "hospital", label: "Hospitals" },
            { key: "police", label: "Police Departments" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-700 capitalize">{activeTab} List</h2>
          <span className="text-xs text-gray-400">
            Data is sourced from registered {activeTab === "hospital" ? "nurse" : "police"} accounts.
          </span>
        </div>
        {loading ? (
          <div className="px-6 py-8 text-sm text-gray-400">Loading organizations...</div>
        ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Name", "Location", "Phone", "Status", "Actions"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {organizations[activeTab].map((org) => (
              <tr key={org.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-6 py-3 text-sm font-medium text-gray-700">{org.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{org.location}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{org.phone}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${org.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {org.status}
                  </span>
                </td>
                <td className="px-6 py-3 text-xs text-gray-400">Managed from Members</td>
              </tr>
            ))}
            {organizations[activeTab].length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                  No organizations found.
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
