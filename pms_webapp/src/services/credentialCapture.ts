// src/services/credentialCapture.ts
import { vaultService, VaultEntryCreate } from './vaultService';
import { toast } from 'react-hot-toast';

export const setupCredentialCapture = () => {
  // This would ideally be part of a browser extension
  // For demonstration, this shows how we'd interface with the extension
  
  // Mock function to simulate browser extension behavior
  const handleCredentialCapture = async (credentials: VaultEntryCreate) => {
    try {
      // Extract domain from URL (in real extension, this would come from browser API)
      const site = new URL(credentials.site).hostname;
      
      const entry: VaultEntryCreate = {
        site,
        username: credentials.username,
        password: credentials.password
      };
      
      await vaultService.captureCredentials(entry);
      toast.success('Credentials saved to vault');
      
      return true;
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.detail?.includes('already exist')) {
        toast('These credentials are already saved in your vault', {
          icon: 'ℹ️', // Info icon
          style: {
            backgroundColor: '#3498db',
            color: 'white'
          }
        });
        
      } else {
        toast.error('Failed to save credentials');
        console.error('Error capturing credentials:', error);
      }
      return false;
    }
  };
  
  // This would be called by browser extension when credentials are detected
  // window.addEventListener('message', (event) => {
  //   if (event.data.type === 'CREDENTIAL_CAPTURE') {
  //     handleCredentialCapture(event.data.credentials);
  //   }
  // });
  
  return {
    captureCredentials: handleCredentialCapture
  };
};