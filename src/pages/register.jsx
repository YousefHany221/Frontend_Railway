import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext"; // 🎯 رجوع خطوة واحدة وليس خطوتين

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      navigate('/dashboard'); // أو أي صفحة تريد تحويل المستخدم إليها بعد التسجيل
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors); // عرض أخطاء الـ Validation
      } else {
        console.error("Registration error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <h2>إنشاء حساب جديد</h2>

        <input type="text" name="name" placeholder="الاسم" onChange={handleChange} required />
        {errors.name && <p className="error">{errors.name[0]}</p>}

        <input type="email" name="email" placeholder="البريد الإلكتروني" onChange={handleChange} required />
        {errors.email && <p className="error">{errors.email[0]}</p>}

        <input type="password" name="password" placeholder="كلمة المرور" onChange={handleChange} required />
        {errors.password && <p className="error">{errors.password[0]}</p>}

        <input type="password" name="password_confirmation" placeholder="تأكيد كلمة المرور" onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? 'جاري التسجيل...' : 'تسجيل'}
        </button>
      </form>
    </div>
  );
};

export default Register;