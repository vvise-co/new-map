import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { TeamProvider } from '@/context/TeamContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ProfilePage from '@/pages/ProfilePage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import TeamRegistrationPage from '@/pages/TeamRegistrationPage';
import TeamManagementPage from '@/pages/TeamManagementPage';
import InviteLandingPage from '@/pages/InviteLandingPage';

function App() {
  return (
    <AuthProvider>
      <TeamProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/invite/:token" element={<InviteLandingPage />} />

            {/* Team registration (requires auth, no team required) */}
            <Route element={<ProtectedRoute requireTeam={false} />}>
              <Route path="/register-team" element={<TeamRegistrationPage />} />
            </Route>

            {/* Protected routes (require auth AND team) */}
            <Route element={<ProtectedRoute requireTeam={true} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/team/:teamId" element={<TeamManagementPage />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </TeamProvider>
    </AuthProvider>
  );
}

export default App;
