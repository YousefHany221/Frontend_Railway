import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Welcome from "./pages/welcome";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgotpassword";
import AdminDashboard from "./pages/admin/adminDashboard";
import UserList from "./pages/admin/userList";
import AddUser from "./pages/admin/addUser";
import Profile from "./pages/shared/Profile";
import Settings from "./pages/admin/settings";
import VerificationLogs from "./pages/admin/verificationLogs";
import NotificationsPage from "./pages/admin/notifications";
import AdminChildrenList from "./pages/admin/childrenList";
import Organization from "./pages/admin/organization";
import OrganizationHospital from "./pages/admin/organizationHospital";
import OrganizationPolice from "./pages/admin/organizationPolice";
import RolesPermissions from "./pages/admin/rolesPermissions";
import ReportMissing from "./pages/admin/reportMissing";
import NurseDashboard from "./pages/nurse/nurseDashboard";
import ChildrenList from "./pages/nurse/childrenList";
import PoliceDashboard from "./pages/police/policeDashboard";

// تم تعديل الحروف لـ سمول لتطابق أسماء الملفات الحقيقية
import ParentDashboard from "./pages/parent/parentDashboard";
import ParentVerification from "./pages/parent/parentVerification";
import MyChildren from "./pages/parent/mychildren";

import RegisterChildForm from "./pages/shared/RegisterChildForm";
import VerificationLogsShared from "./pages/shared/VerificationLogs";

// ── 🛠️ التعديلات الذهبية لحل مشكلة الـ Linux Build ───────────────────

// 1. تصحيح الحرف الأول ليكون كابيتال (AuthContext) ليطابق اسم الملف على الهارد ديسك
import { AuthProvider } from "./context/AuthContext";

// 2. تصحيح الحرف الأول ليكون سمول (nurseLayout) ليطابق اسم الملف الحقيقي
import NurseLayout from "./components/nurseLayout";

// توحيد اسم الـ Import لـ سمول
import adminLayout from "./components/adminLayout";
import PoliceLayout from "./components/policeLayout";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members/list"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members/add"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                {/* ✅ تعديل الاستخدام هنا ليكون سمول مطابق للـ import */}
                <Profile layout={adminLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verification-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <VerificationLogs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/notifications"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/missing-children"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                {/* ✅ تعديل الاستخدام هنا ليكون سمول مطابق للـ import */}
                <VerificationLogsShared layout={adminLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/children"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminChildrenList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/children/register"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                {/* ✅ تعديل الاستخدام هنا ليكون سمول مطابق للـ import */}
                <RegisterChildForm layout={adminLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/report-missing"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ReportMissing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/organizations"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Organization />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/organizations/hospital"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OrganizationHospital />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/organizations/police"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <OrganizationPolice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RolesPermissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/dashboard"
            element={
              <ProtectedRoute allowedRoles={['nurse', 'admin']}>
                <NurseDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/children/list"
            element={
              <ProtectedRoute allowedRoles={['nurse', 'admin']}>
                <ChildrenList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/children/register"
            element={
              <ProtectedRoute allowedRoles={['nurse', 'admin']}>
                <RegisterChildForm layout={NurseLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/police/dashboard"
            element={
              <ProtectedRoute allowedRoles={['police', 'admin']}>
                <PoliceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/police/verification-logs"
            element={
              <ProtectedRoute allowedRoles={['police', 'admin']}>
                <VerificationLogsShared layout={PoliceLayout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/verification"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <ParentVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/children"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyChildren />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;