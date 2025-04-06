// src/components/Vault/Vault.tsx
import React, { useState } from 'react';
import { useVault } from '../../contexts/VaultContext';
import { VaultEntryCreate } from '../../services/vaultService';
import { FiEdit, FiTrash2, FiShare2, FiEye, FiEyeOff, FiPlus } from 'react-icons/fi';
import VaultEntryForm from './VaultEntryForm';
import ShareEntryForm from './ShareEntryForm';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

const Vault: React.FC = () => {
  const { entries, loading, error, deleteEntry } = useVault();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<{ id: number; data: VaultEntryCreate } | null>(null);
  const [sharingEntry, setSharingEntry] = useState<number | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: number]: boolean }>({});

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords({
      ...visiblePasswords,
      [id]: !visiblePasswords[id]
    });
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      await deleteEntry(id);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading passwords...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Passwords</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <FiPlus className="mr-1" /> Add Password
        </button>
      </div>

      {showAddForm && (
        <VaultEntryForm
          onClose={() => setShowAddForm(false)}
          onSubmit={() => setShowAddForm(false)}
        />
      )}

      {editingEntry && (
        <VaultEntryForm
          entry={editingEntry.data}
          entryId={editingEntry.id}
          onClose={() => setEditingEntry(null)}
          onSubmit={() => setEditingEntry(null)}
        />
      )}

      {sharingEntry !== null && (
        <ShareEntryForm
          entryId={sharingEntry}
          onClose={() => setSharingEntry(null)}
        />
      )}

      {entries.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No passwords saved yet. Add your first password to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${entry.site}`}
                        alt=""
                        className="w-5 h-5 mr-3"
                      />
                      <span className="font-medium">{entry.site}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => handleCopyToClipboard(entry.username)}
                    >
                      {entry.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span 
                        className="mr-2 cursor-pointer hover:text-blue-500"
                        onClick={() => handleCopyToClipboard(entry.password)}
                      >
                        {visiblePasswords[entry.id] ? entry.password : '••••••••'}
                      </span>
                      <button 
                        onClick={() => togglePasswordVisibility(entry.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {visiblePasswords[entry.id] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDistanceToNow(new Date(entry.last_modified), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingEntry({ id: entry.id, data: { site: entry.site, username: entry.username, password: entry.password } })}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => setSharingEntry(entry.id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      <FiShare2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Vault;