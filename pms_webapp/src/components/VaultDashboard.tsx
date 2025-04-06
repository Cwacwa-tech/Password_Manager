// src/pages/VaultDashboard.tsx

import React, { useState, useEffect } from 'react';
import vaultService, { VaultEntry, VaultEntryCreate } from '../services/vaultService';
import PasswordEntry from '../components/PasswordEntry';
import AddPasswordModal from '../components/AddPasswordModal';
import { toast } from 'react-toastify';

interface VaultDashboardProps {
  initialEntries?: VaultEntry[];
  websites?: string[];
  onRefresh?: () => void;
}

const VaultDashboard: React.FC<VaultDashboardProps> = ({ 
  initialEntries = [], 
  websites = [],
  onRefresh
}) => {
  const [entries, setEntries] = useState<VaultEntry[]>(initialEntries);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<VaultEntry[]>(initialEntries);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState('');
  const [groupByWebsite, setGroupByWebsite] = useState(true);

  // Update entries when initialEntries change
  useEffect(() => {
    setEntries(initialEntries);
  }, [initialEntries]);

  // Filter entries when search term or entries change
  useEffect(() => {
    if (entries.length > 0) {
      const filtered = entries.filter(
        entry => 
          entry.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // If a website is selected, further filter the entries
      const finalFiltered = selectedWebsite 
        ? filtered.filter(entry => entry.site === selectedWebsite)
        : filtered;
      
      setFilteredEntries(finalFiltered);
    }
  }, [searchTerm, entries, selectedWebsite]);

  const loadAllPasswords = async () => {
    try {
      setIsLoading(true);
      const data = await vaultService.getAllPasswords();
      setEntries(data);
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to load passwords:', error);
      toast.error('Failed to load passwords.');
    } finally {
      setIsLoading(false);
    }
  };

  // Modify the existing loadPasswordsForWebsite to work with all entries
  const loadPasswordsForWebsite = async (website: string) => {
    setSelectedWebsite(website);
    // No need to fetch from API, filtering will be done on existing entries
  };

  const handleAddPassword = async (newEntry: VaultEntryCreate) => {
    try {
      await vaultService.addPassword(newEntry);
      await loadAllPasswords();
      toast.success('Password added successfully!');
      setIsAddModalOpen(false);
      
      // Call refresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to add password:', error);
      toast.error('Failed to add password.');
    }
  };

  const handleUpdatePassword = async (entryId: number, updatedEntry: VaultEntryCreate) => {
    try {
      await vaultService.updatePassword(entryId, updatedEntry);
      await loadAllPasswords();
      toast.success('Password updated successfully!');

      // Update the entry in the local state
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === entryId 
            ? { ...entry, ...updatedEntry } 
            : entry
        )
      );
      
      // Call refresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      toast.error('Failed to update password.');
    }
  };

  const handleDeletePassword = async (entryId: number) => {
    try {
      await vaultService.deletePassword(entryId);
      await loadAllPasswords();
      toast.success('Password deleted successfully!');
      
      // Remove the entry from the local state
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
      
      // Call refresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Failed to delete password:', error);
      toast.error('Failed to delete password.');
    }
  };

  const handleSharePassword = async (entryId: number, userEmail: string) => {
    try {
      await vaultService.shareEntry({ vault_entry_id: entryId, user_email: userEmail });
      await loadAllPasswords();
      toast.success(`Password shared with ${userEmail}!`);
    } catch (error) {
      console.error('Failed to share password:', error);
      toast.error('Failed to share password.');
    }
  };

  // Group entries by website
  const groupedEntries = React.useMemo(() => {
    if (!groupByWebsite) return { all: filteredEntries };
    
    const groups: { [key: string]: VaultEntry[] } = {};
    filteredEntries.forEach(entry => {
      if (!groups[entry.site]) {
        groups[entry.site] = [];
      }
      groups[entry.site].push(entry);
    });
    return groups;
  }, [filteredEntries, groupByWebsite]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search websites or usernames..."
            className="w-full p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-1">
          <select
            className="w-full p-2 border rounded-md"
            value={selectedWebsite}
            onChange={(e) => {
              setSelectedWebsite(e.target.value);
              if (e.target.value) {
                loadPasswordsForWebsite(e.target.value);
              }
            }}
          >
            <option value="">Select a website</option>
            {websites.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>
        
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Password
        </button>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="groupByWebsite"
            checked={groupByWebsite}
            onChange={() => setGroupByWebsite(prev => !prev)}
            className="mr-2"
          />
          <label htmlFor="groupByWebsite">Group by website</label>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {groupByWebsite ? (
            // Display grouped by website
            Object.entries(groupedEntries).length > 0 ? (
              Object.entries(groupedEntries).map(([site, siteEntries]) => (
                <div key={site} className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">{site}</h2>
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="divide-y">
                      {siteEntries.map(entry => (
                        <PasswordEntry
                          key={entry.id}
                          entry={entry}
                          onUpdate={handleUpdatePassword}
                          onDelete={handleDeletePassword}
                          onShare={handleSharePassword}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
                {searchTerm ? 'No passwords match your search.' : 'No passwords found.'}
              </div>
            )
          ) : (
            // Display flat list
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {filteredEntries.length > 0 ? (
                <div className="divide-y">
                  {filteredEntries.map(entry => (
                    <PasswordEntry
                      key={entry.id}
                      entry={entry}
                      onUpdate={handleUpdatePassword}
                      onDelete={handleDeletePassword}
                      onShare={handleSharePassword}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  {searchTerm ? 'No passwords match your search.' : 'No passwords found.'}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isAddModalOpen && (
        <AddPasswordModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPassword}
          initialSite={selectedWebsite}
        />
      )}
    </div>
  );
};

export default VaultDashboard;