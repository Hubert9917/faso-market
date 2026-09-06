import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import InscriptionPage from "./pages/InscriptionPage";
import ConnexionPage from "./pages/ConnexionPage";
import DashboardPage from "./pages/DashboardPage";
import BoutiquePage from "./pages/BoutiquePage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/inscription" element={<InscriptionPage />} />
        <Route path="/connexion" element={<ConnexionPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/boutique/:slug" element={<BoutiquePage />} />
      </Routes>
    </AuthProvider>
  );
}
