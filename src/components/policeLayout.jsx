// 🕵️‍♂️ الـ Search Modal المحدث بالكامل للبحث اللايف
function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch("https://your-laravel-railway-url.railway.app/api/children/text-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("nbis_token") // 🎯 تصحيح اسم الـ Token هنا ليطابق الـ Context
          },
          body: JSON.stringify({ name: query })
        });
        const data = await response.json();
        if (response.ok) {
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error live searching:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // ... باقي كود الـ Return للـ SearchModal يظل كما هو تماماً ...
  return (
    // كود الـ modal الأصلي بتاعك...
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16" style={{ background: "rgba(0,0,0,0.18)" }} onClick={onClose}>
      {/* باقي التصميم */}
    </div>
  );
}

// 🎯 تحديث الـ Dropdown ليدعم الذهاب للبروفايل الخاص بالشرطة
function ProfileDropdown({ navigate, onClose, logout, userName }) {
  return (
    <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-700">{userName || "Police Officer"}</p>
        <p className="text-xs text-blue-500">Police Portal</p>
      </div>

      {/* 👤 زرار الانتقال لصفحة البروفايل الخاصة بالشرطة */}
      <button onClick={() => { navigate('/police/profile'); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
        My Profile
      </button>

      <button onClick={async () => { await logout(); navigate('/login'); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition border-t border-gray-50">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={icons.logout} />
        </svg>
        Logout
      </button>
    </div>
  );
  }