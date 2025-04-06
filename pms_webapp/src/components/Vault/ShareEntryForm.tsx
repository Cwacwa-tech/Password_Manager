// src/components/Vault/ShareEntryForm.tsx
import React, { useState } from 'react';
import { useVault } from '../../contexts/VaultContext';
import { FiX } from 'react-icons/fi';

interface ShareEntryFormProps {
  entryId: number;
  onClose: () => void;
}

const ShareEntryForm: React.FC<ShareEntryFormProps> = ({ entryId, onClose }) => {
  const { shareEntry } = useVault();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await shareEntry(entryId, email);
      onClose();
    } catch (error) {
      console.error('Error sharing password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Share Password</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              This will share your password with the specified user. They will be able to view but not edit or delete this password.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 mr-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading || !email}
            >
              {loading ? 'Sharing...' : 'Share Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareEntryForm;