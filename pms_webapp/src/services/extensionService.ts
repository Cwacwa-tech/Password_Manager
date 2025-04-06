// src/services/extensionService.ts

import { VaultEntryCreate } from "./vaultService";

// This service handles communication with the browser extension
const extensionService = {
  // Initialize communication with the extension
  initialize: () => {
    // Listen for messages from the extension
    window.addEventListener('message', (event) => {
      // Make sure the message is from our extension
      if (event.data && event.data.type === 'PASSWORD_MANAGER_EXT') {
        handleExtensionMessage(event.data);
      }
    });
    
    // Notify extension that the web app is ready
    window.postMessage({ type: 'PASSWORD_MANAGER_APP_READY' }, '*');
  },
  
  // Send available credentials to the extension for autofill
  sendCredentialsToExtension: (site: string, credentials: { username: string, password: string }[]) => {
    window.postMessage({
      type: 'PASSWORD_MANAGER_CREDENTIALS',
      site,
      credentials
    }, '*');
  }
};

// Handle incoming messages from the extension
const handleExtensionMessage = (message: any) => {
  switch (message.action) {
    case 'CAPTURE_CREDENTIALS':
      // Extension is sending captured credentials
      if (message.site && message.username && message.password) {
        const entry: VaultEntryCreate = {
          site: message.site,
          username: message.username,
          password: message.password
        };
        
        // Save the credentials (you'd need to implement this)
        captureCredentialsFromExtension(entry);
      }
      break;
      
    case 'REQUEST_CREDENTIALS':
      // Extension is requesting credentials for a site
      if (message.site) {
        // Fetch credentials for the site (you'd need to implement this)
        fetchCredentialsForExtension(message.site);
      }
      break;
  }
};

// Function to handle credential capture from the extension
const captureCredentialsFromExtension = async (entry: VaultEntryCreate) => {
  try {
    // Import here to avoid circular dependencies
    const vaultService = (await import('./vaultService')).default;
    await vaultService.captureCredentials(entry);
    
    // Notify extension of success
    window.postMessage({
      type: 'PASSWORD_MANAGER_RESPONSE',
      action: 'CAPTURE_SUCCESS',
      site: entry.site
    }, '*');
  } catch (error) {
    console.error('Failed to capture credentials:', error);
    
    // Notify extension of failure
    window.postMessage({
      type: 'PASSWORD_MANAGER_RESPONSE',
      action: 'CAPTURE_FAILED',
      site: entry.site,
      error: 'Failed to save credentials'
    }, '*');
  }
};

// Function to fetch credentials for the extension
const fetchCredentialsForExtension = async (site: string) => {
  try {
    // Import here to avoid circular dependencies
    const vaultService = (await import('./vaultService')).default;
    const credentials = await vaultService.getPasswordsForWebsite(site);
    
    // Send credentials to extension
    extensionService.sendCredentialsToExtension(
      site,
      credentials.map(cred => ({
        username: cred.username,
        password: cred.password
      }))
    );
  } catch (error) {
    console.error('Failed to fetch credentials:', error);
    
    // Notify extension of failure
    window.postMessage({
      type: 'PASSWORD_MANAGER_RESPONSE',
      action: 'FETCH_FAILED',
      site: site,
      error: 'Failed to retrieve credentials'
    }, '*');
  }
};

export default extensionService;