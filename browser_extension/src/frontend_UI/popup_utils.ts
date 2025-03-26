import { collectCredentials, autofillCredentials } from '../core_services/credentials_utils';
import { simulateUserInput } from '../common';

/**
 * Shows a confirmation popup to save credentials
 * @param form The HTML form element containing credentials
 * @param callback Function to call after user makes a decision
 */
export function showConfirmationPopup(form: HTMLElement, callback: (confirmed: boolean) => void) {
    // Get credentials first so we can display them
    const credentials = collectCredentials(form);
    
    // Create popup container
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '9999';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.alignItems = 'center';
    popup.style.minWidth = '300px';
    popup.style.position = 'relative'; // Need this for absolute positioning of close button
    
    // Create close button (X)
    const closeButton = document.createElement('div');
    closeButton.textContent = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '18px'; // Increased font size
    closeButton.style.fontWeight = 'bold';
    closeButton.style.color = '#000'; // Darker color by default
    closeButton.style.backgroundColor = '#f0f0f0'; // Light background
    closeButton.style.borderRadius = '50%'; // Make it circular
    closeButton.style.width = '22px';
    closeButton.style.height = '22px';
    closeButton.style.display = 'flex';
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';
    closeButton.style.lineHeight = '1'; // Proper vertical alignment
    closeButton.style.transition = 'all 0.2s ease';
    popup.appendChild(closeButton);
    
    // Add hover effect for close button
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.color = '#000';
    });
    
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.color = '#555';
    });
    
    // Function to close popup and resume website functionality
    const closePopupAndResume = (confirmed: boolean) => {
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
        }
        
        // Call the callback to resume website functionality
        callback(confirmed);
    };
    
    // Close button click handler
    closeButton.addEventListener('click', () => {
        closePopupAndResume(false);
    });
    
    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Save Credentials?';
    title.style.marginBottom = '15px';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    popup.appendChild(title);
    
    // Create credentials display container
    const credentialsContainer = document.createElement('div');
    credentialsContainer.style.width = '100%';
    credentialsContainer.style.marginBottom = '20px';
    credentialsContainer.style.padding = '10px';
    credentialsContainer.style.backgroundColor = '#f5f5f5';
    credentialsContainer.style.borderRadius = '4px';
    credentialsContainer.style.border = '1px solid #ddd';
    popup.appendChild(credentialsContainer);
    
    // Website/domain
    const siteInfo = document.createElement('div');
    siteInfo.style.marginBottom = '8px';
    siteInfo.style.fontSize = '14px';
    siteInfo.innerHTML = `<strong>Site:</strong> ${credentials.site}`;
    credentialsContainer.appendChild(siteInfo);
    
    // Username/email
    const usernameInfo = document.createElement('div');
    usernameInfo.style.marginBottom = '8px';
    usernameInfo.style.fontSize = '14px';
    usernameInfo.innerHTML = `<strong>Username:</strong> ${credentials.username || '[empty]'}`;
    credentialsContainer.appendChild(usernameInfo);
    
    // Password (masked) - now showing full length
    const passwordInfo = document.createElement('div');
    passwordInfo.style.fontSize = '14px';
    passwordInfo.innerHTML = `<strong>Password:</strong> ${'•'.repeat(credentials.password.length)}`;
    credentialsContainer.appendChild(passwordInfo);
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    popup.appendChild(buttonContainer);
    
    // Create status message area (initially hidden)
    const statusMessage = document.createElement('div');
    statusMessage.style.marginTop = '10px';
    statusMessage.style.padding = '5px';
    statusMessage.style.borderRadius = '4px';
    statusMessage.style.fontSize = '14px';
    statusMessage.style.textAlign = 'center';
    statusMessage.style.display = 'none';  // Initially hidden
    popup.appendChild(statusMessage);
    
    // Create Yes button
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.style.padding = '8px 16px';
    yesButton.style.backgroundColor = '#4CAF50';
    yesButton.style.border = '2px solid #000000'; // Adding a black border
    yesButton.style.borderRadius = '4px';
    yesButton.style.color = 'white';
    yesButton.style.cursor = 'pointer';
    yesButton.style.transition = 'all 0.2s ease'; // Smooth transition for effects
    buttonContainer.appendChild(yesButton);
    
    // Create No button
    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.style.padding = '8px 16px';
    noButton.style.backgroundColor = '#f44336';
    noButton.style.border = '2px solid #000000'; // Adding a black border
    noButton.style.borderRadius = '4px';
    noButton.style.color = 'white';
    noButton.style.cursor = 'pointer';
    noButton.style.transition = 'all 0.2s ease'; // Smooth transition for effects
    buttonContainer.appendChild(noButton);
    
    // Add visual feedback for button clicks
    yesButton.addEventListener('mousedown', () => {
        yesButton.style.backgroundColor = '#3B8C3E'; // Darker green when clicked
        yesButton.style.transform = 'scale(0.95)'; // Slight shrink effect
    });
    
    noButton.addEventListener('mousedown', () => {
        noButton.style.backgroundColor = '#D32F2F'; // Darker red when clicked
        noButton.style.transform = 'scale(0.95)'; // Slight shrink effect
    });
    
    // Add hover effects for better UX
    yesButton.addEventListener('mouseover', () => {
        yesButton.style.backgroundColor = '#45A049';
    });
    
    yesButton.addEventListener('mouseout', () => {
        yesButton.style.backgroundColor = '#4CAF50';
        yesButton.style.transform = 'scale(1)'; // Reset any transform
    });
    
    noButton.addEventListener('mouseover', () => {
        noButton.style.backgroundColor = '#E53935';
    });
    
    noButton.addEventListener('mouseout', () => {
        noButton.style.backgroundColor = '#f44336';
        noButton.style.transform = 'scale(1)'; // Reset any transform
    });
    
    // Handle Yes button click
    yesButton.addEventListener('click', () => {
        // Disable buttons to prevent multiple clicks
        yesButton.disabled = true;
        noButton.disabled = true;
        closeButton.style.pointerEvents = 'none'; // Disable close button during processing
        
        // Send to background script - we already collected the credentials
        chrome.runtime.sendMessage({
            action: 'saveCredentials',
            data: credentials
        }, (response) => {
            console.log('Credentials saved status:', response);
            
            if (response.success) {
                // Check if this was a duplicate
                if (response.message === 'Password already saved!') {
                    // Show duplicate message
                    statusMessage.textContent = 'This password was already saved!';
                    statusMessage.style.backgroundColor = '#FFF3CD';
                    statusMessage.style.color = '#856404';
                    statusMessage.style.border = '1px solid #FFEEBA';
                    statusMessage.style.display = 'block';
                    
                    // Auto-close after 1.5 seconds
                    setTimeout(() => {
                        closePopupAndResume(true);
                    }, 1500);
                } else {
                    // Success message
                    statusMessage.textContent = 'Credentials saved successfully!';
                    statusMessage.style.backgroundColor = '#D4EDDA';
                    statusMessage.style.color = '#155724';
                    statusMessage.style.border = '1px solid #C3E6CB';
                    statusMessage.style.display = 'block';
                    
                    // Auto-close after 1.5 seconds
                    setTimeout(() => {
                        closePopupAndResume(true);
                    }, 1500);
                }
            } else {
                // Error message
                statusMessage.textContent = 'Failed to save credentials.';
                statusMessage.style.backgroundColor = '#F8D7DA';
                statusMessage.style.color = '#721C24';
                statusMessage.style.border = '1px solid #F5C6CB';
                statusMessage.style.display = 'block';
                
                // Auto-close after 1.5 seconds
                setTimeout(() => {
                        closePopupAndResume(false);
                }, 1500);
            }
        });
    });
    
    noButton.addEventListener('click', () => {
        closePopupAndResume(false);
    });
    
    // Add popup to page
    document.body.appendChild(popup);
}

