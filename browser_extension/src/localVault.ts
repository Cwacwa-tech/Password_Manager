import { LocalEncryptionService } from './EncryptionService';
import { ResponseObject, SyncMetadata, User, VaultEntry } from './models';
import {ChromeStorageService} from './storage_services/chromeStorageService';

export class LocalVault {
  private storageService: ChromeStorageService;
  private encryptionService: LocalEncryptionService;
  
  constructor(masterKey?: string) {
      this.storageService = new ChromeStorageService();
      this.encryptionService = new LocalEncryptionService(masterKey);
  }
  
  async createUser(email: string, username: string, masterPassword: string): Promise<ResponseObject> {
      try {
          // Check if user already exists
          const existingUsers = await this.storageService.get<{ [email: string]: User }>('users') || {};
          
          if (existingUsers[email]) {
              return { error: "User already exists" };
          }
          
          // Generate encryption key from master password
          const encryptionKey = LocalEncryptionService.generateEncryptionKeyFromPassword(masterPassword);
          
          // Create user
          const user: User = { email, username, encryption_key: encryptionKey };
          
          // Save user
          await this.storageService.update(users => ({
              ...users,
              [email]: user
          }), 'users');
          
          return {
              email,
              username,
              message: "User created successfully"
          };
      } catch (error) {
          console.error("Error creating user:", error);
          return { error: "User creation failed" };
      }
  }
  
  async addPassword(email: string, site: string, username: string, password: string): Promise<ResponseObject> {
      try {
          // Validate user
          const users = await this.storageService.get<{ [email: string]: User }>('users') || {};
          const user = users[email];
          
          if (!user) {
              return { error: "User not found" };
          }
          
          // Check for existing entries
          const vaultEntries = await this.storageService.get<{ [email: string]: VaultEntry[] }>('vault_entries') || {};
          const userEntries = vaultEntries[email] || [];
          
          if (userEntries.some(entry => entry.site === site)) {
              return { error: "Site already exists in the vault for this user." };
          }
          
          // Encrypt password
          const encryptionService = new LocalEncryptionService(user.encryption_key);
          const encryptedPassword = encryptionService.encryptVaultItem(password);
          
          // Create new entry
          const currentTime = new Date().toISOString();
          const newEntry: VaultEntry = {
              id: this.generateUniqueId(),
              user_email: email,
              site,
              username,
              encrypted_password: encryptedPassword,
              last_modified: currentTime
          };
          
          // Update vault entries
          await this.storageService.update(entries => {
              const updatedEntries = { ...entries };
              updatedEntries[email] = [...(updatedEntries[email] || []), newEntry];
              return updatedEntries;
          }, 'vault_entries');
          
          // Track sync metadata
          await this.storageService.update(syncs => {
            const updatedSyncs = { ...syncs };
        
            if (newEntry?.id) {
                updatedSyncs[newEntry.id] = {
                    entry_id: newEntry.id,
                    operation: 'create',
                    synced: false
                };
            }
        
            return updatedSyncs;
          }, 'sync_metadata');
        
          return {
              id: newEntry.id,
              site,
              username,
              last_modified: currentTime
          };
      } catch (error) {
          console.error("Error adding password:", error);
          return { error: "Failed to add password" };
      }
  }
  
  async getPasswords(email: string, website?: string): Promise<ResponseObject[]> {
    try {
        // Get user - provide an empty object as default value
        const users = await this.storageService.get<{ [email: string]: User }>('users') || {};
        const user = users[email];
        
        if (!user) {
            return [{ error: "User not found" }];
        }
        
        // Rest of the method remains the same...
        const vaultEntries = await this.storageService.get<{ [email: string]: VaultEntry[] }>('vault_entries') || {};
        const entries = vaultEntries[email] || [];
        
        const filteredEntries = website 
            ? entries.filter(entry => entry.site === website)
            : entries;
        
        const encryptionService = new LocalEncryptionService(user.encryption_key);
        
        return filteredEntries.map(entry => {
            try {
                const decryptedData = encryptionService.decryptVaultItem(entry.encrypted_password);
                return {
                    id: entry.id,
                    site: entry.site,
                    username: entry.username,
                    password: decryptedData.value || "(unable to decrypt)",
                    last_modified: entry.last_modified
                };
            } catch (error) {
                return {
                    id: entry.id,
                    site: entry.site,
                    username: entry.username,
                    password: "(decryption failed)",
                    last_modified: entry.last_modified,
                    error: String(error)
                };
            }
        });
    } catch (error) {
        console.error("Error getting passwords:", error);
        return [{ error: "Failed to retrieve passwords" }];
    }
}
  
  // Generate a unique ID for entries
  private generateUniqueId(): string {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  async getPendingSyncs(): Promise<any[]> {
      try {
          const syncMetadata = await this.storageService.get<{ [id: string]: SyncMetadata }>('sync_metadata') || {};
          
          return Object.entries(syncMetadata)
              .filter(([_, metadata]) => !metadata.synced)
              .map(([id, metadata]) => ({
                  meta_id: id,
                  ...metadata
              }));
      } catch (error) {
          console.error("Error getting pending syncs:", error);
          return [];
      }
  }
  
  async markSynced(metaId: string): Promise<ResponseObject> {
      try {
          await this.storageService.update(syncs => {
              const updatedSyncs = { ...syncs };
              if (updatedSyncs[metaId]) {
                  updatedSyncs[metaId].synced = true;
              }
              return updatedSyncs;
          }, 'sync_metadata');
          
          return { message: `Sync operation ${metaId} marked as completed.` };
      } catch (error) {
          console.error("Error marking sync as completed:", error);
          return { error: "Failed to mark sync as completed" };
      }
  }
}