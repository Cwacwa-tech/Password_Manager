// Function to log form detection
function logFormDetection(formType: string): void {
    console.log(`${formType} form detected!!!`);
}

// Function to check if an element is a login form with improved accuracy
function isLoginForm(elem: HTMLElement): boolean {
    // Check for password field - essential for login forms
    const hasPassword = elem.querySelector('input[type="password"], input[name*="pass"], input[id*="pass"]');
    if (!hasPassword) return false;
    
    // Expanded check for username/user ID/email fields with more variations
    const userIdentifierSelectors = [
        // Username selectors
        'input[type="text"][name*="user" i]', 'input[id*="user" i]', 'input[placeholder*="user" i]',
        // User ID selectors
        'input[type="text"][name*="userid" i]', 'input[id*="userid" i]', 'input[placeholder*="userid" i]',
        'input[type="text"][name*="user_id" i]', 'input[id*="user_id" i]', 'input[placeholder*="user_id" i]',
        'input[type="text"][name*="user-id" i]', 'input[id*="user-id" i]', 'input[placeholder*="user-id" i]',
        'input[type="text"][name*="id" i]', 'input[id*="id" i]', 'input[placeholder*="id" i]',
        // Account selectors
        'input[type="text"][name*="account" i]', 'input[id*="account" i]', 'input[placeholder*="account" i]',
        // Login selectors
        'input[type="text"][name*="login" i]', 'input[id*="login" i]', 'input[placeholder*="login" i]',
        // Email selectors
        'input[type="email"]', 'input[name*="email" i]', 'input[id*="email" i]', 'input[placeholder*="email" i]'
    ];
    
    // Check for any user identifier field
    const hasUserIdentifier = userIdentifierSelectors.some(selector => elem.querySelector(selector) !== null);
    
    // Check for labels that might indicate user ID fields
    const hasUserIdLabel = Array.from(elem.querySelectorAll('label')).some(label => {
        const labelText = label.textContent?.toLowerCase().trim() || '';
        return labelText.includes('user id') || 
               labelText.includes('userid') || 
               labelText.includes('user-id') || 
               labelText.includes('user_id') || 
               labelText.includes('id') || 
               labelText === 'id';
    });
    
    // Check for login-specific buttons or text indicating this is a login (not signup) form
    const loginButtonTexts = ["log in", "sign in", "login", "signin", "authenticate", "continue", "submit", "go"];
    const signupButtonTexts = ["sign up", "signup", "register", "create account", "join now", "get started"];
    
    // Find all buttons and submit inputs
    const buttons = Array.from(elem.querySelectorAll('button, input[type="submit"], a.btn, a[role="button"]'));
    
    // Check if there are login buttons
    const hasLoginButton = buttons.some((button) => {
        const buttonText = button.textContent?.toLowerCase().trim() || '';
        const buttonValue = (button as HTMLInputElement).value?.toLowerCase().trim() || '';
        const buttonId = button.id?.toLowerCase() || '';
        const buttonClass = button.className?.toLowerCase() || '';
        
        return loginButtonTexts.some(text => 
            buttonText.includes(text) || 
            buttonValue.includes(text) || 
            buttonId.includes(text) || 
            buttonClass.includes(text)
        );
    });
    
    // Check if this is actually a signup form (to exclude it)
    const isSignupForm = buttons.some((button) => {
        const buttonText = button.textContent?.toLowerCase().trim() || '';
        const buttonValue = (button as HTMLInputElement).value?.toLowerCase().trim() || '';
        return signupButtonTexts.some(text => buttonText.includes(text) || buttonValue.includes(text));
    });
    
    // Check for signup-related fields
    const hasSignupFields = 
        elem.querySelector('input[name*="confirm" i]') !== null || // Confirm password
        elem.querySelector('input[placeholder*="confirm" i]') !== null ||
        elem.querySelector('input[name*="signup" i]') !== null ||
        elem.querySelector('input[name*="sign-up" i]') !== null;
    
    // Check for search-related attributes to exclude search bars
    const isSearchForm = 
        elem.getAttribute('role') === 'search' || 
        elem.id?.toLowerCase().includes('search') || 
        elem.className?.toLowerCase().includes('search') ||
        elem.querySelector('input[type="search"]') !== null ||
        elem.querySelector('input[name*="search" i]') !== null ||
        elem.querySelector('input[placeholder*="search" i]') !== null;
    
    // Additional check for form action or ID that contains login-related terms
    const formAction = elem.getAttribute('action')?.toLowerCase() || '';
    const formId = elem.id?.toLowerCase() || '';
    const formClass = elem.className?.toLowerCase() || '';
    const formMethod = elem.getAttribute('method')?.toLowerCase() || '';
    
    const hasLoginIdentifier = 
        formAction.includes('login') || 
        formAction.includes('signin') || 
        formAction.includes('auth') ||
        formId.includes('login') || 
        formId.includes('signin') ||
        formId.includes('auth') ||
        formClass.includes('login') ||
        formClass.includes('signin') ||
        formClass.includes('auth');
        
    // Check if the form has a title or legend indicating login
    const hasLoginTitle = Array.from(elem.querySelectorAll('h1, h2, h3, h4, h5, h6, legend')).some(heading => {
        const headingText = heading.textContent?.toLowerCase().trim() || '';
        return headingText.includes('login') || 
               headingText.includes('sign in') || 
               headingText.includes('log in') ||
               headingText.includes('authenticate');
    });
    
    // If it has login indicators and is not a signup form or search form
    return (hasPassword && 
           (hasUserIdentifier || hasUserIdLabel || hasLoginButton || hasLoginIdentifier || hasLoginTitle) && 
           !isSignupForm && 
           !hasSignupFields && 
           !isSearchForm);
}

