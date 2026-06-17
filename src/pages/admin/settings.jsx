// src/pages/admin/Settings.jsx
import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import { authService } from "../../api/auth";

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-blue-600" : "bg-gray-200"}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : ""}`} />
  </button>
);

export default function Settings() {
  const defaultSettings = {
    language: "en",
    notifications: true,
    email_alerts: true,
    two_factor: false,
    login_alerts: false,
    session_timeout: 30,
  };
  const [settings, setSettings] = useState({
    ...defaultSettings,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await authService.getSettings();
      setSettings({ ...defaultSettings, ...(response.data ?? {}) });
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const set = k => v => setSettings(s => ({ ...s, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    try {
      await authService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">

        {/* Success Banner */}
        {saved && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-sm text-green-700 font-medium">Your Settings Have Been Updated</p>
            </div>
            <button onClick={() => setSaved(false)} className="text-green-400 hover:text-green-600">✕</button>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Account Settings */}
          <div className="flex items-start gap-3 mb-6 pb-6 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Account Settings</p>
              <p className="text-xs text-gray-400">Manage Your Account Preferences And Notifications</p>
            </div>
          </div>

          <div className="space-y-5 mb-8">
            {/* Language */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Language</p>
                <p className="text-xs text-gray-400">Choose Your Preferred Language</p>
              </div>
              <div className="relative">
                <select value={settings.language} onChange={e => set("language")(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none text-gray-700 focus:border-blue-400 appearance-none bg-white pr-8">
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="fr">Français</option>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Notifications</p>
                <p className="text-xs text-gray-400">Enable Or Disable System Notifications</p>
              </div>
              <Toggle value={settings.notifications} onChange={set("notifications")} />
            </div>

            {/* Email Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Email Alerts</p>
                <p className="text-xs text-gray-400">Receive Important Updates Via Email</p>
              </div>
              <Toggle value={settings.email_alerts} onChange={set("email_alerts")} />
            </div>
          </div>

          {/* Security */}
          <div className="flex items-start gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-700">Security</p>
              <p className="text-xs text-gray-400">Manage Your Security And Login Preferences</p>
            </div>
          </div>

          <div className="space-y-5 mb-8">
            {/* 2FA */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400">Add An Extra Layer Of Security To Your Account</p>
              </div>
              <Toggle value={settings.two_factor} onChange={set("two_factor")} />
            </div>

            {/* Login Alerts */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Login Alerts</p>
                <p className="text-xs text-gray-400">Get Notified When Someone Logs Into Your Account</p>
              </div>
              <Toggle value={settings.login_alerts} onChange={set("login_alerts")} />
            </div>

            {/* Session Timeout */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Session Timeout</p>
                <p className="text-xs text-gray-400">Automatically Log Out After Inactivity</p>
              </div>
              <div className="relative flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <select value={String(settings.session_timeout)} onChange={e => set("session_timeout")(Number(e.target.value))}
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none text-gray-700 focus:border-blue-400 appearance-none bg-white pr-8">
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="0">Never</option>
                </select>
                <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button onClick={loadSettings} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold px-5 py-2.5 rounded-xl transition">
              <span className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">✕</span>
              Cancel
            </button>
            <button onClick={handleSave} disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
              </svg>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}