import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/Logo 1.png";

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  verification: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
  children: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
};

const navItems = [
  { label: "Dashboard", icon: "dashboard", path: "/parent/dashboard" },
  { label: "Verification Requests", icon: "verification", path: "/parent/verification" },
  { label: "My Children", icon: "children", path: "/parent/children" },
];

const recentSearches = [
  { name: "Tia Ahmed", id: "ID:304010112", mother: "Eman Samy" },
  { name: "Rahma Saber", id: "ID:404011112", mother: "May Ebrahim" },
];

function SearchModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "My Children", "Requests"];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16"
      style={{ background: "rgba(0,0,0,0.18)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
            placeholder="Search Your Children..." />
        </div>
        <div className="flex gap-2 px-4 py-2 border-b border-gray-100">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="px-4 py-3 min-h-[120px]">
          {query ? (
            <p className="text-center text-gray-500 font-semibold py-8">No Results Found</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500">Recent Searches</p>
                <button className="text-xs text-blue-500 hover:underline">Clear History</button>
              </div>
              {recentSearches.map((r, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <div className="text-xs">
                    <p className="font-semibold text-gray-700">• {r.name}</p>
                    <p className="text-gray-400">• {r.id}</p>
                    <p className="text-gray-400">• {r.mother}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileDropdown({ navigate, onClose, logout }) {
  return (
    <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-700">Mohamed Elsaeed</p>
        <p className="text-xs text-blue-500">Parent</p>
      </div>
      <button onClick={async () => { await logout(); navigate('/login'); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition mt-1">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={icons.logout} />
        </svg>
        Logout
      </button>
    </div>
  );
}

export default function ParentLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <aside className="w-[190px] shrink-0 bg-white border-r border-gray-100 flex flex-col py-6 px-3 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="NBIS" className="w-40 h-40 object-contain" />
        </div>
        <nav className="flex-1 space-y-0.5">
          {navItems.map(item => (
            <button key={item.label} onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150
                ${isActive(item.path)
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={icons[item.icon]} />
              </svg>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 shadow-sm">
          <button onClick={() => setShowSearch(true)}
            className="flex-1 max-w-md flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-400 hover:border-blue-300 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            Search
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div ref={profileRef} className="relative">
              <button onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1.5 rounded-xl transition">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Mohamed Elsaeed</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {showProfile && <ProfileDropdown navigate={navigate} onClose={() => setShowProfile(false)} logout={logout} />}
            </div>
            <div className="relative">
              <button className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:border-blue-300 transition">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}