// src/components/PasswordEntry.tsx

import React, { useState } from 'react';
import { VaultEntry, VaultEntryCreate } from '../services/vaultService';
import { FaEye, FaEyeSlash, FaEdit, FaTrash, FaShareAlt, FaCopy } from 'react-icons/fa';
import SharePasswordModal from './SharePasswordModal';
import EditPasswordModal from './EditPasswordModal';
import { formatDistanceToNow } from 'date-fns';

interface PasswordEntryProps {
  entry: VaultEntry;
  onUpdate: (id: number, entry: VaultEntryCreate) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onShare: (id: number, email: string) => Promise<void>;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({ entry, onUpdate, onDelete, onShare }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(entry.id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
      // Reset confirmDelete after 3 seconds if not confirmed
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const lastModified = entry.last_modified 
    ? formatDistanceToNow(new Date(entry.last_modified), { addSuffix: true })
    : 'Unknown';

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{entry.site}</h3>
          <p className="text-sm text-gray-600">{entry.username}</p>
          <p className="text-xs text-gray-400">Modified: {lastModified}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={entry.password}
              readOnly
              className="pr-10 p-2 border rounded-md"
            />
            <button
              onClick={togglePasswordVisibility}
              className="absolute right-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          <button
            onClick={() => copyToClipboard(entry.password)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Copy password"
          >
            <FaCopy />
          </button>
          
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Edit password"
          >
            <FaEdit />
          </button>
          
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Share password"
          >
            <FaShareAlt />
          </button>
          
          <button
            onClick={handleDelete}
            className={`p-2 ${confirmDelete ? 'text-red-500' : 'text-gray-500'} hover:text-red-700`}
            title={confirmDelete ? 'Confirm delete' : 'Delete password'}
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {isShareModalOpen && (
        <SharePasswordModal
         isOpen={isShareModalOpen}
         onClose={() => setIsShareModalOpen(false)}
         onShare={async (email) => {  // Add async
            await onShare(entry.id, email);  // Add await
            setIsShareModalOpen(false);
          }}
          entryInfo={`${entry.site} (${entry.username})`}
        />
      )}

        {isEditModalOpen && (
        <EditPasswordModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={async (updatedEntry) => {  // Add async
            await onUpdate(entry.id, updatedEntry);  // Add await
            setIsEditModalOpen(false);
            }}
            entry={entry}
        />
        )}
    </div>
  );
};

export default PasswordEntry;