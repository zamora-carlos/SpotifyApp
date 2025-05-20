import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import DashboardPage from '@pages/DashboardPage';
import ArtistPage from '@pages/ArtistPage';
import CallbackPage from '@pages/CallbackPage';
import TrackPage from '@pages/TrackPage';
import AlbumPage from '@pages/AlbumPage';
import { AuthProvider } from '@context/AuthContext';
import { MusicPlayerProvider } from '@context/MusicPlayerContext';
import ProtectedRoute from '@components/ProtectedRoute';
import MusicPlayer from '@components/MusicPlayer';

function App() {
  return (
    <AuthProvider>
      <MusicPlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/callback" element={<CallbackPage />} />

            <Route
              element={
                <>
                  <ProtectedRoute />
                  <MusicPlayer />
                </>
              }
            >
              <Route path="/" element={<DashboardPage />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
              <Route path="/album/:id" element={<AlbumPage />} />
              <Route path="/track/:id" element={<TrackPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MusicPlayerProvider>
    </AuthProvider>
  );
}

export default App;
