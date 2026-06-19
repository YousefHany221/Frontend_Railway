import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/authLayout";
import logo from "../assets/Logo 1.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const data = await login(formData);

      const userRole = data?.user?.role || JSON.parse(localStorage.getItem('nbis_user'))?.role;

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'nurse') {
        navigate('/nurse/dashboard');
      } else if (userRole === 'police') {
        navigate('/police/dashboard');
      } else {
        navigate('/parent/dashboard');
      }

    } catch (error) {
      console.error("Login failed:", error);

      if (error.response && error.response.data) {
        console.log("Laravel Response Error Data:", error.response.data);
      }

      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.status === 401) {
        setErrors({ auth: [error.response.data.message || 'Invalid credentials.'] });
      } else {
        setErrors({ global: ['A connection error occurred, please try again later.'] });
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
          <h2 className="text-xl font-bold text-blue-500">Welcome Back</h2>
          <p className="text-gray-400 text-xs mt-1">Log in to access your NBIS dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {errors.auth && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5 text-center">
              {errors.auth[0]}
            </div>
          )}
          {errors.global && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5 text-center">
              {errors.global[0]}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Email*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
                value={formData.password}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E88E5] hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
          <span>Don't have an account?</span>
          <button onClick={() => navigate('/register')} className="text-blue-600 font-semibold hover:underline">
            Register
          </button>
        </div>
        <div className="text-center">
          <button onClick={() => navigate('/forgot-password')} className="text-xs text-gray-400 hover:text-blue-500 transition">
            Forgot Password?
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;