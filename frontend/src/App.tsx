import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import DashboardPage from '@pages/DashboardPage';
import ArtistPage from '@pages/ArtistPage';
import CallbackPage from '@pages/CallbackPage';
import ProtectedRoute from '@components/ProtectedRoute';
import TrackPage from '@pages/TrackPage';
import { AuthProvider } from '@context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<CallbackPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/artist/:id" element={<ArtistPage />} />
            <Route path="/track/:id" element={<TrackPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
