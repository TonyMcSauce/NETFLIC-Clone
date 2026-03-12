import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { AppProvider } from './contexts/AppContext';
import AdminPage from './pages/AdminPage';
import DetailsPage from './pages/DetailsPage';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import ProfilesPage from './pages/ProfilesPage';

const App = () => (
  <AppProvider>
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/player/:id" element={<PlayerPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  </AppProvider>
);

export default App;