/**
 * Shows a password suggestion popup with an auto-fill option
 * @param passwordField The password input field to suggest a password for
 */
export function showPasswordSuggestionPopup(passwordField: HTMLInputElement) {
    // Get generated password from backend
    chrome.runtime.sendMessage(
      { action: "generate_password" },
      (response) => {
        if (!response?.password) {
          console.error("Failed to generate password:", response?.error);
          return;
        }
        
        const generatedPassword = response.password;
        
        // Create popup container
        const popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.top = `${passwordField.getBoundingClientRect().bottom + window.scrollY + 5}px`;
        popup.style.left = `${passwordField.getBoundingClientRect().left + window.scrollX}px`;
        popup.style.backgroundColor = 'white';
        popup.style.padding = '15px';
        popup.style.borderRadius = '5px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        popup.style.zIndex = '9999';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.minWidth = '250px';
        
        // Create title
        const title = document.createElement('h4');
        title.textContent = 'Suggested Password';
        title.style.marginTop = '0';
        title.style.marginBottom = '10px';
        title.style.fontSize = '16px';
        title.style.fontWeight = 'bold';
        popup.appendChild(title);
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = '✕';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.backgroundColor = 'transparent';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '16px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => document.body.removeChild(popup);
        popup.appendChild(closeButton);
        
        // Password display box
        const passwordBox = document.createElement('div');
        passwordBox.style.padding = '8px';
        passwordBox.style.backgroundColor = '#f5f5f5';
        passwordBox.style.borderRadius = '4px';
        passwordBox.style.border = '1px solid #ddd';
        passwordBox.style.marginBottom = '10px';
        passwordBox.style.fontFamily = 'monospace';
        passwordBox.style.wordBreak = 'break-all';
        passwordBox.textContent = generatedPassword;
        popup.appendChild(passwordBox);
        
        // Auto-fill button
        const fillButton = document.createElement('button');
        fillButton.textContent = 'Auto-fill';
        fillButton.style.padding = '8px';
        fillButton.style.backgroundColor = '#4285F4';
        fillButton.style.border = 'none';
        fillButton.style.borderRadius = '4px';
        fillButton.style.color = 'white';
        fillButton.style.cursor = 'pointer';
        fillButton.onclick = () => {
          simulateUserInput(passwordField, generatedPassword);
          document.body.removeChild(popup);
        };
        popup.appendChild(fillButton);
        
        // Add popup to page
        document.body.appendChild(popup);
      }
    );
}
/**
 * Shows a popup with saved credentials that can be selected for auto-fill
 * @param credentials Array of saved credential objects to display
 * @param form The HTML form element where credentials will be filled
 */