// NEW FUNCTION: Check if an element is a signup form
function isSignupForm(elem: HTMLElement): boolean {
    // Check for password field - essential for signup forms
    const hasPassword = elem.querySelector('input[type="password"], input[name*="pass"], input[id*="pass"]');
    if (!hasPassword) return false;
    
    // Check for signup-specific buttons or text
    const signupButtonTexts = ["sign up", "signup", "register", "create account", "join now", "get started", "create"];
    
    // Find all buttons and submit inputs
    const buttons = Array.from(elem.querySelectorAll('button, input[type="submit"], a.btn, a[role="button"]'));
    
    // Check if there are signup buttons
    const hasSignupButton = buttons.some((button) => {
        const buttonText = button.textContent?.toLowerCase().trim() || '';
        const buttonValue = (button as HTMLInputElement).value?.toLowerCase().trim() || '';
        const buttonId = button.id?.toLowerCase() || '';
        const buttonClass = button.className?.toLowerCase() || '';
        
        return signupButtonTexts.some(text => 
            buttonText.includes(text) || 
            buttonValue.includes(text) || 
            buttonId.includes(text) || 
            buttonClass.includes(text)
        );
    });
    
    // Check for signup-related fields
    const hasSignupFields = 
        elem.querySelector('input[name*="confirm" i]') !== null || // Confirm password
        elem.querySelector('input[placeholder*="confirm" i]') !== null ||
        elem.querySelector('input[name*="signup" i]') !== null ||
        elem.querySelector('input[name*="sign-up" i]') !== null ||
        elem.querySelector('input[name*="register" i]') !== null;
    
    // Check for search-related attributes to exclude search bars
    const isSearchForm = 
        elem.getAttribute('role') === 'search' || 
        elem.id?.toLowerCase().includes('search') || 
        elem.className?.toLowerCase().includes('search') ||
        elem.querySelector('input[type="search"]') !== null ||
        elem.querySelector('input[name*="search" i]') !== null ||
        elem.querySelector('input[placeholder*="search" i]') !== null;
    
    // Additional check for form action or ID that contains signup-related terms
    const formAction = elem.getAttribute('action')?.toLowerCase() || '';
    const formId = elem.id?.toLowerCase() || '';
    const formClass = elem.className?.toLowerCase() || '';
    
    const hasSignupIdentifier = 
        formAction.includes('signup') || 
        formAction.includes('register') || 
        formAction.includes('create') ||
        formId.includes('signup') || 
        formId.includes('register') ||
        formId.includes('create') ||
        formClass.includes('signup') ||
        formClass.includes('register') ||
        formClass.includes('create');
        
    // Check if the form has a title or legend indicating signup
    const hasSignupTitle = Array.from(elem.querySelectorAll('h1, h2, h3, h4, h5, h6, legend')).some(heading => {
        const headingText = heading.textContent?.toLowerCase().trim() || '';
        return headingText.includes('sign up') || 
               headingText.includes('signup') || 
               headingText.includes('register') ||
               headingText.includes('create account') ||
               headingText.includes('join');
    });
    
    // If it has signup indicators and is not a search form
    return (hasPassword && 
           (hasSignupButton || hasSignupFields || hasSignupIdentifier || hasSignupTitle) && 
           !isSearchForm);
}

