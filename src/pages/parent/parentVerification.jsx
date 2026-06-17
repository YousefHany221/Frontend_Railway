// src/pages/parent/ParentVerification.jsx
import { useState, useEffect } from "react";
import ParentLayout from "../../components/ParentLayout";
import { parentService } from "../../api/parent";

function TabBar({ active, setActive }) {
  const tabs = ["Reports", "Submit Report"];
  return (
    <div className="flex gap-1 mb-6 border-b border-gray-200">
      {tabs.map(t => (
        <button key={t} onClick={() => setActive(t)}
          className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px
            ${active === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
          {t}
        </button>
      ))}
    </div>
  );
}

// ── REPORTS TAB ────────────────────────────────────────────────────────────
const reports = [
  { name: "Tia Ahmed", id: "ID:304010112", type: "Missing Child", priority: "High", status: "New", date: "April 2026", avatar: "T" },
  { name: "Randa Elsaeed", id: "ID:404011112", type: "Suspicious Case", priority: "Medium", status: "Under Investigation", date: "April 2026", avatar: "R" },
  { name: "Toto Elsaeed", id: "ID:504022132", type: "Identity Issue", priority: "Verified", status: "Resolved", date: "March 2026", avatar: "T" },
  { name: "Marim Elsaeed", id: "ID:306080112", type: "Identity Issue", priority: "Verified", status: "Closed", date: "March 2026", avatar: "M" },
];

const priorityStyle = {
  High: "bg-red-100 text-red-500",
  Medium: "bg-yellow-100 text-yellow-600",
  Verified: "bg-green-100 text-green-600",
};

const statusStyle = {
  New: "bg-blue-100 text-blue-600",
  "Under Investigation": "bg-orange-100 text-orange-500",
  Resolved: "bg-green-100 text-green-600",
  Closed: "bg-gray-100 text-gray-500",
};

function ReportsTab() {
  const [search, setSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("All Reports");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch reports from API when endpoint is available
    setReports([]);
    setLoading(false);
  }, []);

  const filtered = reports.filter(r => {
    const matchSearch = r.name?.toLowerCase().includes(search.toLowerCase()) || r.id?.includes(search);
    const matchReport = reportFilter === "All Reports" || r.type === reportFilter;
    const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
    return matchSearch && matchReport && matchStatus;
  });

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 max-w-sm">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent flex-1"
            placeholder="Search By Child Name Or ID..." />
        </div>
        {[
          { val: reportFilter, set: setReportFilter, opts: ["All Reports", "Missing Child", "Suspicious Case", "Identity Issue"] },
          { val: statusFilter, set: setStatusFilter, opts: ["All Status", "New", "Under Investigation", "Resolved", "Closed"] }
        ].map(({ val, set, opts }, i) => (
          <div key={i} className="relative">
            <select value={val} onChange={e => set(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-600 appearance-none bg-white pr-8 focus:border-blue-400">
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-400">Loading reports...</div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">No reports found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Child Name", "Reported by", "Priority", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id || i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                        {r.child_name?.charAt(0) || r.name?.charAt(0) || 'R'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{r.child_name || r.name}</p>
                        <p className="text-xs text-gray-400">{r.child_id || r.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-500">{r.report_type || r.type}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyle[r.priority]}`}>{r.priority}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-gray-400">{r.date}</td>
                  <td className="px-5 py-3">
                    <button 
                      onClick={() => {/* TODO: Add view details functionality */}}
                      className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      View Details
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-5 py-3 flex items-center gap-2 border-t border-gray-100">
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <span className="text-xs text-gray-400">1–{filtered.length}</span>
        </div>
      </div>
    </>
  );
}

// ── SUBMIT REPORT TAB ──────────────────────────────────────────────────────
function SubmitReportTab() {
  const [form, setForm] = useState({
    childName: "", childId: "", reportType: "", lastSeen: "", lastLocation: "", description: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.childName.trim()) e.childName = "Required";
    if (!form.reportType) e.reportType = "Required";
    if (!form.lastSeen) e.lastSeen = "Required";
    if (!form.lastLocation.trim()) e.lastLocation = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setLoading(true);
      try {
        await parentService.reportMissing({
          child_name: form.childName,
          child_id: form.childId,
          report_type: form.reportType,
          last_seen: form.lastSeen,
          last_location: form.lastLocation,
          description: form.description,
        });
        setSuccess(true);
      } catch (err) {
        setErrors({ general: err.response?.data?.message || 'Failed to submit report' });
      } finally {
        setLoading(false);
      }
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-100">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Thank You</h2>
          <p className="text-gray-400 text-sm text-center">Your Report Has Been Received. We Will Review It Shortly.</p>
          <button onClick={() => { setSuccess(false); setForm({ childName: "", childId: "", reportType: "", lastSeen: "", lastLocation: "", description: "" }); }}
            className="mt-2 bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition">
            Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  const inputClass = k =>
    `w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition text-gray-700 placeholder-gray-300
    ${errors[k] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`;

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm">Submit a Report</p>
            <p className="text-xs text-gray-400">Report a missing child or suspicious activity</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Child Name*</label>
            <input value={form.childName} onChange={set("childName")} className={inputClass("childName")} placeholder="Enter child's name" />
            {errors.childName && <p className="text-red-500 text-xs mt-1">⚠ {errors.childName}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Child ID</label>
            <input value={form.childId} onChange={set("childId")} className={inputClass("childId")} placeholder="e.g. ID:304010112" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Report Type*</label>
            <div className="relative">
              <select value={form.reportType} onChange={set("reportType")}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none appearance-none bg-white
                  ${errors.reportType ? "border-red-400 bg-red-50 text-gray-400" : "border-gray-200 text-gray-700 focus:border-blue-400"}`}>
                <option value="">Select Report Type</option>
                <option>Missing Child</option>
                <option>Suspicious Case</option>
                <option>Identity Issue</option>
                <option>Other</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {errors.reportType && <p className="text-red-500 text-xs mt-1">⚠ {errors.reportType}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Last Seen Date*</label>
            <div className="relative">
              <input type="date" value={form.lastSeen} onChange={set("lastSeen")}
                className={inputClass("lastSeen") + " pr-10"} />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            {errors.lastSeen && <p className="text-red-500 text-xs mt-1">⚠ {errors.lastSeen}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Last Known Location*</label>
            <input value={form.lastLocation} onChange={set("lastLocation")} className={inputClass("lastLocation")} placeholder="e.g. Cairo Hospital" />
            {errors.lastLocation && <p className="text-red-500 text-xs mt-1">⚠ {errors.lastLocation}</p>}
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
            <textarea value={form.description} onChange={set("description")} rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400 resize-none"
              placeholder="Provide any additional details that might help..." />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={() => setForm({ childName: "", childId: "", reportType: "", lastSeen: "", lastLocation: "", description: "" })}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            <span className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">✕</span>
            Clear
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
        {errors.general && (
          <p className="text-red-500 text-xs mt-2 text-center">⚠ {errors.general}</p>
        )}
      </div>
    </div>
  );
}

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function ParentVerification() {
  const [activeTab, setActiveTab] = useState("Reports");

  return (
    <ParentLayout>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
          </svg>
          Verification Requests
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {activeTab === "Reports" ? "View your submitted reports" : "Submit a new report"}
        </p>
      </div>
      <TabBar active={activeTab} setActive={setActiveTab} />
      {activeTab === "Reports" && <ReportsTab />}
      {activeTab === "Submit Report" && <SubmitReportTab />}
    </ParentLayout>
  );
}