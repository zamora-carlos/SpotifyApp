import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LoginPage from '@pages/LoginPage';
// import App from './App.tsx';
// import ArtistPage from '@pages/ArtistPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>
);
