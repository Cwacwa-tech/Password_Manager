// models.ts - Type definitions for all data models
export interface VaultEntry {
  id?: number;
  user_email: string;
  site: string;
  username: string;
  encrypted_password: string;
  last_modified?: string;
}

export interface User {
  email: string;
  username: string;
  encryption_key: string;
  created_at?: string;
}

export interface SyncMetadata {
  id?: number;
  entry_id: number;
  operation: 'create' | 'update' | 'delete';
  timestamp?: string;
  synced: boolean;
}

export interface ResponseObject {
  id?: number;
  email?: string;
  username?: string;
  site?: string;
  password?: string;
  last_modified?: string;
  message?: string;
  error?: string;
}

// EncryptionService.ts - Handles all encryption/decryption operations
import * as CryptoJS from 'crypto-js';

export class LocalEncryptionService {
  private masterKey: string;
  private encryptionKey: string;
  
  constructor(masterKey?: string) {
    if (masterKey) {
      this.masterKey = masterKey;
    } else {
      // Generate a new random key for new users
      const randomBytes = CryptoJS.lib.WordArray.random(32);
      this.masterKey = CryptoJS.enc.Base64.stringify(randomBytes);
    }
    
    // Derive encryption key from master key
    this.encryptionKey = this.deriveKey(this.masterKey);
  }
  
  private deriveKey(masterKey: string, salt?: string): string {
    // Use the same salt as the server for compatibility
    const keySalt = salt || 'secure_salt_for_password_manager';
    
    // PBKDF2 with same parameters as server
    const key = CryptoJS.PBKDF2(masterKey, keySalt, {
      keySize: 256/32, // 256 bits
      iterations: 100000,
      hasher: CryptoJS.algo.SHA256
    });
    
    return CryptoJS.enc.Base64.stringify(key);
  }
  
  encryptData(data: string | Record<string, any>): string {
    // Convert object to string if needed
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Encrypt using AES (comparable to Fernet in Python)
    // Using CryptoJS AES which defaults to CBC mode with PKCS7 padding
    const encrypted = CryptoJS.AES.encrypt(dataString, this.encryptionKey);
    return encrypted.toString();
  }
  
  decryptData(encryptedData: string): string | Record<string, any> {
    try {
      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      // Try to parse as JSON
      try {
        const jsonData = JSON.parse(decryptedString);
        return jsonData || { error: "decryption failed" };
      } catch (error) {
        // If not valid JSON, return as string
        return decryptedString || "(decryption failed)";
      }
    } catch (error) {
      console.error("Error decrypting data:", error);
      return "(decryption failed)";
    }
  }
  
  encryptVaultItem(itemData: string): string {
    return this.encryptData(itemData);
  }
  
  decryptVaultItem(encryptedData: string): Record<string, any> {
    const decryptedData = this.decryptData(encryptedData);
    if (typeof decryptedData === 'string') {
      return { value: decryptedData };
    }
    return decryptedData as Record<string, any>;
  }
  
  static generateEncryptionKeyFromPassword(masterPassword: string, salt?: string): string {
    const keySalt = salt || CryptoJS.lib.WordArray.random(16).toString();
    
    // PBKDF2 with same parameters as server
    const key = CryptoJS.PBKDF2(masterPassword, keySalt, {
      keySize: 256/32,
      iterations: 100000,
      hasher: CryptoJS.algo.SHA256
    });
    
    return CryptoJS.enc.Base64.stringify(key);
  }
  
  getMasterKey(): string {
    return this.masterKey;
  }
}

// DatabaseService.ts - Handles all database operations
import { Database as SQLiteDatabase } from 'sqlite';
import { open } from 'sqlite';
import { VaultEntry, User, SyncMetadata, ResponseObject } from './models';

export class DatabaseService {
  private dbPath: string;
  private db!: SQLiteDatabase;
  
  constructor(dbPath: string = "local_vault.db") {
    this.dbPath = dbPath;
  }
  
