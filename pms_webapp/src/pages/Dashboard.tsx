// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import vaultService, { VaultEntry } from '../services/vaultService';
import VaultDashboard from '../components/VaultDashboard';
import VaultStatistics from '../contexts/VaultStatistics';
import extensionService from '../services/extensionService';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [allEntries, setAllEntries] = useState<VaultEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'passwords' | 'statistics'>('passwords');
  const [websites, setWebsites] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    extensionService.initialize();
    loadAllPasswords();
  }, []);

  const loadAllPasswords = async () => {
    try {
      setIsLoading(true);
      const allPasswordEntries: VaultEntry[] = await vaultService.getAllPasswords();
      
      // Extract unique websites from entries
      const websiteSet = new Set<string>();
      allPasswordEntries.forEach(entry => {
        if (entry.site) websiteSet.add(entry.site);
      });
      
      setAllEntries(allPasswordEntries);
      setWebsites(Array.from(websiteSet));
    } catch (error) {
      console.error('Failed to load passwords:', error);
      toast.error('Failed to load password data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      navigate('/login', { state: { message: 'Your account has been deleted.' } });
    } catch (error) {}
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Password Manager Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{user?.email}</span>
          <button onClick={handleLogout} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${activeTab === 'passwords' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('passwords')}
        >
          Passwords
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'statistics' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'statistics' && <VaultStatistics entries={allEntries} />}
          {activeTab === 'passwords' && <VaultDashboard initialEntries={allEntries} websites={websites} onRefresh={loadAllPasswords} />}
        </>
      )}
      
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Account Management</h3>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete Account
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700 mb-4">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
