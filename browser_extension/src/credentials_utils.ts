import {simulateUserInput} from './common'

// Function to collect credentials from the form
export function collectCredentials(form: HTMLElement) {
    // Get hostname for site identification
    const site = window.location.hostname;
    
    // Find password field
    const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
    const password = passwordInput ? passwordInput.value : '';
    
    // Find username/email field using similar logic to your existing code
    let username = '';
    const userIdentifierSelectors = [
        'input[type="email"]', 
        'input[name*="email" i]', 
        'input[id*="email" i]',
        'input[type="text"][name*="user" i]', 
        'input[id*="user" i]',
        'input[name*="login" i]', 
        'input[id*="login" i]'
        // Add other selectors as needed
    ];
    
    for (const selector of userIdentifierSelectors) {
        const input = form.querySelector(selector) as HTMLInputElement;
        if (input && input.value) {
            username = input.value;
            break;
        }
    }
    
    return {
        site,
        username,
        password,
        timestamp: new Date().toISOString()
    };
}

// Function to autofill credentials
export function autofillCredentials(form: HTMLElement, username: string, password: string) {
    // Find password field
    const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
    if (passwordInput) {
        simulateUserInput(passwordInput, password);
    }

    // Find username/email field using similar logic to your existing code
    const userIdentifierSelectors = [
        'input[type="email"]', 
        'input[name*="email" i]', 
        'input[id*="email" i]',
        'input[type="text"][name*="user" i]', 
        'input[id*="user" i]',
        'input[name*="login" i]', 
        'input[id*="login" i]'
    ];

    for (const selector of userIdentifierSelectors) {
        const input = form.querySelector(selector) as HTMLInputElement;
        if (input) {
        simulateUserInput(input, username);
        break;
        }
    }
}

// function to retrieve saved credentials for the current site
export function retrieveSavedCredentials(callback: (credentials: any[] | null) => void) {
    const currentSite = window.location.hostname;

    chrome.runtime.sendMessage(
        { action: "getCredentials", site: currentSite },
        (response) => {
        if (response?.success && response.credentials) {
            callback(response.credentials);
        } else {
            console.error("Failed to retrieve credentials:", response?.error);
            callback(null);
        }
        }
    );
}