  async initialize(): Promise<void> {
    try {
      // Open the database
      this.db = await open({
        filename: this.dbPath,
        driver: require('sqlite3').Database
      });
      
      // Create users table
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          email TEXT PRIMARY KEY,
          username TEXT NOT NULL,
          encryption_key TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Create vault entries table
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS vault_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_email TEXT NOT NULL,
          site TEXT NOT NULL,
          username TEXT NOT NULL,
          encrypted_password TEXT NOT NULL,
          last_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_email) REFERENCES users (email)
        )
      `);
      
      // Create sync metadata table
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS sync_metadata (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          entry_id INTEGER,
          operation TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          synced BOOLEAN DEFAULT 0,
          FOREIGN KEY (entry_id) REFERENCES vault_entries (id)
        )
      `);
      
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }
  
  // User operations
  async createUser(user: User): Promise<void> {
    await this.db.run(
      "INSERT INTO users (email, username, encryption_key) VALUES (?, ?, ?)",
      [user.email, user.username, user.encryption_key]
    );
  }
  
  async getUser(email: string): Promise<User | undefined> {
    return await this.db.get<User>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
  }
  
  // Vault entry operations
  async addVaultEntry(entry: VaultEntry): Promise<number> {
    const result = await this.db.run(
      "INSERT INTO vault_entries (user_email, site, username, encrypted_password, last_modified) VALUES (?, ?, ?, ?, ?)",
      [entry.user_email, entry.site, entry.username, entry.encrypted_password, entry.last_modified]
    );
    
    return result.lastID!;
  }
  
  async updateVaultEntry(entry: VaultEntry): Promise<void> {
    await this.db.run(
      "UPDATE vault_entries SET site = ?, username = ?, encrypted_password = ?, last_modified = ? WHERE id = ?",
      [entry.site, entry.username, entry.encrypted_password, entry.last_modified, entry.id]
    );
  }
  
  async getVaultEntries(email: string, site?: string): Promise<VaultEntry[]> {
    if (site) {
      return await this.db.all<VaultEntry[]>(
        "SELECT * FROM vault_entries WHERE user_email = ? AND site = ?",
        [email, site]
      );
    } else {
      return await this.db.all<VaultEntry[]>(
        "SELECT * FROM vault_entries WHERE user_email = ?",
        [email]
      );
    }
  }
  
  async getVaultEntry(id: number): Promise<VaultEntry | undefined> {
    return await this.db.get<VaultEntry>(
      "SELECT * FROM vault_entries WHERE id = ?",
      [id]
    );
  }
  
  async deleteVaultEntry(id: number): Promise<void> {
    await this.db.run("DELETE FROM vault_entries WHERE id = ?", [id]);
  }
  
  // Sync metadata operations
  async addSyncMetadata(metadata: SyncMetadata): Promise<number> {
    const result = await this.db.run(
      "INSERT INTO sync_metadata (entry_id, operation, synced) VALUES (?, ?, ?)",
      [metadata.entry_id, metadata.operation, metadata.synced ? 1 : 0]
    );
    
    return result.lastID!;
  }
  
  async getSyncMetadata(): Promise<any[]> {
    return await this.db.all(`
      SELECT m.id, m.entry_id, m.operation, m.timestamp, 
             v.user_email, v.site, v.username, v.encrypted_password, v.last_modified
      FROM sync_metadata m
      LEFT JOIN vault_entries v ON m.entry_id = v.id
      WHERE m.synced = 0
      ORDER BY m.timestamp
    `);
  }
  
  async updateSyncStatus(id: number, synced: boolean): Promise<void> {
    await this.db.run(
      "UPDATE sync_metadata SET synced = ? WHERE id = ?",
      [synced ? 1 : 0, id]
    );
  }
  
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
    }
  }
}

// VaultService.ts - Main service that coordinates encryption and database operations
import { LocalEncryptionService } from './EncryptionService';
import { DatabaseService } from './DatabaseService';
import { VaultEntry, User, SyncMetadata, ResponseObject } from './models';

export class LocalVault {
  private dbService: DatabaseService;
  private encryptionService: LocalEncryptionService;
  
  constructor(dbPath: string = "local_vault.db", masterKey?: string) {
    this.dbService = new DatabaseService(dbPath);
    this.encryptionService = new LocalEncryptionService(masterKey);
    this.initDb();
  }
  
  private async initDb(): Promise<void> {
    await this.dbService.initialize();
  }
  
