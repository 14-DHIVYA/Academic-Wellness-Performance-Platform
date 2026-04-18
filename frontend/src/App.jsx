import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./pages/ProtectedRoute";
import Academic from "./pages/Academic";
import Wellness from "./pages/Wellness";

import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Student Portal */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Teacher Portal */}
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute allowedRoles={["teacher"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Portal */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academic"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Academic />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wellness"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Wellness />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;