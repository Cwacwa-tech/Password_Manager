export interface VaultEntry {
  id?: string;
  user_email: string;
  site: string;
  username: string;
  encrypted_password: string;
  last_modified: string;
}

export interface User {
  email: string;
  username: string;
  encryption_key: string;
}

export interface SyncMetadata {
  id?: string;
  entry_id: string;
  operation: string;
  synced: boolean;
}

export interface ResponseObject {
  id?: number | string;
  email?: string;
  username?: string;
  site?: string;
  password?: string;
  message?: string;
  error?: string;
  last_modified?: string;
}