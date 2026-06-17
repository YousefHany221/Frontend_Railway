// src/pages/admin/AddUser.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/adminLayout";
import { adminService } from "../../api/admin";

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", status: "active", role: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.password) e.password = "Required";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.role) e.role = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setLoading(true);
      try {
        await adminService.createUser({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          status: form.status,
        });
        setSuccess(true);
      } catch (err) {
        setErrors(err.response?.data || { general: "Failed to create user" });
      } finally {
        setLoading(false);
      }
    }
  };

  if (success) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-100">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Thank You</h2>
            <p className="text-gray-400 text-sm">User Created Successfully</p>
            <button onClick={() => navigate("/admin/members/list")}
              className="mt-2 bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition">
              View Users
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const inputClass = (field) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition text-gray-700 placeholder-gray-300
    ${errors[field] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`;

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
        {show
          ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
          : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
        }
      </svg>
    </button>
  );

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm">+</span>
            Add New User
          </h1>
          <p className="text-gray-400 text-sm mt-1">Create A New User And Assign Role & Permissions</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Full Name*</label>
              <input value={form.fullName} onChange={set("fullName")} className={inputClass("fullName")} placeholder="Enter Full Name" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">⚠ {errors.fullName}</p>}
            </div>
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address*</label>
              <input value={form.email} onChange={set("email")} className={inputClass("email")} placeholder="Enter Email Address" />
              {errors.email && <p className="text-red-500 text-xs mt-1">⚠ {errors.email}</p>}
            </div>
            {/* Phone */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone Number*</label>
              <input value={form.phone} onChange={set("phone")} className={inputClass("phone")} placeholder="+20 010xxxxxxxx" />
              {errors.phone && <p className="text-red-500 text-xs mt-1">⚠ {errors.phone}</p>}
            </div>
            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Password*</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                  className={inputClass("password") + " pr-10"} placeholder="Enter Password" />
                <EyeBtn show={showPass} toggle={() => setShowPass(!showPass)} />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">⚠ {errors.password}</p>}
            </div>
            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Confirm Password*</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={set("confirmPassword")}
                  className={inputClass("confirmPassword") + " pr-10"} placeholder="Confirm Password" />
                <EyeBtn show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">⚠ {errors.confirmPassword}</p>}
            </div>
            {/* Status */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Status*</label>
              <div className="relative">
                <select value={form.status} onChange={set("status")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 focus:border-blue-400 appearance-none bg-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            {/* Role */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Role*</label>
              <div className="relative">
                <select value={form.role} onChange={set("role")}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none appearance-none bg-white
                    ${errors.role ? "border-red-400 bg-red-50 text-gray-400" : "border-gray-200 focus:border-blue-400 text-gray-700"}`}>
                  <option value="">Select Role</option>
                  <option value="nurse">Nurse</option>
                  <option value="user">Parent</option>
                  <option value="police">Police</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {errors.role && <p className="text-red-500 text-xs mt-1">⚠ {errors.role}</p>}
            </div>
          </div>

          {/* General Error */}
          {errors.general && <p className="text-red-500 text-xs text-center">⚠ {errors.general}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
              <span className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">✕</span>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">+</span>
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}