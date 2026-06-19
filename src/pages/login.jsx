import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // تأكد من صحة مسار الـ Context عندك

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // استخدام دالة login من الـ Context المحدث
  const navigate = useNavigate();

  // دالة التعامل مع التغيير في الحقول وضمان ربطها بالـ Name الخاص بكل حقل
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // محاولة تسجيل الدخول وتمرير البيانات للباكيند عبر الـ Context بأمان
      await login(formData);

      // إذا نجح الـ Login، سيتم تحويل المستخدم للـ Dashboard فوراً
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);

      // 🎯 تتبع أخطاء الـ Validation الحقيقية القادمة من لارافيل داخل الـ Console
      if (error.response && error.response.data) {
        console.log("Laravel Response Error Data:", error.response.data);
      }

      // التعامل مع أخطاء الـ Validation وعرضها على الواجهة
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors); // أخطاء الـ Validation القادمة كـ JSON
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

        {/* عرض الأخطاء العامة مثل خطأ 401 أو خطأ السيرفر */}
        {errors.auth && <div className="error-message global-error">{errors.auth[0]}</div>}
        {errors.global && <div className="error-message global-error">{errors.global[0]}</div>}

        <div className="form-group">
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            name="email" // ⚠️ هذا السطر المصيري الذي يمنع خطأ 422 ويقوم بربط البيانات
            value={formData.email}
            onChange={handleChange}
            placeholder="example@domain.com"
            required
          />
          {/* عرض خطأ الـ Validation الخاص بالإيميل إذا وجد */}
          {errors.email && <span className="error-message text-danger">{errors.email[0]}</span>}
        </div>

        <div className="form-group">
          <label>كلمة المرور</label>
          <input
            type="password"
            name="password" // ⚠️ هذا السطر المصيري الذي يمنع خطأ 422 ويقوم بربط البيانات
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          {/* عرض خطأ الـ Validation الخاص بكلمة المرور إذا وجد */}
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