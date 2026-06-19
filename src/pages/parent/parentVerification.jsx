// src/pages/parent/ParentVerification.jsx
import { useState, useEffect } from "react";
import ParentLayout from "../../components/parentLayout";
import { parentService } from "../../api/parent";

// ── TAB BAR COMPONENT ──────────────────────────────────────────────────────
function TabBar({ active, setActive }) {
  const tabs = ["Reports", "Submit Report"];
  return (
    <div className="flex gap-1 mb-6 border-b border-gray-200">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={`px-4 py-2.5 text-sm font-medium transition border-b-2 -mb-px
            ${active === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ── REPORTS TAB (عرض التقارير بعد التعديل والتأمين) ───────────────────────────
function ReportsTab() {
  const [reportsList, setReportsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await parentService.getReports();
        setReportsList(data || []);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const priorityColors = {
    High: "bg-red-50 text-red-600 border border-red-100",
    Medium: "bg-yellow-50 text-yellow-600 border border-yellow-100",
    Low: "bg-blue-50 text-blue-600 border border-blue-100"
  };

  const statusColors = {
    new: "bg-blue-100 text-blue-700",
    pending: "bg-yellow-100 text-yellow-700",
    "under investigation": "bg-purple-100 text-purple-700",
    verified: "bg-green-100 text-green-700",
    resolved: "bg-green-100 text-green-700"
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-5 border-b border-gray-50 flex justify-between items-center">
        <h2 className="font-bold text-gray-800 text-lg">Verification & Missing Reports</h2>
        <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg font-medium">
          Total: {reportsList.length} Reports
        </span>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading reports...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {["Child Info", "Type", "Priority", "Status", "Date Created"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reportsList.map((rep, index) => {
                // استخراج اسم الطفل بشكل آمن وتأمين الحرف الأول للـ Avatar
                const currentChildName = rep.child_name || rep.child?.name_en || rep.child?.name_ar || "Unknown Child";
                const firstLetter = currentChildName.charAt(0) || "C";

                // توحيد الحروف الصغيرة للحالة لتطابق الألوان
                const currentStatus = (rep.status || "pending").toLowerCase();
                // وضع أولوية افتراضية لأن الباك إند لا يحتوي على حقل الأولوية حالياً
                const currentPriority = rep.priority || "Medium";

                return (
                  <tr key={rep.id || index} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shadow-sm border border-blue-100/50">
                          {rep.avatar || firstLetter}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-800 block">{currentChildName}</span>
                          <span className="text-xs text-gray-400 font-mono">ID: {rep.child_id || rep.id || "-"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{rep.type || "Missing Report"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${priorityColors[currentPriority] || "bg-gray-100"}`}>
                        {currentPriority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${statusColors[currentStatus] || "bg-gray-100 text-gray-600"}`}>
                        {rep.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {rep.date || (typeof rep.created_at === 'string' ? rep.created_at.split('T')[0] : "N/A")}
                    </td>
                  </tr>
                );
              })}
              {reportsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                    No reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── SUBMIT REPORT TAB (إضافة تقرير) ───────────────────────────────────────────
function SubmitReportTab({ onSuccessTab }) {
  const [children, setChildren] = useState([]);
  const [childrenLoading, setChildrenLoading] = useState(true);
  const [formData, setFormData] = useState({ child_id: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchChildrenList = async () => {
      try {
        const data = await parentService.getMyChildren();
        const list = data || [];
        setChildren(list);
        if (list.length > 0) {
          setFormData(prev => ({ ...prev, child_id: list[0].id }));
        }
      } catch (err) {
        console.error("Failed to load children for selection", err);
      } finally {
        setChildrenLoading(false);
      }
    };
    fetchChildrenList();
  }, []);

  const handleChange = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.child_id) {
      setErrors({ general: "Please select a child first." });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      await parentService.reportMissing({
        child_id: parseInt(formData.child_id),
        notes: formData.notes
      });
      setSuccess(true);
      setTimeout(() => onSuccessTab("Reports"), 2000);
    } catch (err) {
      setErrors({ general: err.response?.data?.message || "Failed to submit report." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl p-6">
      <h2 className="font-bold text-gray-800 text-lg mb-4">Submit New Case</h2>

      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">✅ Submitted successfully!</div>}
      {errors.general && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">❌ {errors.general}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Select Child</label>
          {childrenLoading ? (
            <div className="text-sm text-gray-400">Loading your children...</div>
          ) : children.length === 0 ? (
            <div className="text-sm text-red-500 font-medium">No children registered to report.</div>
          ) : (
            <select
              value={formData.child_id}
              onChange={handleChange("child_id")}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-blue-400"
            >
              {children.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name_en || c.name_ar || c.name} (ID: {c.id})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Notes / Details</label>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-400 min-h-[100px]"
            placeholder="Provide any description or notes..."
            value={formData.notes}
            onChange={handleChange("notes")}
          />
        </div>

        <button
          type="submit"
          disabled={loading || children.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium px-6 py-2.5 rounded-xl transition text-sm shadow-sm"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function ParentVerification() {
  const [activeTab, setActiveTab] = useState("Reports");
  return (
    <ParentLayout>
      <h1 className="text-xl font-bold mb-5">Verification & Cases</h1>
      <TabBar active={activeTab} setActive={setActiveTab} />
      {activeTab === "Reports" ? <ReportsTab /> : <SubmitReportTab onSuccessTab={setActiveTab} />}
    </ParentLayout>
  );
}