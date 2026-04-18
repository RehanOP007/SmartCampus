import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/RegisterPage";
import UserDashboard from "./Component1/pages/UserDashboard/UserDashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
 
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default */}
          <Route path="/" element={<Navigate to="/smartcampus/login" />} />

          {/* Auth */}
          <Route path="/smartcampus/login" element={<LoginPage />} />
          <Route path="/smartcampus/register" element={<RegisterPage />} />
          <Route path="/smartcampus/oauth-success" element={<OAuthSuccess />} />

          {/* Protected */}
          <Route
            path="/smartcampus/user-dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App
