import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // تأكد من المسار الصحيح للـ Context

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // استخدام دالة login من الـ Context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // محاولة تسجيل الدخول عبر الـ Context
      await login(formData);

      // إذا نجح الـ Login، سيتم تحويل المستخدم للـ Dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);

      // التعامل مع الأخطاء القادمة من لارافيل
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors); // أخطاء الـ Validation
      } else {
        setErrors({ email: ['البريد الإلكتروني أو كلمة المرور غير صحيحة.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>تسجيل الدخول</h2>

        <input
          type="email"
          name="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email[0]}</p>}

        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <p className="error">{errors.password[0]}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
      </form>
    </div>
  );
};

export default Login;