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
import SettingsPage from '@/pages/SettingsPage';
import TeamsPage from '@/pages/TeamsPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectCreationPage from '@/pages/ProjectCreationPage';
import ProjectPage from '@/pages/ProjectPage';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <TeamProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route
                path='/login'
                element={<LoginPage />}
              />
              <Route
                path='/auth/callback'
                element={<AuthCallbackPage />}
              />
              <Route
                path='/invite/:token'
                element={<InviteLandingPage />}
              />

              {/* Team registration (requires auth, no team required) */}
              <Route element={<ProtectedRoute requireTeam={false} />}>
                <Route
                  path='/register-team'
                  element={<TeamRegistrationPage />}
                />
              </Route>

              {/* Protected routes (require auth AND team) */}
              <Route element={<ProtectedRoute requireTeam={true} />}>
                <Route
                  path='/dashboard'
                  element={<DashboardPage />}
                />
                <Route
                  path='/profile'
                  element={<ProfilePage />}
                />
                <Route
                  path='/settings'
                  element={<SettingsPage />}
                />
                <Route
                  path='/team'
                  element={<TeamsPage />}
                />
                <Route
                  path='/team/:teamId'
                  element={<TeamManagementPage />}
                />
                <Route
                  path='/projects'
                  element={<ProjectsPage />}
                />
                <Route
                  path='/projects/new'
                  element={<ProjectCreationPage />}
                />
                <Route
                  path='/projects/:projectId'
                  element={<ProjectPage />}
                />
              </Route>

              {/* Default redirect */}
              <Route
                path='/'
                element={
                  <Navigate
                    to='/dashboard'
                    replace
                  />
                }
              />
              <Route
                path='*'
                element={
                  <Navigate
                    to='/dashboard'
                    replace
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </TeamProvider>
    </AuthProvider>
  );
}

export default App;
