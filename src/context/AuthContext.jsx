import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// إعداد الرابط الرئيسي للباكيند تلقائياً لـ Axios وتأمين نقل الـ Cookies
axios.defaults.baseURL = 'https://graduation-project-2026-nbis-backend-production.up.railway.app';
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب بيانات المستخدم الحالي عند تحميل الصفحة للتأكد من الجلسة
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await axios.get('/api/user', { headers });
        if (response.data.status === 'success') {
          setUser(response.data.user);
        }
      } catch (error) {
        // إذا انتهت الجلسة أو الـ Token غير صالح
        setUser(null);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * 1. دالة تسجيل الدخول (Login)
   */
  const login = async (formData) => {
    // أ. طلب الـ CSRF Token أولاً لتأمين الجلسة ضد هجمات الخطف
    await axios.get('/sanctum/csrf-cookie');

    // ب. إرسال طلب تسجيل الدخول مع الحماية الكاملة لتجنب خطأ 422
    const response = await axios.post('/api/login', formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // ج. حفظ الـ Token في الـ LocalStorage (للاستخدام الاحتياطي أو الموبايل)
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    // د. تحديث حالة المستخدم في التطبيق
    setUser(response.data.user);
    return response.data;
  };

  /**
   * 2. دالة تسجيل حساب جديد (Register)
   */
  const register = async (formData) => {
    await axios.get('/sanctum/csrf-cookie');

    const response = await axios.post('/api/register', formData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    setUser(response.data.user);
    return response.data;
  };

  /**
   * 3. دالة تسجيل الخروج (Logout)
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      await axios.post('/api/logout', {}, { headers });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // حذف البيانات محلياً في كل الأحوال لتأمين واجهة المستخدم
      setUser(null);
      localStorage.removeItem('auth_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook مخصص لسهولة استدعاء الـ Auth بداخل صفحاتك (مثل صفحة Login)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};