// Function to fill login form inputs with "LOVE"
function fillFormInputs(elem: HTMLElement) {
    // Fill password field
    const passwordInput = elem.querySelector('input[type="password"]') as HTMLInputElement;
    if (passwordInput && !passwordInput.dataset.filled) {
        simulateUserInput(passwordInput, "LOVE");
        passwordInput.dataset.filled = "true";
        console.debug("Filled password input with 'LOVE':", passwordInput);
    }

    // Define all the selectors for user identifier fields
    const userIdentifierSelectors = [
        // Username selectors
        'input[type="text"][name*="user" i]', 'input[id*="user" i]', 'input[placeholder*="user" i]',
        // User ID selectors
        'input[type="text"][name*="userid" i]', 'input[id*="userid" i]', 'input[placeholder*="userid" i]',
        'input[type="text"][name*="user_id" i]', 'input[id*="user_id" i]', 'input[placeholder*="user_id" i]',
        'input[type="text"][name*="user-id" i]', 'input[id*="user-id" i]', 'input[placeholder*="user-id" i]',
        'input[type="text"][name*="id" i]', 'input[id*="id" i]', 'input[placeholder*="id" i]',
        // Account selectors
        'input[type="text"][name*="account" i]', 'input[id*="account" i]', 'input[placeholder*="account" i]',
        // Login selectors
        'input[type="text"][name*="login" i]', 'input[id*="login" i]', 'input[placeholder*="login" i]',
        // Email selectors
        'input[type="email"]', 'input[name*="email" i]', 'input[id*="email" i]', 'input[placeholder*="email" i]',
        // Generic text inputs that might be user identifiers
        'input[type="text"]'
    ];
    
    // Try each selector until we find a field to fill
    let userIdFilled = false;
    
    for (const selector of userIdentifierSelectors) {
        const inputs = elem.querySelectorAll(selector);
        
        for (const input of Array.from(inputs) as HTMLInputElement[]) {
            // Skip inputs that are already filled or are likely search or hidden fields
            if (input.dataset.filled || 
                input.type === 'hidden' || 
                input.name?.toLowerCase().includes('search') || 
                input.id?.toLowerCase().includes('search') ||
                input.placeholder?.toLowerCase().includes('search')) {
                continue;
            }
            
            // Fill the field
            simulateUserInput(input, "LOVE");
            input.dataset.filled = "true";
            console.debug(`Filled ${input.name || input.id || 'user identifier'} input with 'LOVE':`, input);
            userIdFilled = true;
            break;
        }
        
        if (userIdFilled) break;
    }
    
    // If we still haven't found a field to fill, look for text inputs that might be near labels with "user id" text
    if (!userIdFilled) {
        const labels = elem.querySelectorAll('label');
        
        for (const label of Array.from(labels)) {
            const labelText = label.textContent?.toLowerCase().trim() || '';
            
            if (labelText.includes('user') || labelText.includes('id') || labelText.includes('email') || 
                labelText.includes('login') || labelText.includes('account')) {
                
                // Try to find the input this label is for
                let input: HTMLInputElement | null = null;
                
                if (label.htmlFor) {
                    // If the label has a "for" attribute
                    input = document.getElementById(label.htmlFor) as HTMLInputElement;
                } else {
                    // Or if the input is a child of the label
                    input = label.querySelector('input[type="text"], input[type="email"]') as HTMLInputElement;
                }
                
                if (input && !input.dataset.filled) {
                    simulateUserInput(input, "LOVE");
                    input.dataset.filled = "true";
                    console.debug(`Filled labeled input (${labelText}) with 'LOVE':`, input);
                    userIdFilled = true;
                    break;
                }
            }
        }
    }
    
    // Last resort: If we found a password field but no username/ID field, look for the first text input
    if (!userIdFilled && passwordInput) {
        const firstTextInput = elem.querySelector('input[type="text"]:not([data-filled])') as HTMLInputElement;
        if (firstTextInput) {
            simulateUserInput(firstTextInput, "LOVE");
            firstTextInput.dataset.filled = "true";
            console.debug("Filled first text input with 'LOVE':", firstTextInput);
        }
    }
}

