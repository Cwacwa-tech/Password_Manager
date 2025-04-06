import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// WebAuthn Pages
import WebAuthnRegistrationPage from './pages/WebAuthnRegistrationPage'; // Fixed import syntax
import WebAuthnLoginPage from './pages/WebAuthnLoginPage'; // Fixed import syntax
import { BiometricSetupPage } from './pages/BiometricSetupPage';
// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Enhanced Navbar with WebAuthn Navigation
const EnhancedNavbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-4">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
              <Link to="/webauthn/register" className="text-blue-600 hover:text-blue-800">WebAuthn Register</Link>
              <Link to="/webauthn/login" className="text-blue-600 hover:text-blue-800">WebAuthn Login</Link>
              <Link to="/biometric/setup" className="text-blue-600 hover:text-blue-800">Biometric Setup</Link>
              <button 
                onClick={logout} 
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
              <Link to="/register" className="text-blue-600 hover:text-blue-800">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <EnhancedNavbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* Existing Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* WebAuthn Biometric Routes */}
              <Route 
                path="/webauthn/register" 
                element={
                  <ProtectedRoute>
                    <WebAuthnRegistrationPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/webauthn/login" element={<WebAuthnLoginPage />} />
              <Route 
                path="/biometric/setup" 
                element={
                  <ProtectedRoute>
                    <BiometricSetupPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Dashboard Route */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;