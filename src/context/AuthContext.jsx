import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// إعداد رابط السيرفر الأساسي (تأكد من تحديثه)
axios.defaults.baseURL = 'https://graduation-project-2026-nbis-backend-production.up.railway.app';
// هذا السطر ضروري جداً لنقل الـ Cookies بين النطاقات (Vercel و Railway)
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // دالة لجلب بيانات المستخدم الحالي إذا كان مسجلاً للدخول
  const getUser = async () => {
    try {
      const { data } = await axios.get('/api/user');
      setUser(data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // دالة تسجيل الدخول
  const login = async (formData) => {
    // 1. طلب الـ CSRF Token أولاً
    await axios.get('/sanctum/csrf-cookie');

    // 2. إرسال طلب تسجيل الدخول
    const response = await axios.post('/api/login', formData);

    // 3. تحديث بيانات المستخدم في الـ State
    setUser(response.data.user);
  };

  // دالة التسجيل (Register)
  const register = async (formData) => {
    // 1. طلب الـ CSRF Token أولاً
    await axios.get('/sanctum/csrf-cookie');

    // 2. إرسال طلب التسجيل
    const response = await axios.post('/api/register', formData);

    // 3. تحديث بيانات المستخدم في الـ State
    setUser(response.data.user);
  };

  // دالة تسجيل الخروج
  const logout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);