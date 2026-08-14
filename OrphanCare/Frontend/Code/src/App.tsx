// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import { supabase } from '../utils/supabase';

// Context
import { UserProvider, useUser } from './context/UserContext';

// Pages
import LandingPage from './pages/LandingPage';
import RegistrationChoice from './pages/RegistrationChoice';
import RegisterForm from './pages/RegisterForm';
import EmailVerification from './pages/EmailVerification';
import LoginChoice from './pages/LoginChoice';
import LoginForm from './pages/LoginForm';
import DonorDashboard from './pages/DonorDashboard';
import OrphanageDashboard from './pages/OrphanageDashboard';
import DonorProfileComplete from './pages/DonorProfileComplete';
import OrphanegeProfileComplete from './pages/OrphanegeProfileComplete';
import OrphanageProfile from './pages/OrphanageProfile';
import DonationPage from './pages/DonationPage';
import SuccessPage from './pages/SuccessPage';
import DonationRequestsPage from './pages/DonationRequestsPage';
import Orphanages from './pages/Orphanages';
import AddRequirement from './pages/AddRequirement';
import RoadmapPage from './pages/RoadmapPage';
import LearningDashboard from './pages/LearningDashboard';
import LibraryPage from "./pages/LibraryPage";
import Learn from './pages/Learn';
import WatchVideo from './pages/WatchVideo';

// Protected route that reads from UserContext
function ProtectedOrphanageRoute({ children }: { children: JSX.Element }) {
  const { userType } = useUser();
  if (userType !== 'orphanage') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegistrationChoice />} />
            <Route path="/register/orphanage" element={<RegisterForm role="orphanage" />} />
            <Route path="/register/donor" element={<RegisterForm role="donor" />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/login" element={<LoginChoice />} />
            <Route path="/login/orphanage" element={<LoginForm role="orphanage" />} />
            <Route path="/login/donor" element={<LoginForm role="donor" />} />
            

            {/* Donor routes */}
            <Route path="/donor/dashboard" element={<DonorDashboard />} />
            <Route path="/donor/profile-complete" element={<DonorProfileComplete />} />

            {/* Orphanage routes */}
            <Route path="/orphanage/dashboard" element={<OrphanageDashboard />} />
            <Route path="/orphanage/profile-complete" element={<OrphanegeProfileComplete />} />
            <Route path="/orphanage/:id" element={<OrphanageProfile />} />
            <Route path="/orphanage/requests" element={<DonationRequestsPage />} />

            {/* Donation */}
            <Route path="/donation/:orphanageId" element={<DonationPage />} />
            <Route path="/donation/success" element={<SuccessPage />} />

            {/* Browse orphanages */}
            <Route path="/orphanages" element={<Orphanages />} />

            {/* Add requirements */}
            <Route path="/add-requirement/:category" element={<AddRequirement />} />

            {/* Learning pages */}
            <Route path="/LearnQuiz" element={<RoadmapPage />} />
            <Route path="/learn/dashboard" element={<LearningDashboard />} />
            <Route path="/library" element={<LibraryPage />} />

            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/watch/:videoId" element={<WatchVideo />} />

          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
