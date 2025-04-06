// src/services/autofillService.ts
import { vaultService } from './vaultService';

export const setupAutofill = () => {
  // This would ideally be part of a browser extension
  // For demonstration, this shows how we'd interface with the extension
  
  const getCurrentDomain = (): string => {
    // In a real extension, this would use browser API to get current tab URL
    // For demo purposes, we'll extract from window.location
    return window.location.hostname;
  };
  
  const autofillCredentials = async () => {
    try {
      const currentDomain = getCurrentDomain();
      const credentials = await vaultService.getPasswordsForWebsite(currentDomain);
      
      if (credentials.length === 0) {
        console.log('No saved credentials for this domain');
        return null;
      }
      
      // If multiple credentials exist, we'd show a selector UI
      // For simplicity, we'll return the first one
      return credentials[0];
    } catch (error) {
      console.error('Error fetching credentials for autofill:', error);
      return null;
    }
  };
  
  // In a real extension, we would inject this into the page
  const fillLoginForm = (username: string, password: string) => {
    // Find username and password fields on the page
    const usernameFields = document.querySelectorAll('input[type="email"], input[type="text"]');
    const passwordFields = document.querySelectorAll('input[type="password"]');
    
    // Fill in the first username field found
    for (const field of usernameFields) {
      const input = field as HTMLInputElement;
      input.value = username;
      break;
    }
    
    // Fill in the first password field found
    for (const field of passwordFields) {
      const input = field as HTMLInputElement;
      input.value = password;
      break;
    }
  };
  
  return {
    autofillCredentials,
    fillLoginForm
  };
};