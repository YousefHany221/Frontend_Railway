import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      await login(formData);
      navigate('/admin/dashboard'); // تعديل المسار حسب توجيهات لوحة التحكم الخاصة بك
    } catch (error) {
      console.error("Login failed:", error);
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.status === 401) {
        setErrors({ auth: [error.response.data.message || 'بيانات الاعتماد غير صحيحة.'] });
      } else {
        setErrors({ global: ['حدث خطأ في الاتصال بالسيرفر، برجاء المحاولة لاحقاً.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            تسجيل الدخول - NBIS
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            نظام التعرف على الأطفال حديثي الولادة
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.auth && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">{errors.auth[0]}</div>}
          {errors.global && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">{errors.global[0]}</div>}

          <div className="rounded-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="example@domain.com"
                required
              />
              {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email[0]}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="••••••••"
                required
              />
              {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password[0]}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? 'جاري التحقق...' : 'دخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;