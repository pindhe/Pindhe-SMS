import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Students from './pages/students/Students';
import Teachers from './pages/teachers/Teachers';
import Parents from './pages/parents/Parents';
import Staff from './pages/staff/Staff';
import Classes from './pages/classes/Classes';
import Subjects from './pages/subjects/Subjects';
import Attendance from './pages/attendance/Attendance';
import Exams from './pages/exams/Exams';
import Fees from './pages/fees/Fees';
import Timetable from './pages/timetable/Timetable';
import Library from './pages/library/Library';
import Events from './pages/events/Events';
import Announcements from './pages/announcements/Announcements';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';
import Profile from './pages/profile/Profile';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="parents" element={<Parents />} />
        <Route path="staff" element={<Staff />} />
        <Route path="classes" element={<Classes />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="exams" element={<Exams />} />
        <Route path="fees" element={<Fees />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="library" element={<Library />} />
        <Route path="events" element={<Events />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;