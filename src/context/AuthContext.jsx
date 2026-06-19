import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/auth'; // ⚠️ تأكد من صحة مسار ملف الـ authService عندك

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // جلب بيانات المستخدم الحالي عند تحميل الصفحة للتأكد من الجلسة عبر الـ client الموحد
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('nbis_token');
        if (token) {
          const data = await authService.getCurrentUser();
          // إذا كان الباكيند يرجع الحساب داخل كائن نجاح أو مباشرة
          if (data) {
            setUser(data.user || data);
          }
        }
      } catch (error) {
        console.error("Session checked failed:", error);
        setUser(null);
        localStorage.removeItem('nbis_token');
        localStorage.removeItem('nbis_user');
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
    // الاستعانة بالخدمة المجهزة تلقائياً بالـ CSRF والـ BaseURL الصحيح
    const data = await authService.login(formData);

    if (data.token) {
      localStorage.setItem('nbis_token', data.token);
    }

    const loggedInUser = data.user || data;
    localStorage.setItem('nbis_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    return data;
  };

  /**
   * 2. دالة تسجيل حساب جديد (Register)
   */
  const register = async (formData) => {
    const data = await authService.register(formData);

    if (data.token) {
      localStorage.setItem('nbis_token', data.token);
    }

    const registeredUser = data.user || data;
    localStorage.setItem('nbis_user', JSON.stringify(registeredUser));
    setUser(registeredUser);

    return data;
  };

  /**
   * 3. دالة تسجيل الخروج (Logout)
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // تنظيف محلي شامل في كل الأحوال لتأمين واجهتك
      setUser(null);
      localStorage.removeItem('nbis_token');
      localStorage.removeItem('nbis_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};