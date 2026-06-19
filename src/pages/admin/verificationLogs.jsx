// src/pages/shared/VerificationLogs.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── CONFIGURATIONS ────────────────────────────────────────────────────────
const API_URL = "https://graduation-project-2026-nbis-backend-production.up.railway.app";
const STORAGE_URL = "https://showcase-alienable-overspend.ngrok-free.dev";

// ── 🆕 ADD FOUND CHILD / REPORT MODAL ──────────────────────────────────────
function AddFoundChildModal({ onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    child_name: "",
    estimated_age: "",
    gender: "male",
    found_location: "",
    date_found: "",
    case_id: "",
    report_type: "Found Child",
    notes: ""
  });
  const [childPhoto, setChildPhoto] = useState(null);
  const [footprint, setFootprint] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (childPhoto) data.append("child_photo", childPhoto);
    if (footprint) data.append("footprint", footprint);

    try {
      const token = localStorage.getItem("nbis_token");
      const response = await fetch(`${API_URL}/api/children/register-found`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });

      if (response.ok) {
        alert("Child record & verification log registered successfully! 🎉");
        onRefresh();
        onClose();
      } else {
        const errData = await response.json();
        alert(`Failed: ${errData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-50">
          <div>
            <h3 className="text-base font-bold text-gray-800">Operational Hub</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Register a found newborn/child and record verification log</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 transition text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">Child / Case Name *</label>
              <input required type="text" placeholder="e.g., Found Baby Boy near park" className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-400 bg-gray-50/30" value={formData.child_name} onChange={e => setFormData({ ...formData, child_name: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">Estimated Age</label>
              <input type="text" placeholder="e.g., 2 weeks, Newborn, 3 months" className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-400 bg-gray-50/30" value={formData.estimated_age} onChange={e => setFormData({ ...formData, estimated_age: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">Gender *</label>
              <select className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-400 bg-white" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">Date Found / Recorded *</label>
              <input required type="date" className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-400 bg-gray-50/30" value={formData.date_found} onChange={e => setFormData({ ...formData, date_found: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">Case/Police ID (Optional)</label>
              <input type="text" placeholder="e.g., PL-9921" className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-400 bg-gray-50/30" value={formData.case_id} onChange={e => setFormData({ ...formData, case_id: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">Found Location Description *</label>
            <input required type="text" placeholder="Hospital room number, street crossing, train station, etc." className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-400 bg-gray-50/30" value={formData.found_location} onChange={e => setFormData({ ...formData, found_location: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/20 text-center">
              <label className="block text-[11px] font-semibold text-gray-500 mb-2">Child Photo (Optional)</label>
              <input type="file" accept="image/*" onChange={e => setChildPhoto(e.target.files[0])} className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
            </div>
            <div className="border border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/20 text-center">
              <label className="block text-[11px] font-semibold text-gray-500 mb-2">Footprint Scan * (For AI Match)</label>
              <input required type="file" accept="image/*" onChange={e => setFootprint(e.target.files[0])} className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">Notes & Physical Attributes</label>
            <textarea placeholder="Any identifying marks, clothes color, physiological state..." className="w-full border border-gray-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-blue-400 bg-gray-50/30 min-h-[60px]" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm disabled:bg-gray-300">
              {submitting ? "Processing..." : "Submit Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function VerificationLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("nbis_token");
      const res = await fetch(`${API_URL}/api/logs`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const statusColors = {
    verified: "bg-green-100 text-green-700",
    success: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700"
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Verification Hub</h1>
          <p className="text-xs text-gray-400 mt-1">Monitor real-time AI scan operations, newborn system integrations and matching historical logs.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto">
          <span>+</span> Register Found Case
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">System Activity Logs</h2>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Total: {logs.length}</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-gray-400">Loading records from server...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {/* 🚀 تم تعديل هذا الترتيب ليتوافق تماماً مع خلايا الـ <td> بالأسفل */}
                  {["Child Name", "Verification Type", "Reported By", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((log, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    {/* 1. Child Name */}
                    <td className="px-6 py-3.5 text-xs font-semibold text-gray-700">{log.child?.name_en || log.child_name || "Unknown Child"}</td>
                    {/* 2. Verification Type */}
                    <td className="px-6 py-3.5 text-xs text-gray-600 capitalize">{log.type || "AI Scan"}</td>
                    {/* 3. Reported By */}
                    <td className="px-6 py-3.5 text-xs text-gray-500">{log.user?.name || log.verified_by || "System AI"}</td>
                    {/* 4. Status */}
                    <td className="px-6 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${statusColors[(log.status || log.child?.status || "pending").toLowerCase()] || "bg-gray-100 text-gray-600"}`}>{log.status || log.child?.status || "Pending"}</span></td>
                    {/* 5. Date */}
                    <td className="px-6 py-3.5 text-xs text-gray-400">{log.date || (typeof log.created_at === 'string' ? log.created_at.split('T')[0] : "N/A")}</td>
                    {/* 6. Actions */}
                    <td className="px-6 py-3.5"><button onClick={() => setSelectedChild(log)} className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg">View Details</button></td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-xs text-gray-400">No operations logs fetched.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── DETAIL OVERLAY MODAL ────────────────────────────────────────────── */}
      {selectedChild && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-50 pb-2">Verification Diagnostics</h3>
            <div className="space-y-3 text-left text-xs text-gray-600">
              <p><strong>Case Subject:</strong> {selectedChild.child_name || selectedChild.child?.name_en}</p>
              <p><strong>Log Entry Type:</strong> {selectedChild.type || "Biometric Matching"}</p>
              <p><strong>Status Identifier:</strong> <span className="font-bold text-blue-600 uppercase">{selectedChild.status}</span></p>
              <p><strong>System Timestamp:</strong> {selectedChild.date || selectedChild.created_at}</p>
              <p><strong>Authorized Officer / Node:</strong> {selectedChild.verified_by || "System Automated Module"}</p>

              {selectedChild.child?.footprint_path && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="font-semibold text-gray-500 mb-1.5">Database Fingerprint Image:</p>
                  <img
                    src={`${STORAGE_URL}/storage/${selectedChild.child.footprint_path}`}
                    alt="Footprint"
                    className="w-full h-32 object-contain rounded-xl bg-gray-50 border border-gray-100"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
            <button onClick={() => setSelectedChild(null)} className="mt-5 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-xl transition text-xs">Close Diagnostics</button>
          </div>
        </div>
      )}

      {/* ── ADD FOUND CHILD MODAL ──────────────────────────────────────────── */}
      {showAddModal && (
        <AddFoundChildModal
          onClose={() => setShowAddModal(false)}
          onRefresh={fetchLogs}
        />
      )}
    </div>
  );
}
