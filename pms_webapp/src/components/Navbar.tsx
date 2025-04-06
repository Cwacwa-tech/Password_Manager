// File: src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            PassVault
          </Link>
          
          <div className="space-x-4">
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="py-2 px-4 hover:bg-blue-700 rounded-md transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-2 px-4 hover:bg-blue-700 rounded-md transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="py-2 px-4 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;