  async createUser(email: string, username: string, masterPassword: string): Promise<ResponseObject> {
    try {
      // Generate encryption key from master password
      const encryptionKey = LocalEncryptionService.generateEncryptionKeyFromPassword(masterPassword);
      
      // Create user object
      const user: User = {
        email,
        username,
        encryption_key: encryptionKey
      };
      
      // Insert user into database
      await this.dbService.createUser(user);
      
      return {
        email,
        username,
        message: "User created successfully"
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return { error: "User creation failed, email may already exist" };
    }
  }
  
  async addPassword(email: string, site: string, username: string, password: string): Promise<ResponseObject> {
    try {
      // Check if user exists
      const user = await this.dbService.getUser(email);
      
      if (!user) {
        return { error: "User not found" };
      }
      
      // Check if entry already exists
      const existingEntries = await this.dbService.getVaultEntries(email, site);
      
      if (existingEntries.length > 0) {
        return { error: "Site already exists in the vault for this user." };
      }
      
      // Initialize encryption service with user's key
      const encryptionService = new LocalEncryptionService(user.encryption_key);
      const encryptedPassword = encryptionService.encryptVaultItem(password);
      
      // Add entry to vault
      const currentTime = new Date().toISOString();
      const entry: VaultEntry = {
        user_email: email,
        site,
        username,
        encrypted_password: encryptedPassword,
        last_modified: currentTime
      };
      
      const entryId = await this.dbService.addVaultEntry(entry);
      
      // Track for sync
      const syncMetadata: SyncMetadata = {
        entry_id: entryId,
        operation: "create",
        synced: false
      };
      
      await this.dbService.addSyncMetadata(syncMetadata);
      
      return {
        id: entryId,
        site,
        username,
        last_modified: currentTime
      };
    } catch (error) {
      console.error("Error adding password:", error);
      return { error: "Failed to add password" };
    }
  }
  
  async updatePassword(email: string, entryId: number, site: string, username: string, password: string): Promise<ResponseObject> {
    try {
      // Check if user exists
      const user = await this.dbService.getUser(email);
      
      if (!user) {
        return { error: "User not found" };
      }
      
      // Check if entry exists and belongs to user
      const existingEntry = await this.dbService.getVaultEntry(entryId);
      
      if (!existingEntry || existingEntry.user_email !== email) {
        return { error: "Entry not found or you do not have permission to update it." };
      }
      
      // Initialize encryption service with user's key
      const encryptionService = new LocalEncryptionService(user.encryption_key);
      const encryptedPassword = encryptionService.encryptVaultItem(password);
      
      // Update entry
      const currentTime = new Date().toISOString();
      const updatedEntry: VaultEntry = {
        id: entryId,
        user_email: email,
        site,
        username,
        encrypted_password: encryptedPassword,
        last_modified: currentTime
      };
      
      await this.dbService.updateVaultEntry(updatedEntry);
      
      // Track for sync
      const syncMetadata: SyncMetadata = {
        entry_id: entryId,
        operation: "update",
        synced: false
      };
      
      await this.dbService.addSyncMetadata(syncMetadata);
      
      return {
        id: entryId,
        site,
        username,
        last_modified: currentTime
      };
    } catch (error) {
      console.error("Error updating password:", error);
      return { error: "Failed to update password" };
    }
  }
  
  async getPasswords(email: string, website?: string): Promise<ResponseObject[]> {
    try {
      // Check if user exists
      const user = await this.dbService.getUser(email);
      
      if (!user) {
        return [{ error: "User not found" }];
      }
      
      // Initialize encryption service with user's key
      const encryptionService = new LocalEncryptionService(user.encryption_key);
      
      // Query passwords
      const entries = await this.dbService.getVaultEntries(email, website);
      
      // Format results
      const results: ResponseObject[] = [];
      for (const entry of entries) {
        try {
          // Decrypt password
          const decryptedData = encryptionService.decryptVaultItem(entry.encrypted_password);
          const password = decryptedData.value || "(unable to decrypt)";
          
          // Create result
          results.push({
            id: entry.id,
            site: entry.site,
            username: entry.username,
            password,
            last_modified: entry.last_modified
          });
        } catch (error) {
          results.push({
            id: entry.id,
            site: entry.site,
            username: entry.username,
            password: "(decryption failed)",
            last_modified: entry.last_modified,
            error: String(error)
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error("Error getting passwords:", error);
      return [{ error: "Failed to retrieve passwords" }];
    }
  }
  
  async deletePassword(email: string, entryId: number): Promise<ResponseObject> {
    try {
      // Check if entry exists and belongs to user
      const existingEntry = await this.dbService.getVaultEntry(entryId);
      
      if (!existingEntry || existingEntry.user_email !== email) {
        return { error: "Entry not found or you do not have permission to delete it." };
      }
      
      // Track for sync before deleting
      const syncMetadata: SyncMetadata = {
        entry_id: entryId,
        operation: "delete",
        synced: false
      };
      
      await this.dbService.addSyncMetadata(syncMetadata);
      
      // Delete entry
      await this.dbService.deleteVaultEntry(entryId);
      
      return { message: "Entry deleted successfully." };
    } catch (error) {
      console.error("Error deleting password:", error);
      return { error: "Failed to delete password" };
    }
  }
  
  async getPendingSyncs(): Promise<any[]> {
    try {
      // Get all pending sync operations
      const syncs = await this.dbService.getSyncMetadata();
      
      // Format results
      return syncs.map(sync => {
        const syncData: any = {
          meta_id: sync.id,
          entry_id: sync.entry_id,
          operation: sync.operation,
          timestamp: sync.timestamp
        };
        
        // Include entry data if available (could be null for deleted entries)
        if (sync.user_email) {
          syncData.user_email = sync.user_email;
          syncData.site = sync.site;
          syncData.username = sync.username;
          syncData.encrypted_password = sync.encrypted_password;
          syncData.last_modified = sync.last_modified;
        }
        
        return syncData;
      });
    } catch (error) {
      console.error("Error getting pending syncs:", error);
      return [];
    }
  }
  
  async markSynced(metaId: number): Promise<ResponseObject> {
    try {
      await this.dbService.updateSyncStatus(metaId, true);
      
      return { message: `Sync operation ${metaId} marked as completed.` };
    } catch (error) {
      console.error("Error marking sync as completed:", error);
      return { error: "Failed to mark sync as completed" };
    }
  }
  
  // Helper method to close database connection
  async close(): Promise<void> {
    await this.dbService.close();
  }
}