// src/pages/shared/VerificationLogs.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { childService } from "../../api/child";
import client from "../../api/client";

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
                <img src={childPhotoUrl} alt={child.child_name} className="w-full h-48 object-cover rounded-xl border border-gray-200" />
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
                    <p className="text-sm font-medium text-gray-800">{child.child_name}</p>
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

            {/* Report Information */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">Report Information</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Reported By</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{child.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-800">{child.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared Tab Bar ─────────────────────────────────────────────────────────
function TabBar({ active, setActive }) {
  const tabs = ["Reports", "Scan Child", "Add Found Child"];
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
const statusStyle = {
  safe: "bg-blue-100 text-blue-600",
  pending: "bg-yellow-100 text-yellow-600",
  verified: "bg-green-100 text-green-600",
  missing: "bg-red-100 text-red-500",
};

function ReportsTab() {
  const [search, setSearch] = useState("");
  const [reportFilter, setReportFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const response = await client.get("/verification-logs");
        setReports(response.data?.data ?? []);
      } catch (error) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const filtered = reports.filter(r => {
    const typeValue = (r.type ?? "").toLowerCase();
    const nameValue = (r.child_name ?? "").toLowerCase();
    const statusValue = r.status ?? "";
    const matchSearch = nameValue.includes(search.toLowerCase());
    const matchReport = reportFilter === "all" || typeValue === reportFilter;
    const matchStatus = statusFilter === "All Status" || statusValue === statusFilter;
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
        {[{ val: reportFilter, set: setReportFilter, opts: ["all", "admin", "parent"] },
          { val: statusFilter, set: setStatusFilter, opts: ["All Status", "safe", "pending", "verified", "missing"] }
        ].map(({ val, set, opts }, i) => (
          <div key={i} className="relative">
            <select value={val} onChange={e => set(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none text-gray-600 appearance-none bg-white pr-8 focus:border-blue-400">
              {opts.map(o => <option key={o} value={o}>{o === "all" ? "All Reports" : o}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Child Name", "Reported by", "Verification Type", "Status", "Date", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">Loading reports...</td>
              </tr>
            ) : filtered.map((r, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {(r.child_name?.[0] ?? "C").toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{r.child_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">{r.type}</td>
                <td className="px-5 py-3 text-sm text-gray-500 capitalize">{r.type}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[r.status] ?? "bg-gray-100 text-gray-500"}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-400">{r.date}</td>
                <td className="px-5 py-3">
                  <button 
                    onClick={() => setSelectedChild(r)}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
      {selectedChild && <ChildDetailModal child={selectedChild} onClose={() => setSelectedChild(null)} />}
    </>
  );
}

// ── SCAN CHILD TAB ─────────────────────────────────────────────────────────
function ScanChildTab() {
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('fingerprint_image', file);
      
      const response = await childService.validateFootprint(formData);
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to validate footprint');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setPhoto(null); setPreview(null); setResult(null); setError(null); };

  return (
    <div className="max-w-2xl">
      {!photo ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center gap-5">
          <p className="text-base font-semibold text-gray-700">Upload Child Footprint</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button onClick={() => fileRef.current?.click()} disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-xl transition w-56 justify-center shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            {loading ? 'Validating...' : 'Upload Footprint'}
          </button>
          <div className="flex items-center gap-3 w-56">
            <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-8 py-3 rounded-xl hover:bg-gray-50 transition w-56 justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Scan Fingerprint
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {/* Photo */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-gray-700 mb-1 text-sm">Child Photo</p>
            <p className="text-xs text-gray-400 mb-3">Preview Of The Uploaded Image</p>
            <img src={preview} alt="Child" className="w-full h-48 object-cover rounded-xl" />
            <button onClick={handleReset}
              className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-500 text-xs py-2 rounded-xl hover:bg-gray-50 transition">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Change Photo
            </button>
          </div>

          {/* Result */}
          <div className="flex items-center">
            {loading && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 w-full text-center">
                <p className="text-gray-500">Validating footprint...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 w-full">
                <p className="font-bold text-red-500 mb-2">Error</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            )}
            {result && result.reason === "verified" && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 w-full">
                <p className="font-bold text-green-600 flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Match Found
                </p>
                <div className="space-y-1.5 text-sm">
                  <p><span className="text-gray-500">Status :</span> <span className="font-semibold text-green-600">Verified</span></p>
                  <p><span className="text-gray-500">Message :</span> <span className="font-semibold text-gray-800">{result.message || 'Matched successfully'}</span></p>
                </div>
              </div>
            )}
            {result && result.reason === "not_found" && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 w-full">
                <p className="font-bold text-red-500 flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  </svg>
                  Reported as Missing
                </p>
                <div className="space-y-1.5 text-sm">
                  <p className="text-gray-500">{result.message || "No matching child was found."}</p>
                </div>
              </div>
            )}
            {result && result.reason === "ai_unavailable" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 w-full">
                <p className="font-bold text-yellow-600 flex items-center gap-2 mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                  No Match Found
                </p>
                <p className="text-xs text-gray-500 mb-4">{result.message || "AI service is currently unavailable. Please try again later."}</p>
                <div className="flex gap-2">
                  <button onClick={handleReset}
                    className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition">
                    Check Another Footprint
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── ADD FOUND CHILD TAB ────────────────────────────────────────────────────
function AddFoundChildTab() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    childName: "", estimatedAge: "", gender: "", foundLocation: "", dateFound: "", caseId: "", reportType: "", notes: "",
  });
  const [errors, setErrors] = useState({});

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.childName.trim()) e.childName = "Required";
    if (!form.foundLocation.trim()) e.foundLocation = "Required";
    if (!form.dateFound) e.dateFound = "Required";
    if (!form.reportType) e.reportType = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', form.childName);
        formData.append('mother_name', 'Unknown');
        formData.append('father_name', 'Unknown');
        if (form.gender) {
          formData.append('gender', form.gender.toLowerCase());
        }
        if (form.dateFound) {
          formData.append('birth_date', form.dateFound);
        }
        formData.append('father_phone', '');
        formData.append('father_national_id', '');
        if (photo) formData.append('footprint_image', photo);

        await childService.registerChild(formData);
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
          <p className="text-gray-400 text-sm">Child Report Submitted Successfully</p>
        </div>
      </div>
    );
  }

  const inputClass = k =>
    `w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition text-gray-700 placeholder-gray-300
    ${errors[k] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`;

  return (
    <div className="grid grid-cols-2 gap-6 max-w-4xl">
      {/* Left — Photo */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Child Photo</h2>
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-4 bg-gray-50">
          {preview ? (
            <img src={preview} alt="Child" className="w-36 h-36 object-cover rounded-xl" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
          <p className="text-sm font-medium text-gray-600">Upload Child Photo</p>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition w-full justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Photo
          </button>
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400">Or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-50 transition w-full justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Scan Fingerprint
          </button>
        </div>
      </div>

      {/* Right — Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Child Information</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Child Name*</label>
            <input value={form.childName} onChange={set("childName")} className={inputClass("childName")} placeholder="Unknown" />
            {errors.childName && <p className="text-red-500 text-xs mt-1">⚠ {errors.childName}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Estimated Age</label>
            <input value={form.estimatedAge} onChange={set("estimatedAge")} className={inputClass("estimatedAge")} placeholder="e.g. 3 months" />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Gender</label>
            <div className="relative">
              <select value={form.gender} onChange={set("gender")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none appearance-none bg-white text-gray-700 focus:border-blue-400">
                <option value="">Male / Female</option>
                <option>male</option>
                <option>female</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Found Location*</label>
            <input value={form.foundLocation} onChange={set("foundLocation")} className={inputClass("foundLocation")} placeholder="e.g. Cairo Hospital" />
            {errors.foundLocation && <p className="text-red-500 text-xs mt-1">⚠ {errors.foundLocation}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Date Found*</label>
            <input type="date" value={form.dateFound} onChange={set("dateFound")} className={inputClass("dateFound")} />
            {errors.dateFound && <p className="text-red-500 text-xs mt-1">⚠ {errors.dateFound}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Case ID</label>
            <input value={form.caseId} onChange={set("caseId")} className={inputClass("caseId")} placeholder="Auto-generated" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Report Type*</label>
            <div className="relative">
              <select value={form.reportType} onChange={set("reportType")}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none appearance-none bg-white
                  ${errors.reportType ? "border-red-400 bg-red-50 text-gray-400" : "border-gray-200 text-gray-700 focus:border-blue-400"}`}>
                <option value="">Select Type</option>
                <option>Missing Child</option>
                <option>Suspicious Case</option>
                <option>Identity Issue</option>
                <option>Found Child</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {errors.reportType && <p className="text-red-500 text-xs mt-1">⚠ {errors.reportType}</p>}
          </div>
          <div className="col-span-2">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400 resize-none"
              placeholder="Additional Details (Optional)" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            <span className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">✕</span>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">+</span>
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

// ── MAIN PAGE ──────────────────────────────────────────────────────────────
export default function VerificationLogs({ layout: LayoutComponent }) {
  const [activeTab, setActiveTab] = useState("Reports");

  return (
    <LayoutComponent>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {activeTab === "Reports" ? "Verification Logs" : "Scan Child Identity"}
        </h1>
        <p className="text-gray-400 text-sm mt-0.5">
          {activeTab === "Reports" ? "Manage Reports Submitted By Parents" : "Identify A Child Using Biometric Data"}
        </p>
      </div>
      <TabBar active={activeTab} setActive={setActiveTab} />
      {activeTab === "Reports" && <ReportsTab />}
      {activeTab === "Scan Child" && <ScanChildTab />}
      {activeTab === "Add Found Child" && <AddFoundChildTab />}
    </LayoutComponent>
  );
}
