// src/components/EditPasswordModal.tsx

import React, { useState } from 'react';
import { VaultEntry, VaultEntryCreate } from '../services/vaultService';

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: VaultEntryCreate) => Promise<void>;
  entry: VaultEntry;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  entry 
}) => {
  const [site, setSite] = useState(entry.site);
  const [username, setUsername] = useState(entry.username);
  const [password, setPassword] = useState(entry.password);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!site || !username || !password) return;

    setIsLoading(true);
    try {
      await onSubmit({ site, username, password });
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    setPassword(generatedPassword);
    setShowPassword(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="site">
              Website URL
            </label>
            <input
              id="site"
              type="text"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-md pr-20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <button
              type="button"
              onClick={generatePassword}
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Generate Strong Password
            </button>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading || !site || !username || !password}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPasswordModal