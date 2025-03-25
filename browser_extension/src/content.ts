import {showConfirmationPopup, showPasswordSuggestionPopup, showCredentialSelectionPopup} from './popup_utils';
import {retrieveSavedCredentials} from './credentials_utils';

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

// Updated function to handle login forms
function handleLoginForm(elem: HTMLElement) {
    logFormDetection("Login form");
    
    // Check if user is logged in by attempting to retrieve credentials
    retrieveSavedCredentials((credentials) => {
      if (credentials && credentials.length > 0) {
        // User is logged in and we have credentials - show selection popup
        showCredentialSelectionPopup(credentials, elem);
      }
      else{
        setupPasswordFieldListener(elem);
      }
    });
}

// Add password field click listener for signup forms
function setupPasswordFieldListener(form: HTMLElement) {
const passwordFields = form.querySelectorAll('input[type="password"]');

passwordFields.forEach((field) => {
    const inputField = field as HTMLInputElement;
    if (inputField.dataset.listenerAdded !== 'true') {
        inputField.addEventListener('click', () => {
        showPasswordSuggestionPopup(inputField);
        });
        inputField.dataset.listenerAdded = 'true';
    }
    });
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
          handleLoginForm(elem);
        } else if (isSignupForm(elem)) {
          logFormDetection("Signup form");
          setupSignupFormSubmitHandler(elem);
          setupPasswordFieldListener(elem);
        }
      } 
      // Also check for containers that might not use the form tag
      else if (elem.querySelector('input[type="password"]')) {
        if (isLoginForm(elem)) {
          handleLoginForm(elem);
        } else if (isSignupForm(elem)) {
          logFormDetection("Signup container");
          setupSignupFormSubmitHandler(elem);
          setupPasswordFieldListener(elem);
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