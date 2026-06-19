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
      // محاولة تسجيل الدخول
      const data = await login(formData);

      // 🎯 الحل السحري: قراءة الـ role وتوجيهه لمسار صحيح موجود في App.jsx لمنع الصفحة البيضاء
      const userRole = data?.user?.role || JSON.parse(localStorage.getItem('nbis_user'))?.role;

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'nurse') {
        navigate('/nurse/dashboard');
      } else if (userRole === 'police') {
        navigate('/police/dashboard');
      } else {
        navigate('/parent/dashboard'); // أولياء الأمور
      }

    } catch (error) {
      console.error("Login failed:", error);

      if (error.response && error.response.data) {
        console.log("Laravel Response Error Data:", error.response.data);
      }

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
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>تسجيل الدخول - NBIS</h2>

        {errors.auth && <div className="error-message global-error">{errors.auth[0]}</div>}
        {errors.global && <div className="error-message global-error">{errors.global[0]}</div>}

        <div className="form-group">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@domain.com"
            required
          />
          {errors.email && <span className="error-message text-danger">{errors.email[0]}</span>}
        </div>

        <div className="form-group">
          <label>كلمة المرور</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          {errors.password && <span className="error-message text-danger">{errors.password[0]}</span>}
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'جاري التحقق...' : 'دخول'}
        </button>
      </form>
    </div>
  );
};

export default Login;