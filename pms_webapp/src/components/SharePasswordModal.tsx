// src/components/SharePasswordModal.tsx

import React, { useState } from 'react';

interface SharePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (email: string) => Promise<void>;
  entryInfo: string;
}

const SharePasswordModal: React.FC<SharePasswordModalProps> = ({ 
  isOpen, 
  onClose, 
  onShare,
  entryInfo
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await onShare(email);
      setEmail('');
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Share Password</h2>
        <p className="mb-4 text-gray-600">
          Share "{entryInfo}" with another user
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              User Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className="w-full p-2 border rounded-md"
              required
            />
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
              disabled={isLoading || !email}
            >
              {isLoading ? "Sharing..." : "Share Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SharePasswordModal;