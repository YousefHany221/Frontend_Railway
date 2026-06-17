// src/pages/shared/RegisterChildForm.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { childService } from "../../api/child";

export default function RegisterChildForm({ layout: LayoutComponent }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const footprintRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [footprint, setFootprint] = useState(null);
  const [footprintPreview, setFootprintPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    childName: "",
    gender: "",
    birthDate: "",
    motherName: "",
    fatherName: "",
    fatherPhone: "",
    fatherNationalId: "",
    nfcTagId: "",
    estimatedAge: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleFootprint = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFootprint(file);
      setFootprintPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.childName.trim()) e.childName = "Required";
    if (!form.gender) e.gender = "Required";
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
        formData.append('gender', form.gender);
        if (form.birthDate) formData.append('birth_date', form.birthDate);
        if (form.motherName) formData.append('mother_name', form.motherName);
        if (form.fatherName) formData.append('father_name', form.fatherName);
        if (form.fatherPhone) formData.append('father_phone', form.fatherPhone);
        if (form.fatherNationalId) formData.append('father_national_id', form.fatherNationalId);
        if (form.nfcTagId) formData.append('nfc_tag_id', form.nfcTagId);
        if (form.estimatedAge) formData.append('estimated_age', form.estimatedAge);
        if (form.notes) formData.append('notes', form.notes);
        if (photo) formData.append('child_photo', photo);
        if (footprint) formData.append('footprint_image', footprint);

        await childService.registerChild(formData);
        setSuccess(true);
      } catch (err) {
        setErrors({ general: err.response?.data?.message || 'Failed to register child' });
      } finally {
        setLoading(false);
      }
    }
  };

  if (success) {
    return (
      <LayoutComponent>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-100">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Thank You</h2>
            <p className="text-gray-400 text-sm">Child Registered Successfully</p>
            <button onClick={() => navigate(-1)}
              className="mt-2 bg-blue-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition">
              Back
            </button>
          </div>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Register New Child</h1>
          <p className="text-gray-400 text-sm mt-1">Register a child in the system</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="grid grid-cols-2 gap-4">
            {/* Child Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Child Name*</label>
              <input value={form.childName} onChange={set("childName")}
                className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300
                  ${errors.childName ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
                placeholder="Enter child name" />
              {errors.childName && <p className="text-red-500 text-xs mt-1">⚠ {errors.childName}</p>}
            </div>

            {/* Birth Date */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Birth Date</label>
              <input type="date" value={form.birthDate} onChange={set("birthDate")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 focus:border-blue-400" />
            </div>

            {/* Estimated Age */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Estimated Age</label>
              <input value={form.estimatedAge} onChange={set("estimatedAge")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400"
                placeholder="Optional" />
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Gender*</label>
              <div className="relative">
                <select value={form.gender} onChange={set("gender")}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none appearance-none bg-white
                    ${errors.gender ? "border-red-400 bg-red-50 text-gray-400" : "border-gray-200 focus:border-blue-400 text-gray-700"}`}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              {errors.gender && <p className="text-red-500 text-xs mt-1">⚠ {errors.gender}</p>}
            </div>

            {/* Mother Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Mother Name</label>
              <input value={form.motherName} onChange={set("motherName")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400"
                placeholder="Optional" />
            </div>

            {/* Father Name */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Father Name</label>
              <input value={form.fatherName} onChange={set("fatherName")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400"
                placeholder="Optional" />
            </div>

            {/* Father Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Father Phone</label>
              <input value={form.fatherPhone} onChange={set("fatherPhone")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400"
                placeholder="Optional" />
            </div>

            {/* Father National ID */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Father National ID</label>
              <input value={form.fatherNationalId} onChange={set("fatherNationalId")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400"
                placeholder="Optional (14 digits)" />
            </div>

            {/* NFC Tag ID */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">NFC Tag ID</label>
              <input value={form.nfcTagId} onChange={set("nfcTagId")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400"
                placeholder="Optional" />
            </div>

            {/* Photo Upload */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Child Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                )}
                <div className="flex-1">
                  <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  <button onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition w-full">
                    {photo ? photo.name : "Click to upload photo"}
                  </button>
                </div>
              </div>
            </div>

            {/* Footprint Upload */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Footprint Image (optional)</label>
              <div className="flex items-center gap-4">
                {footprintPreview && (
                  <img src={footprintPreview} alt="Footprint preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                )}
                <div className="flex-1">
                  <input ref={footprintRef} type="file" accept="image/*" onChange={handleFootprint} className="hidden" />
                  <button onClick={() => footprintRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition w-full">
                    {footprint ? footprint.name : "Click to upload footprint (optional)"}
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Notes</label>
              <textarea value={form.notes} onChange={set("notes")} rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-300 focus:border-blue-400 resize-none"
                placeholder="Optional" />
            </div>
          </div>

          {errors.general && <p className="text-red-500 text-xs mt-4 text-center">⚠ {errors.general}</p>}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Registering...' : 'Register Child'}
            </button>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
}