// Function to simulate user input, ensuring frameworks (React, Vue) detect changes
function simulateUserInput(input: HTMLInputElement, value: string) {
    // Skip if input is disabled or readonly
    if (input.disabled || input.readOnly) return;
    
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, value); // Set input value programmatically
    } else {
        // Fallback if the setter is not available
        input.value = value;
    }

    // Dispatch multiple events for maximum compatibility with different frameworks
    const events = ['input', 'change', 'keydown', 'keyup'];
    
    events.forEach(eventType => {
        let event;
        if (eventType === 'keydown' || eventType === 'keyup') {
            // For key events, create a KeyboardEvent
            event = new KeyboardEvent(eventType, {
                bubbles: true,
                cancelable: true,
                key: 'L' // First letter of "LOVE"
            });
        } else {
            // For other events, use regular Event
            event = new Event(eventType, { bubbles: true });
        }
        input.dispatchEvent(event);
    });
    
    // Some frameworks might use focus/blur events as well
    input.focus();
    setTimeout(() => {
        input.blur();
    }, 100);
}

//Create confirmation popup
function showConfirmationPopup(form: HTMLElement, callback: (confirmed: boolean) => void) {
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
    
    // Password (masked)
    const passwordInfo = document.createElement('div');
    passwordInfo.style.fontSize = '14px';
    passwordInfo.innerHTML = `<strong>Password:</strong> ${'•'.repeat(Math.min(credentials.password.length, 8))}`;
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
                        document.body.removeChild(popup);
                        callback(true);
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
                        document.body.removeChild(popup);
                        callback(true);
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
                    document.body.removeChild(popup);
                    callback(false);
                }, 1500);
            }
        });
    });
    
    noButton.addEventListener('click', () => {
        document.body.removeChild(popup);
        callback(false);
    });
    
    // Add popup to page
    document.body.appendChild(popup);
}

