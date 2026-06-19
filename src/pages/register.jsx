import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/authLayout";
import logo from "../assets/Logo 1.png";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await register(formData);
      navigate('/parent/dashboard');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Registration error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <img src={logo} alt="NBIS Logo" className="w-[130px] h-[130px] object-contain mb-2" />
      <p className="text-gray-400 text-xs mb-5">Newborn Biometric ID</p>

      <div className="w-full max-w-sm space-y-4">
        <div className="text-center mb-2">
          <h2 className="text-xl font-bold text-blue-500">Create Account</h2>
          <p className="text-gray-400 text-xs mt-1">Register as a parent to manage your children's records.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Full Name*</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className={`w-full border rounded-xl mt-1 px-3 py-2.5 text-sm outline-none transition placeholder-gray-300 text-gray-700
                ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
              placeholder="Enter your full name"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Email*</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className={`w-full border rounded-xl mt-1 px-3 py-2.5 text-sm outline-none transition placeholder-gray-300 text-gray-700
                ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-400"}`}
              placeholder="user@example.com"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Password*</label>
            <div className={`flex items-center border rounded-xl mt-1 px-3 py-2.5 gap-2 transition
              ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-blue-400"}`}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                className="flex-1 text-sm outline-none bg-transparent placeholder-gray-300 text-gray-700"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  {showPassword
                    ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  }
                </svg>
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Confirm Password*</label>
            <div className={`flex items-center border rounded-xl mt-1 px-3 py-2.5 gap-2 transition
              border-gray-200 focus-within:border-blue-400`}>
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                onChange={handleChange}
                className="flex-1 text-sm outline-none bg-transparent placeholder-gray-300 text-gray-700"
                placeholder="••••••••"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  {showConfirm
                    ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#43A047] hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
          <span>Already have an account?</span>
          <button onClick={() => navigate('/login')} className="text-blue-600 font-semibold hover:underline">
            Log In
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
