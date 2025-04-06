// src/contexts/VaultContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { vaultService, VaultEntry, VaultEntryCreate } from '../services/vaultService';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface VaultContextType {
  entries: VaultEntry[];
  loading: boolean;
  error: string | null;
  currentWebsite: string;
  setCurrentWebsite: (website: string) => void;
  refreshEntries: () => Promise<void>;
  addEntry: (entry: VaultEntryCreate) => Promise<void>;
  updateEntry: (id: number, entry: VaultEntryCreate) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
  shareEntry: (entryId: number, userEmail: string) => Promise<void>;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};

interface VaultProviderProps {
  children: ReactNode;
}

export const VaultProvider: React.FC<VaultProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWebsite, setCurrentWebsite] = useState<string>('');
  
  const { isAuthenticated } = useAuth();

  const refreshEntries = async () => {
    if (!isAuthenticated) {
      setEntries([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await vaultService.getAllPasswords(); // Changed from getPasswordsForWebsite
      setEntries(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch passwords');
      toast.error('Failed to load passwords');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshEntries();
    }
  }, [isAuthenticated]); 

  const addEntry = async (entry: VaultEntryCreate) => {
    setLoading(true);
    setError(null);
    
    try {
      await vaultService.addPassword(entry);
      toast.success('Password added successfully');
      await refreshEntries();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add password');
      toast.error(err.response?.data?.detail || 'Failed to add password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (id: number, entry: VaultEntryCreate) => {
    setLoading(true);
    setError(null);
    
    try {
      await vaultService.updatePassword(id, entry);
      toast.success('Password updated successfully');
      await refreshEntries();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update password');
      toast.error(err.response?.data?.detail || 'Failed to update password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await vaultService.deletePassword(id);
      toast.success('Password deleted successfully');
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete password');
      toast.error(err.response?.data?.detail || 'Failed to delete password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const shareEntry = async (entryId: number, userEmail: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await vaultService.shareEntry({ vault_entry_id: entryId, user_email: userEmail });
      toast.success('Password shared successfully');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to share password');
      toast.error(err.response?.data?.detail || 'Failed to share password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: VaultContextType = {
    entries,
    loading,
    error,
    currentWebsite,
    setCurrentWebsite,
    refreshEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    shareEntry,
  };

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
};