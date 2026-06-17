// src/pages/admin/Profile.jsx
import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/auth";

export default function Profile({ layout: Layout = AdminLayout }) {
  const { user, getCurrentUser } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", currentPass: "", newPass: "", confirmPass: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPass: "",
        newPass: "",
        confirmPass: "",
      });
      if (user.profile_photo_path) {
        setPhotoPreview(`http://localhost:8000/storage/${user.profile_photo_path}`);
        console.log('Profile photo path:', user.profile_photo_path);
        console.log('Photo preview URL:', `http://localhost:8000/storage/${user.profile_photo_path}`);
      }
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const toggle = k => setShow(s => ({ ...s, [k]: !s[k] }));

  const handleSave = async () => {
    setErrors({});
    setLoading(true);
    try {
      // Update profile info (only send non-empty fields)
      const formData = new FormData();
      if (form.fullName) formData.append('name', form.fullName);
      if (form.email) formData.append('email', form.email);
      if (form.phone) formData.append('phone', form.phone);
      if (profilePhoto) {
        formData.append('profile_photo', profilePhoto);
      }

      console.log('Form data:', { fullName: form.fullName, email: form.email, phone: form.phone, profilePhoto });
      console.log('FormData entries:', Array.from(formData.entries()));

      // Only call updateProfile if there's something to update
      if (form.fullName || form.email || form.phone || profilePhoto) {
        console.log('Sending profile update with data:', formData);
        const result = await authService.updateProfile(formData);
        console.log('Profile update result:', result);
      } else {
        console.log('No data to update, skipping profile update');
      }

      // Update password if provided (requires all 3 fields)
      if (form.newPass) {
        if (!form.currentPass) {
          setErrors({ currentPass: "Current password is required" });
          setLoading(false);
          return;
        }
        if (form.newPass !== form.confirmPass) {
          setErrors({ password: "Passwords do not match" });
          setLoading(false);
          return;
        }
        await authService.updatePassword({
          current_password: form.currentPass,
          password: form.newPass,
          password_confirmation: form.confirmPass,
        });
      }

      // Refresh user data
      await getCurrentUser();

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setErrors(err.response?.data || { general: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = k =>
    `w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition text-gray-700 placeholder-gray-300
    ${errors[k] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`;

  const EyeBtn = ({ field }) => (
    <button type="button" onClick={() => toggle(field)} className="absolute right-3 top-1/2 -translate-y-1/2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
        {show[field]
          ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
          : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
        }
      </svg>
    </button>
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="relative">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-blue-200" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <button onClick={() => fileRef.current?.click()} className="absolute bottom-0 right-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow hover:bg-blue-700 transition">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
            <div>
              <p className="font-bold text-gray-800">{user?.name || 'User'}</p>
              <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">{user?.role || 'Admin'}</span>
            </div>
          </div>

          {/* Success Banner */}
          {saved && (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className="text-sm text-green-700 font-medium">Account Information Updated</p>
              </div>
              <button onClick={() => setSaved(false)} className="text-green-400 hover:text-green-600">✕</button>
            </div>
          )}

          {/* Personal Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <p className="text-sm font-semibold text-gray-700">Personal Information</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                <input value={form.fullName} onChange={set("fullName")} className={inputClass("fullName")} placeholder="" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">⚠ {errors.fullName}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email Address</label>
                <input value={form.email} onChange={set("email")} className={inputClass("email")} placeholder="" />
                {errors.email && <p className="text-red-500 text-xs mt-1">⚠ {errors.email}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Phone Number</label>
                <input value={form.phone} onChange={set("phone")} className={inputClass("phone")} placeholder="" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">⚠ {errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <p className="text-sm font-semibold text-gray-700">Change Password</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Current Password", field: "current", key: "currentPass" },
                { label: "New Password", field: "new", key: "newPass" },
                { label: "Confirm Password", field: "confirm", key: "confirmPass" },
              ].map(({ label, field, key }) => (
                <div key={field}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <div className="relative">
                    <input type={show[field] ? "text" : "password"} value={form[key]} onChange={set(key)}
                      className={inputClass(key) + " pr-10"} placeholder="••••••••••••••" />
                    <EyeBtn field={field} />
                  </div>
                  {errors[key] && <p className="text-red-500 text-xs mt-1">⚠ {errors[key]}</p>}
                </div>
              ))}
              {errors.password && <p className="text-red-500 text-xs mt-1">⚠ {errors.password}</p>}
              <p className="text-xs text-gray-400">Password Must Be At Least 8 Characters Long</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
              <span className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">✕</span>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
              </svg>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {errors.general && (
            <p className="text-red-500 text-xs mt-2 text-center">⚠ {errors.general}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}