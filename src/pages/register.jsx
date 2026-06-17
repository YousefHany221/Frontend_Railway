import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardPath } from "../context/AuthContext";
import AuthLayout from "../components/authLayout";
import logo from "../assets/Logo 1.png";

function Register() {
  const navigate = useNavigate();
  const { register, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardPath(user.role));
    }
  }, [isAuthenticated, user, navigate]);
  const [form, setForm] = useState({
    fullName: "",
    id: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full Name Is Required";
    if (!form.id.trim()) e.id = "Email Is Required";
    if (!form.phone.trim()) e.phone = "Phone Number Is Required";
    if (!/^\+20\d{10,}$/.test(form.phone.replace(/\s/g, ''))) e.phone = "Phone must start with +20 followed by 10+ digits";
    if (form.password.length < 8) e.password = "Password Must Be At Least 8 Characters";
    else if (!/[a-zA-Z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = "Password Must Include Letters And Numbers";
    if (form.confirmPassword !== form.password)
      e.confirmPassword = "Passwords Do Not Match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    setSubmitted(true);
    
    if (Object.keys(e).length === 0) {
      setLoading(true);
      const result = await register({
        name: form.fullName,
        email: form.id,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.confirmPassword,
      });
      setLoading(false);
      
      if (result.success) {
        navigate(getDashboardPath(result.user.role));
      } else {
        if (result.errors) {
          const apiErrors = {};
          if (result.errors.name) apiErrors.fullName = result.errors.name[0];
          if (result.errors.email) apiErrors.id = result.errors.email[0];
          if (result.errors.phone) apiErrors.phone = result.errors.phone[0];
          if (result.errors.password) apiErrors.password = result.errors.password[0];
          setErrors(apiErrors);
        } else {
          setErrors({ general: result.error });
        }
      }
    }
  };

  const EyeIcon = ({ open }) => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
      {open
        ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
        : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
      }
    </svg>
  );

  return (
    <AuthLayout>
      <img src={logo} alt="NBIS Logo" className="w-[110px] h-[110px] object-contain mb-1" />

      <div className="w-full max-w-sm space-y-3">

        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Full Name*</label>
          <input
            value={form.fullName}
            onChange={set("fullName")}
            className={`w-full border rounded-xl mt-1 px-3 py-2.5 text-sm outline-none transition text-gray-700
              ${submitted && errors.fullName
                ? "border-red-400 bg-red-50 placeholder-gray-400"
                : "border-gray-200 focus:border-blue-400 placeholder-gray-300"}`}
            placeholder="Enter Full Name"
          />
          {submitted && errors.fullName && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Email*</label>
          <div className={`flex items-center border rounded-xl mt-1 px-3 py-2.5 gap-2 transition
            ${submitted && errors.id
              ? "border-red-400 bg-red-50"
              : "border-gray-200 focus-within:border-blue-400"}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-gray-300 text-sm">|</span>
            <input
              value={form.id}
              onChange={set("id")}
              className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
              placeholder="email@example.com"
            />
          </div>
          {submitted && errors.id && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.id}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Phone*</label>
          <input
            value={form.phone}
            onChange={set("phone")}
            className={`w-full border rounded-xl mt-1 px-3 py-2.5 text-sm outline-none transition text-gray-700
              ${submitted && errors.phone
                ? "border-red-400 bg-red-50 placeholder-gray-400"
                : "border-gray-200 focus:border-blue-400 placeholder-gray-300"}`}
            placeholder="+20 1234567890"
          />
          {submitted && errors.phone && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Password*</label>
          <div className={`flex items-center border rounded-xl mt-1 px-3 py-2.5 gap-2 transition
            ${submitted && errors.password
              ? "border-red-400 bg-red-50"
              : "border-gray-200 focus-within:border-blue-400"}`}>
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
              className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
              placeholder="••••••••••••••"
            />
            <button onClick={() => setShowPass(!showPass)}>
              <EyeIcon open={showPass} />
            </button>
          </div>
          {submitted && errors.password && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-semibold text-gray-600">Confirm Password*</label>
          <div className={`flex items-center border rounded-xl mt-1 px-3 py-2.5 gap-2 transition
            ${submitted && errors.confirmPassword
              ? "border-red-400 bg-red-50"
              : "border-gray-200 focus-within:border-blue-400"}`}>
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
              className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
              placeholder="••••••••••••••"
            />
            <button onClick={() => setShowConfirm(!showConfirm)}>
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {submitted && errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">⚠ {errors.confirmPassword}</p>
          )}
        </div>

        {/* Create Account Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#1E88E5] hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        {submitted && errors.general && (
          <p className="text-red-500 text-xs text-center mt-2">⚠ {errors.general}</p>
        )}

        {/* Social */}
        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <div className="flex-1 h-px bg-gray-200" />
          <span>Or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <a href="https://accounts.google.com/signin" target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue With Google
        </a>

        <a href="https://www.facebook.com/login" target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue With Facebook
        </a>

        <p className="text-center text-xs text-gray-400">
          Already Have An Account?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-500 font-semibold hover:underline">
            Log In
          </button>
        </p>

      </div>
    </AuthLayout>
  );
}

export default Register;