export function showCredentialSelectionPopup(credentials: any[], form: HTMLElement) {
    // Create popup container
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'white';
    popup.style.padding = '20px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '9999';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.alignItems = 'center';
    popup.style.minWidth = '300px';
    popup.style.maxHeight = '400px';
    popup.style.overflowY = 'auto';
    popup.style.position = 'relative'; // For absolute positioning of close button

    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Saved Credentials';
    title.style.marginBottom = '15px';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    popup.appendChild(title);

    // Create close button
    const closeButton = document.createElement('div');
    closeButton.textContent = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '18px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.color = '#000';
    closeButton.style.backgroundColor = '#f0f0f0';
    closeButton.style.borderRadius = '50%';
    closeButton.style.width = '22px';
    closeButton.style.height = '22px';
    closeButton.style.display = 'flex';
    closeButton.style.justifyContent = 'center';
    closeButton.style.alignItems = 'center';
    closeButton.style.lineHeight = '1';
    closeButton.style.transition = 'all 0.2s ease';
    popup.appendChild(closeButton);
    
    // Add hover effect for close button
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.color = '#000';
    });
    
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.color = '#555';
    });
    
    closeButton.addEventListener('click', () => {
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
        }
    });

    // Create credentials list
    credentials.forEach(cred => {
        const credContainer = document.createElement('div');
        credContainer.style.width = '100%';
        credContainer.style.marginBottom = '10px';
        credContainer.style.padding = '10px';
        credContainer.style.backgroundColor = '#f5f5f5';
        credContainer.style.borderRadius = '4px';
        credContainer.style.border = '1px solid #ddd';
        
        // Username/email
        const usernameInfo = document.createElement('div');
        usernameInfo.style.marginBottom = '8px';
        usernameInfo.style.fontSize = '14px';
        usernameInfo.innerHTML = `<strong>Username:</strong> ${cred.username || '[empty]'}`;
        credContainer.appendChild(usernameInfo);
        
        // Password (masked)
        const passwordInfo = document.createElement('div');
        passwordInfo.style.fontSize = '14px';
        passwordInfo.innerHTML = `<strong>Password:</strong> ${'•'.repeat(Math.min(cred.password.length, 8))}`;
        credContainer.appendChild(passwordInfo);
        
        // Auto-fill button
        const fillButton = document.createElement('button');
        fillButton.textContent = 'Auto-fill';
        fillButton.style.marginTop = '8px';
        fillButton.style.padding = '5px 10px';
        fillButton.style.backgroundColor = '#4285F4';
        fillButton.style.border = 'none';
        fillButton.style.borderRadius = '4px';
        fillButton.style.color = 'white';
        fillButton.style.cursor = 'pointer';
        fillButton.style.transition = 'all 0.2s ease';
        
        // Add hover effects for better UX
        fillButton.addEventListener('mouseover', () => {
            fillButton.style.backgroundColor = '#3367D6';
        });
        
        fillButton.addEventListener('mouseout', () => {
            fillButton.style.backgroundColor = '#4285F4';
            fillButton.style.transform = 'scale(1)';
        });
        
        fillButton.addEventListener('mousedown', () => {
            fillButton.style.backgroundColor = '#2A56C6';
            fillButton.style.transform = 'scale(0.95)';
        });
        
        fillButton.onclick = () => {
            autofillCredentials(form, cred.username, cred.password);
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        };
        credContainer.appendChild(fillButton);
        
        popup.appendChild(credContainer);
    });

    // Add popup to page
    document.body.appendChild(popup);
}