// Function to collect credentials from the form
function collectCredentials(form: HTMLElement) {
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

// Function to check if all required form inputs are filled
function areAllRequiredInputsFilled(form: HTMLElement): boolean {
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    // If there are no required inputs, check visible inputs instead
    if (requiredInputs.length === 0) {
        const visibleInputs = Array.from(form.querySelectorAll('input, select, textarea')).filter(input => {
            // Cast the input to a union type
            const element = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   element.type !== 'hidden' && 
                   element.type !== 'submit' && 
                   element.type !== 'button';
        });
        
        return visibleInputs.every(element => {
            // Ensure the element is of the correct type
            if (isInputElement(element)) {
                return element.value.trim() !== '';
            }
            return false;
        });
    }
    
    // Check if all required inputs are filled
    return Array.from(requiredInputs).every(input => {
        // Cast the input to a union type
        const element = input as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (isInputElement(element)) {
            return element.value.trim() !== '';
        }
        return false;
    });
}

// Type guard to check if an element is HTMLInputElement, HTMLSelectElement, or HTMLTextAreaElement
function isInputElement(element: Element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
    return element instanceof HTMLInputElement || 
           element instanceof HTMLSelectElement || 
           element instanceof HTMLTextAreaElement;
}

// Function to set up submit handlers for signup forms
function setupSignupFormSubmitHandler(form: HTMLElement) {
    // Flag to prevent multiple event handlers
    if (form.dataset.submitHandlerAttached === 'true') {
        return;
    }
    form.dataset.submitHandlerAttached = 'true';
    
    // Find all submit buttons and add click handlers
    const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"], button:not([type]), [role="button"]');
    
    submitButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Only intercept if all required fields are filled
            if (areAllRequiredInputsFilled(form)) {
                // Prevent default form submission
                event.preventDefault();
                event.stopPropagation();
                
                // Show confirmation popup
                showConfirmationPopup(form,(confirmed) => {
                    if (confirmed) {
                        console.log("Password saved");
                    } else {
                        console.log("Password not saved");
                    }
                });
            }
        });
    });
    
    // For extra reliability, also attach to form submit event
    if (form.tagName === 'FORM') {
        form.addEventListener('submit', function(event) {
            // Only intercept if all required fields are filled
            if (areAllRequiredInputsFilled(form)) {
                // Prevent default form submission
                event.preventDefault();
                event.stopPropagation();
                
                // Show confirmation popup
                showConfirmationPopup(form, (confirmed) => {
                    if (confirmed) {
                        console.log("Password saved");
                    } else {
                        console.log("Password not saved");
                    }
                });
            }
        });
    }
}

// Function to detect and process forms in the DOM
function detectForm(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement;
        
        // Check if element is a form
        if (elem.tagName === 'FORM') {
            if (isLoginForm(elem)) {
                fillFormInputs(elem);
                logFormDetection("Login form");
            } else if (isSignupForm(elem)) {
                logFormDetection("Signup form");
                setupSignupFormSubmitHandler(elem);
            }
        } 
        // Also check for containers that might not use the form tag
        else if (elem.querySelector('input[type="password"]')) {
            if (isLoginForm(elem)) {
                fillFormInputs(elem);
                logFormDetection("Login container");
            } else if (isSignupForm(elem)) {
                logFormDetection("Signup container");
                setupSignupFormSubmitHandler(elem);
            }
        }
    }
}

// Debounce function to limit rapid execution of MutationObserver callbacks
function debounce(func: Function, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Create a MutationObserver to detect new forms dynamically added to the DOM
const observer = new MutationObserver(
    debounce((mutations: MutationRecord[]) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(detectForm); // Check newly added elements
            } else if (mutation.target.nodeType === Node.ELEMENT_NODE) {
                detectForm(mutation.target); // Check modified elements
            }
        });
    }, 100) // Debounce delay of 100ms to optimize performance
);

// Function to start observing DOM changes
function observe() {
    observer.observe(document, {
        attributes: true, // Watch for attribute changes that might reveal forms
        attributeFilter: ['class', 'style', 'hidden'], // Only watch relevant attributes
        characterData: false, // Ignore text changes
        childList: true, // Watch for added/removed nodes
        subtree: true, // Watch the entire DOM tree
    });

    // Process all potential forms when the script runs
    document.querySelectorAll("form").forEach(detectForm);
    
    // Also check for non-form containers
    document.querySelectorAll("div, section, main, fieldset").forEach(elem => {
        if (elem.querySelector('input[type="password"]')) {
            detectForm(elem);
        }
    });
}

// Start monitoring the DOM for forms
observe();