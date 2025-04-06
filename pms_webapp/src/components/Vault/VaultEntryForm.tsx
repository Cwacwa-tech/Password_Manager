// src/components/Vault/VaultEntryForm.tsx
import React, { useState } from 'react';
import { useVault } from '../../contexts/VaultContext';
import { VaultEntryCreate } from '../../services/vaultService';
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface VaultEntryFormProps {
  entry?: VaultEntryCreate;
  entryId?: number;
  onClose: () => void;
  onSubmit: () => void;
}

const VaultEntryForm: React.FC<VaultEntryFormProps> = ({ entry, entryId, onClose, onSubmit }) => {
  const { addEntry, updateEntry } = useVault();
  const [formData, setFormData] = useState<VaultEntryCreate>(entry || {
    site: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (entryId) {
        await updateEntry(entryId, formData);
      } else {
        await addEntry(formData);
      }
      onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
    setShowPassword(true);
    toast.success('Strong password generated');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {entryId ? 'Edit Password' : 'Add New Password'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="text"
              id="site"
              name="site"
              placeholder="example.com"
              value={formData.site}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username / Email
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="your.email@example.com"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <button
              type="button"
              onClick={generatePassword}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Generate Strong Password
            </button>
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
              disabled={loading}
            >
              {loading ? 'Saving...' : entryId ? 'Update Password' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaultEntryForm;