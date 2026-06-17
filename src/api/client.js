import axios from 'axios';

// ✅ توحيد الرابط على السيرفر الشغال والمستقر (backend-1)
// استبدل السطر القديم برابط رايلواي المباشر ده:
const API_BASE_URL = "https://graduation-project-2026-nbis-backend-production.up.railway.app/api";

const client = axios.create({
  // الرابط الأونلاين الموحد للـ API
  baseURL: `${SERVER_URL}/api`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true // أساسية جداً لنقل الكوكيز والـ Tokens بين الدومينات أونلاين
});

// 🔒 طلب الـ CSRF Token من نفس السيرفر بالظبط قبل الـ Login أو الـ Register لمنع الـ CORS Block
export const ensureCsrf = () => {
  return axios.get(`${SERVER_URL}/sanctum/csrf-cookie`, {
    withCredentials: true
  });
};

// Request interceptor - attach token on every call
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nbis_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // السماح للمتصفح بتحديد الحدود المناسبة لـ FormData (مهم لرفع بصمات المواليد والصور)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nbis_token');
      localStorage.removeItem('nbis_user');
      // التوجيه لصفحة الـ login بالتوافق مع Netlify Redirects
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;