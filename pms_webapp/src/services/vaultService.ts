// src/services/vaultService.ts

import axios from 'axios';
import { API_URL } from '../config';

import api from '../services/api';

// Types for vault entries
export interface VaultEntry {
  id: number;
  site: string;
  username: string;
  password: string;
  last_modified: string;
}

export interface VaultEntryCreate {
  site: string;
  username: string;
  password: string;
}

export interface SharedUserCreate {
  vault_entry_id: number;
  user_email: string;
}


export const vaultService = {
  // Add a new password to the vault
  addPassword: async (entry: VaultEntryCreate) => {
    const response = await api.post(`/vault/passwords`, entry);
    return response.data;
  },

  // Get all passwords for the user
  getAllPasswords: async () => {
    const response = await api.get(`/vault/all_passwords`);
    return response.data;
  },

  // Update an existing password
  updatePassword: async (entryId: number, entry: VaultEntryCreate): Promise<VaultEntry> => {
    const response = await api.put(`/vault/passwords/${entryId}`, entry);
    return response.data;
  },

  // Get passwords for a specific website
  getPasswordsForWebsite: async (website: string): Promise<VaultEntry[]> => {
    const response = await api.get(`/vault/passwords?website=${encodeURIComponent(website)}`);
    return response.data;
  },

  // Delete a password entry
  deletePassword: async (entryId: number): Promise<{ message: string }> => {
    const response = await api.delete(`/vault/passwords/${entryId}`);
    return response.data;
  },

  // Share a password entry with another user
  shareEntry: async (sharedUser: SharedUserCreate): Promise<SharedUserCreate> => {
    const response = await api.post('/vault/share', sharedUser);
    return response.data;
  },

  // Save credentials captured from login forms
  captureCredentials: async (entry: VaultEntryCreate): Promise<VaultEntry> => {
    const response = await api.post('/vault/capture-credentials', entry);
    return response.data;
  },
};


export default vaultService;