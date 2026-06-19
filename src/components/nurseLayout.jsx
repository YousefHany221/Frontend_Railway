// src/components/nurseLayout.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 👈 استيراد الـ useAuth لقرائة بيانات اللوجن

export default function NurseLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 سحب بيانات المستخدم الحالي (الاسم، الإيميل، الصلاحية)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        {/* الشمال: اللوجو واسم البوابة */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/nurse/dashboard")}>
          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-xl">🩺</span>
          </div>
          <h1 className="font-bold text-gray-800 text-lg">Nurse Portal</h1>
        </div>

        {/* اليمين: البروفايل والجرس التوضيحي */}
        <div className="flex items-center gap-5">

          {/* جرس الإشعارات التوضيحي (Static Bell with Badge) 🔔 */}
          <div className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer transition">
            <span className="text-xl">🔔</span>
            {/* النقطة الحمراء التوضيحية لعدد الإشعارات */}
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
              0
            </span>
          </div>

          {/* خط فاصل بسيط يعطي مظهر أنيق */}
          <div className="h-6 w-[1px] bg-gray-200"></div>

          {/* معلومات الممرضة والصورة ديناميكياً 🎯 */}
          <div className="flex items-center gap-3">
            {/* عرض أول حرف من اسم المستخدم كابيتال تلقائياً */}
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm uppercase">
              {user?.name ? user.name.charAt(0) : "N"}
            </div>
            <div className="text-right">
              {/* عرض الاسم الحقيقي المكتوب في قاعدة البيانات */}
              <p className="text-sm font-semibold text-gray-700">{user?.name || "Mohamed Elsaeed"}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role || "Nurse"} Portal</p>
            </div>
          </div>

          {/* زرار الانتقال لصفحة الـ Profile */}
          <button
            onClick={() => navigate("/nurse/profile")} // 👈 تم توجيهه لصفحة الـ Profile الموحدة المشتركة في الـ App.jsx
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </header>

      {/* محتوى الصفحة الحالي */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}