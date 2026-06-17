import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇪🇬" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  // 🌍 بنقرأ اللغة المحفوظة في المتصفح، ولو مفيش بنخلي الافتراضي عربي 'ar'
  const currentLangCode = localStorage.getItem("nbis_lang") || "ar";
  const initialSelected = languages.find(l => l.code === currentLangCode) || languages[0];
  const [selected, setSelected] = useState(initialSelected);

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔄 دالة حفظ اللغة الجديدة وعمل ريفريش للموقع
  const handleLanguageChange = (lang) => {
    setSelected(lang);
    setOpen(false);
    localStorage.setItem("nbis_lang", lang.code); // حفظ الكود (ar أو en)
    window.location.reload(); // ريفريش خفيف عشان الموقع كله يقلب فوراً
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 p-1.5 rounded-full border transition-all duration-200
          ${open ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={open ? "#1E88E5" : "#6B7280"} strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-sm">{selected.flag}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? "#1E88E5" : "#9CA3AF"} strokeWidth="2.5"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-40 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
          {languages.map(lang => (
            <button key={lang.code} onClick={() => handleLanguageChange(lang)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                ${selected.code === lang.code ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {selected.code === lang.code && (
                <svg className="ml-auto" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E88E5" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;