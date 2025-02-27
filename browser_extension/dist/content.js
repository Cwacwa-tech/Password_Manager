/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/

// Function to log form detection
function logFormDetection(formType) {
    console.log(`${formType} form detected!!!`);
}
// Function to check if an element is a login form with improved accuracy
function isLoginForm(elem) {
    var _a, _b, _c, _d, _e, _f;
    // Check for password field - essential for login forms
    const hasPassword = elem.querySelector('input[type="password"], input[name*="pass"], input[id*="pass"]');
    if (!hasPassword)
        return false;
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
        var _a;
        const labelText = ((_a = label.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || '';
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
        var _a, _b, _c, _d;
        const buttonText = ((_a = button.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || '';
        const buttonValue = ((_b = button.value) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) || '';
        const buttonId = ((_c = button.id) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
        const buttonClass = ((_d = button.className) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
        return loginButtonTexts.some(text => buttonText.includes(text) ||
            buttonValue.includes(text) ||
            buttonId.includes(text) ||
            buttonClass.includes(text));
    });
    // Check if this is actually a signup form (to exclude it)
    const isSignupForm = buttons.some((button) => {
        var _a, _b;
        const buttonText = ((_a = button.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || '';
        const buttonValue = ((_b = button.value) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) || '';
        return signupButtonTexts.some(text => buttonText.includes(text) || buttonValue.includes(text));
    });
    // Check for signup-related fields
    const hasSignupFields = elem.querySelector('input[name*="confirm" i]') !== null || // Confirm password
        elem.querySelector('input[placeholder*="confirm" i]') !== null ||
        elem.querySelector('input[name*="signup" i]') !== null ||
        elem.querySelector('input[name*="sign-up" i]') !== null;
    // Check for search-related attributes to exclude search bars
    const isSearchForm = elem.getAttribute('role') === 'search' ||
        ((_a = elem.id) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('search')) ||
        ((_b = elem.className) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('search')) ||
        elem.querySelector('input[type="search"]') !== null ||
        elem.querySelector('input[name*="search" i]') !== null ||
        elem.querySelector('input[placeholder*="search" i]') !== null;
    // Additional check for form action or ID that contains login-related terms
    const formAction = ((_c = elem.getAttribute('action')) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
    const formId = ((_d = elem.id) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
    const formClass = ((_e = elem.className) === null || _e === void 0 ? void 0 : _e.toLowerCase()) || '';
    const formMethod = ((_f = elem.getAttribute('method')) === null || _f === void 0 ? void 0 : _f.toLowerCase()) || '';
    const hasLoginIdentifier = formAction.includes('login') ||
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
        var _a;
        const headingText = ((_a = heading.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || '';
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
function isSignupForm(elem) {
    var _a, _b, _c, _d, _e;
    // Check for password field - essential for signup forms
    const hasPassword = elem.querySelector('input[type="password"], input[name*="pass"], input[id*="pass"]');
    if (!hasPassword)
        return false;
    // Check for signup-specific buttons or text
    const signupButtonTexts = ["sign up", "signup", "register", "create account", "join now", "get started", "create"];
    // Find all buttons and submit inputs
    const buttons = Array.from(elem.querySelectorAll('button, input[type="submit"], a.btn, a[role="button"]'));
    // Check if there are signup buttons
    const hasSignupButton = buttons.some((button) => {
        var _a, _b, _c, _d;
        const buttonText = ((_a = button.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || '';
        const buttonValue = ((_b = button.value) === null || _b === void 0 ? void 0 : _b.toLowerCase().trim()) || '';
        const buttonId = ((_c = button.id) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
        const buttonClass = ((_d = button.className) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
        return signupButtonTexts.some(text => buttonText.includes(text) ||
            buttonValue.includes(text) ||
            buttonId.includes(text) ||
            buttonClass.includes(text));
    });
    // Check for signup-related fields
    const hasSignupFields = elem.querySelector('input[name*="confirm" i]') !== null || // Confirm password
        elem.querySelector('input[placeholder*="confirm" i]') !== null ||
        elem.querySelector('input[name*="signup" i]') !== null ||
        elem.querySelector('input[name*="sign-up" i]') !== null ||
        elem.querySelector('input[name*="register" i]') !== null;
    // Check for search-related attributes to exclude search bars
    const isSearchForm = elem.getAttribute('role') === 'search' ||
        ((_a = elem.id) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('search')) ||
        ((_b = elem.className) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('search')) ||
        elem.querySelector('input[type="search"]') !== null ||
        elem.querySelector('input[name*="search" i]') !== null ||
        elem.querySelector('input[placeholder*="search" i]') !== null;
    // Additional check for form action or ID that contains signup-related terms
    const formAction = ((_c = elem.getAttribute('action')) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
    const formId = ((_d = elem.id) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
    const formClass = ((_e = elem.className) === null || _e === void 0 ? void 0 : _e.toLowerCase()) || '';
    const hasSignupIdentifier = formAction.includes('signup') ||
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
        var _a;
        const headingText = ((_a = heading.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim()) || '';
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
function fillFormInputs(elem) {
    var _a, _b, _c, _d;
    // Fill password field
    const passwordInput = elem.querySelector('input[type="password"]');
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
        for (const input of Array.from(inputs)) {
            // Skip inputs that are already filled or are likely search or hidden fields
            if (input.dataset.filled ||
                input.type === 'hidden' ||
                ((_a = input.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('search')) ||
                ((_b = input.id) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('search')) ||
                ((_c = input.placeholder) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes('search'))) {
                continue;
            }
            // Fill the field
            simulateUserInput(input, "LOVE");
            input.dataset.filled = "true";
            console.debug(`Filled ${input.name || input.id || 'user identifier'} input with 'LOVE':`, input);
            userIdFilled = true;
            break;
        }
        if (userIdFilled)
            break;
    }
    // If we still haven't found a field to fill, look for text inputs that might be near labels with "user id" text
    if (!userIdFilled) {
        const labels = elem.querySelectorAll('label');
        for (const label of Array.from(labels)) {
            const labelText = ((_d = label.textContent) === null || _d === void 0 ? void 0 : _d.toLowerCase().trim()) || '';
            if (labelText.includes('user') || labelText.includes('id') || labelText.includes('email') ||
                labelText.includes('login') || labelText.includes('account')) {
                // Try to find the input this label is for
                let input = null;
                if (label.htmlFor) {
                    // If the label has a "for" attribute
                    input = document.getElementById(label.htmlFor);
                }
                else {
                    // Or if the input is a child of the label
                    input = label.querySelector('input[type="text"], input[type="email"]');
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
        const firstTextInput = elem.querySelector('input[type="text"]:not([data-filled])');
        if (firstTextInput) {
            simulateUserInput(firstTextInput, "LOVE");
            firstTextInput.dataset.filled = "true";
            console.debug("Filled first text input with 'LOVE':", firstTextInput);
        }
    }
}
// Function to simulate user input, ensuring frameworks (React, Vue) detect changes
function simulateUserInput(input, value) {
    var _a;
    // Skip if input is disabled or readonly
    if (input.disabled || input.readOnly)
        return;
    const nativeInputValueSetter = (_a = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")) === null || _a === void 0 ? void 0 : _a.set;
    if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, value); // Set input value programmatically
    }
    else {
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
        }
        else {
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
// NEW FUNCTION: Create confirmation popup
function showConfirmationPopup(callback) {
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
    // Create message
    const message = document.createElement('p');
    message.textContent = 'Save Credentials?';
    message.style.marginBottom = '20px';
    message.style.fontSize = '16px';
    popup.appendChild(message);
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    popup.appendChild(buttonContainer);
    // Create Yes button
    const yesButton = document.createElement('button');
    yesButton.textContent = 'Yes';
    yesButton.style.padding = '8px 16px';
    yesButton.style.backgroundColor = '#4CAF50';
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '4px';
    yesButton.style.color = 'white';
    yesButton.style.cursor = 'pointer';
    buttonContainer.appendChild(yesButton);
    // Create No button
    const noButton = document.createElement('button');
    noButton.textContent = 'No';
    noButton.style.padding = '8px 16px';
    noButton.style.backgroundColor = '#f44336';
    noButton.style.border = 'none';
    noButton.style.borderRadius = '4px';
    noButton.style.color = 'white';
    noButton.style.cursor = 'pointer';
    buttonContainer.appendChild(noButton);
    // Add event listeners to buttons
    yesButton.addEventListener('click', () => {
        document.body.removeChild(popup);
        callback(true);
    });
    noButton.addEventListener('click', () => {
        document.body.removeChild(popup);
        callback(false);
    });
    // Add popup to page
    document.body.appendChild(popup);
}
// Function to check if all required form inputs are filled
function areAllRequiredInputsFilled(form) {
    const requiredInputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    // If there are no required inputs, check visible inputs instead
    if (requiredInputs.length === 0) {
        const visibleInputs = Array.from(form.querySelectorAll('input, select, textarea')).filter(input => {
            // Cast the input to a union type
            const element = input;
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
        const element = input;
        if (isInputElement(element)) {
            return element.value.trim() !== '';
        }
        return false;
    });
}
// Type guard to check if an element is HTMLInputElement, HTMLSelectElement, or HTMLTextAreaElement
function isInputElement(element) {
    return element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement;
}
// Function to set up submit handlers for signup forms
function setupSignupFormSubmitHandler(form) {
    // Flag to prevent multiple event handlers
    if (form.dataset.submitHandlerAttached === 'true') {
        return;
    }
    form.dataset.submitHandlerAttached = 'true';
    // Find all submit buttons and add click handlers
    const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"], button:not([type]), [role="button"]');
    submitButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            // Only intercept if all required fields are filled
            if (areAllRequiredInputsFilled(form)) {
                // Prevent default form submission
                event.preventDefault();
                event.stopPropagation();
                // Show confirmation popup
                showConfirmationPopup((confirmed) => {
                    if (confirmed) {
                        console.log("Password saved");
                    }
                    else {
                        console.log("Password not saved");
                    }
                });
            }
        });
    });
    // For extra reliability, also attach to form submit event
    if (form.tagName === 'FORM') {
        form.addEventListener('submit', function (event) {
            // Only intercept if all required fields are filled
            if (areAllRequiredInputsFilled(form)) {
                // Prevent default form submission
                event.preventDefault();
                event.stopPropagation();
                // Show confirmation popup
                showConfirmationPopup((confirmed) => {
                    if (confirmed) {
                        console.log("Password saved");
                    }
                    else {
                        console.log("Password not saved");
                    }
                });
            }
        });
    }
}
// Function to detect and process forms in the DOM
function detectForm(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node;
        // Check if element is a form
        if (elem.tagName === 'FORM') {
            if (isLoginForm(elem)) {
                fillFormInputs(elem);
                logFormDetection("Login form");
            }
            else if (isSignupForm(elem)) {
                logFormDetection("Signup form");
                setupSignupFormSubmitHandler(elem);
            }
        }
        // Also check for containers that might not use the form tag
        else if (elem.querySelector('input[type="password"]')) {
            if (isLoginForm(elem)) {
                fillFormInputs(elem);
                logFormDetection("Login container");
            }
            else if (isSignupForm(elem)) {
                logFormDetection("Signup container");
                setupSignupFormSubmitHandler(elem);
            }
        }
    }
}
// Debounce function to limit rapid execution of MutationObserver callbacks
function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}
// Create a MutationObserver to detect new forms dynamically added to the DOM
const observer = new MutationObserver(debounce((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(detectForm); // Check newly added elements
        }
        else if (mutation.target.nodeType === Node.ELEMENT_NODE) {
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpQ0FBaUM7QUFDakMsU0FBUyxnQkFBZ0IsQ0FBQyxRQUFnQjtJQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCx5RUFBeUU7QUFDekUsU0FBUyxXQUFXLENBQUMsSUFBaUI7O0lBQ2xDLHVEQUF1RDtJQUN2RCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGdFQUFnRSxDQUFDLENBQUM7SUFDekcsSUFBSSxDQUFDLFdBQVc7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUUvQix3RUFBd0U7SUFDeEUsTUFBTSx1QkFBdUIsR0FBRztRQUM1QixxQkFBcUI7UUFDckIsb0NBQW9DLEVBQUUscUJBQXFCLEVBQUUsOEJBQThCO1FBQzNGLG9CQUFvQjtRQUNwQixzQ0FBc0MsRUFBRSx1QkFBdUIsRUFBRSxnQ0FBZ0M7UUFDakcsdUNBQXVDLEVBQUUsd0JBQXdCLEVBQUUsaUNBQWlDO1FBQ3BHLHVDQUF1QyxFQUFFLHdCQUF3QixFQUFFLGlDQUFpQztRQUNwRyxrQ0FBa0MsRUFBRSxtQkFBbUIsRUFBRSw0QkFBNEI7UUFDckYsb0JBQW9CO1FBQ3BCLHVDQUF1QyxFQUFFLHdCQUF3QixFQUFFLGlDQUFpQztRQUNwRyxrQkFBa0I7UUFDbEIscUNBQXFDLEVBQUUsc0JBQXNCLEVBQUUsK0JBQStCO1FBQzlGLGtCQUFrQjtRQUNsQixxQkFBcUIsRUFBRSx3QkFBd0IsRUFBRSxzQkFBc0IsRUFBRSwrQkFBK0I7S0FDM0csQ0FBQztJQUVGLHNDQUFzQztJQUN0QyxNQUFNLGlCQUFpQixHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7SUFFMUcsc0RBQXNEO0lBQ3RELE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFOztRQUMzRSxNQUFNLFNBQVMsR0FBRyxZQUFLLENBQUMsV0FBVywwQ0FBRSxXQUFXLEdBQUcsSUFBSSxFQUFFLEtBQUksRUFBRSxDQUFDO1FBQ2hFLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDN0IsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDNUIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDN0IsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDN0IsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDeEIsU0FBUyxLQUFLLElBQUksQ0FBQztJQUM5QixDQUFDLENBQUMsQ0FBQztJQUVILHdGQUF3RjtJQUN4RixNQUFNLGdCQUFnQixHQUFHLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlHLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFekcscUNBQXFDO0lBQ3JDLE1BQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHVEQUF1RCxDQUFDLENBQUMsQ0FBQztJQUUzRyxtQ0FBbUM7SUFDbkMsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFOztRQUMzQyxNQUFNLFVBQVUsR0FBRyxhQUFNLENBQUMsV0FBVywwQ0FBRSxXQUFXLEdBQUcsSUFBSSxFQUFFLEtBQUksRUFBRSxDQUFDO1FBQ2xFLE1BQU0sV0FBVyxHQUFHLE9BQUMsTUFBMkIsQ0FBQyxLQUFLLDBDQUFFLFdBQVcsR0FBRyxJQUFJLEVBQUUsS0FBSSxFQUFFLENBQUM7UUFDbkYsTUFBTSxRQUFRLEdBQUcsYUFBTSxDQUFDLEVBQUUsMENBQUUsV0FBVyxFQUFFLEtBQUksRUFBRSxDQUFDO1FBQ2hELE1BQU0sV0FBVyxHQUFHLGFBQU0sQ0FBQyxTQUFTLDBDQUFFLFdBQVcsRUFBRSxLQUFJLEVBQUUsQ0FBQztRQUUxRCxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNoQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUN6QixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUMxQixRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUN2QixXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUM3QixDQUFDO0lBQ04sQ0FBQyxDQUFDLENBQUM7SUFFSCwwREFBMEQ7SUFDMUQsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFOztRQUN6QyxNQUFNLFVBQVUsR0FBRyxhQUFNLENBQUMsV0FBVywwQ0FBRSxXQUFXLEdBQUcsSUFBSSxFQUFFLEtBQUksRUFBRSxDQUFDO1FBQ2xFLE1BQU0sV0FBVyxHQUFHLE9BQUMsTUFBMkIsQ0FBQyxLQUFLLDBDQUFFLFdBQVcsR0FBRyxJQUFJLEVBQUUsS0FBSSxFQUFFLENBQUM7UUFDbkYsT0FBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRyxDQUFDLENBQUMsQ0FBQztJQUVILGtDQUFrQztJQUNsQyxNQUFNLGVBQWUsR0FDakIsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLElBQUksSUFBSSxtQkFBbUI7UUFDOUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQyxLQUFLLElBQUk7UUFDOUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLElBQUk7UUFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLElBQUksQ0FBQztJQUU1RCw2REFBNkQ7SUFDN0QsTUFBTSxZQUFZLEdBQ2QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRO1NBQ3RDLFVBQUksQ0FBQyxFQUFFLDBDQUFFLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1NBQ3pDLFVBQUksQ0FBQyxTQUFTLDBDQUFFLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsS0FBSyxJQUFJO1FBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsS0FBSyxJQUFJO1FBQ3RELElBQUksQ0FBQyxhQUFhLENBQUMsZ0NBQWdDLENBQUMsS0FBSyxJQUFJLENBQUM7SUFFbEUsMkVBQTJFO0lBQzNFLE1BQU0sVUFBVSxHQUFHLFdBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLDBDQUFFLFdBQVcsRUFBRSxLQUFJLEVBQUUsQ0FBQztJQUNwRSxNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsRUFBRSwwQ0FBRSxXQUFXLEVBQUUsS0FBSSxFQUFFLENBQUM7SUFDNUMsTUFBTSxTQUFTLEdBQUcsV0FBSSxDQUFDLFNBQVMsMENBQUUsV0FBVyxFQUFFLEtBQUksRUFBRSxDQUFDO0lBQ3RELE1BQU0sVUFBVSxHQUFHLFdBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLDBDQUFFLFdBQVcsRUFBRSxLQUFJLEVBQUUsQ0FBQztJQUVwRSxNQUFNLGtCQUFrQixHQUNwQixVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUM1QixVQUFVLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUM3QixVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUMzQixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUN4QixNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUN6QixNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUN2QixTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUMzQixTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUM1QixTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRS9CLDJEQUEyRDtJQUMzRCxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFOztRQUNyRyxNQUFNLFdBQVcsR0FBRyxjQUFPLENBQUMsV0FBVywwQ0FBRSxXQUFXLEdBQUcsSUFBSSxFQUFFLEtBQUksRUFBRSxDQUFDO1FBQ3BFLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDN0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDL0IsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDOUIsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUVILHFFQUFxRTtJQUNyRSxPQUFPLENBQUMsV0FBVztRQUNaLENBQUMsaUJBQWlCLElBQUksY0FBYyxJQUFJLGNBQWMsSUFBSSxrQkFBa0IsSUFBSSxhQUFhLENBQUM7UUFDOUYsQ0FBQyxZQUFZO1FBQ2IsQ0FBQyxlQUFlO1FBQ2hCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUVELHFEQUFxRDtBQUNyRCxTQUFTLFlBQVksQ0FBQyxJQUFpQjs7SUFDbkMsd0RBQXdEO0lBQ3hELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztJQUN6RyxJQUFJLENBQUMsV0FBVztRQUFFLE9BQU8sS0FBSyxDQUFDO0lBRS9CLDRDQUE0QztJQUM1QyxNQUFNLGlCQUFpQixHQUFHLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUVuSCxxQ0FBcUM7SUFDckMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsdURBQXVELENBQUMsQ0FBQyxDQUFDO0lBRTNHLG9DQUFvQztJQUNwQyxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7O1FBQzVDLE1BQU0sVUFBVSxHQUFHLGFBQU0sQ0FBQyxXQUFXLDBDQUFFLFdBQVcsR0FBRyxJQUFJLEVBQUUsS0FBSSxFQUFFLENBQUM7UUFDbEUsTUFBTSxXQUFXLEdBQUcsT0FBQyxNQUEyQixDQUFDLEtBQUssMENBQUUsV0FBVyxHQUFHLElBQUksRUFBRSxLQUFJLEVBQUUsQ0FBQztRQUNuRixNQUFNLFFBQVEsR0FBRyxhQUFNLENBQUMsRUFBRSwwQ0FBRSxXQUFXLEVBQUUsS0FBSSxFQUFFLENBQUM7UUFDaEQsTUFBTSxXQUFXLEdBQUcsYUFBTSxDQUFDLFNBQVMsMENBQUUsV0FBVyxFQUFFLEtBQUksRUFBRSxDQUFDO1FBRTFELE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ2pDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3pCLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQzFCLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQzdCLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztJQUVILGtDQUFrQztJQUNsQyxNQUFNLGVBQWUsR0FDakIsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLElBQUksSUFBSSxtQkFBbUI7UUFDOUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQ0FBaUMsQ0FBQyxLQUFLLElBQUk7UUFDOUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLElBQUk7UUFDdEQsSUFBSSxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLElBQUk7UUFDdkQsSUFBSSxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLElBQUksQ0FBQztJQUU3RCw2REFBNkQ7SUFDN0QsTUFBTSxZQUFZLEdBQ2QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxRQUFRO1NBQ3RDLFVBQUksQ0FBQyxFQUFFLDBDQUFFLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1NBQ3pDLFVBQUksQ0FBQyxTQUFTLDBDQUFFLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQUMsS0FBSyxJQUFJO1FBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsS0FBSyxJQUFJO1FBQ3RELElBQUksQ0FBQyxhQUFhLENBQUMsZ0NBQWdDLENBQUMsS0FBSyxJQUFJLENBQUM7SUFFbEUsNEVBQTRFO0lBQzVFLE1BQU0sVUFBVSxHQUFHLFdBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLDBDQUFFLFdBQVcsRUFBRSxLQUFJLEVBQUUsQ0FBQztJQUNwRSxNQUFNLE1BQU0sR0FBRyxXQUFJLENBQUMsRUFBRSwwQ0FBRSxXQUFXLEVBQUUsS0FBSSxFQUFFLENBQUM7SUFDNUMsTUFBTSxTQUFTLEdBQUcsV0FBSSxDQUFDLFNBQVMsMENBQUUsV0FBVyxFQUFFLEtBQUksRUFBRSxDQUFDO0lBRXRELE1BQU0sbUJBQW1CLEdBQ3JCLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQy9CLFVBQVUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1FBQzVCLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQzlCLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFakMsNERBQTREO0lBQzVELE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7O1FBQ3RHLE1BQU0sV0FBVyxHQUFHLGNBQU8sQ0FBQyxXQUFXLDBDQUFFLFdBQVcsR0FBRyxJQUFJLEVBQUUsS0FBSSxFQUFFLENBQUM7UUFDcEUsT0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUMvQixXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUM5QixXQUFXLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztZQUNoQyxXQUFXLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1lBQ3RDLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCx1REFBdUQ7SUFDdkQsT0FBTyxDQUFDLFdBQVc7UUFDWixDQUFDLGVBQWUsSUFBSSxlQUFlLElBQUksbUJBQW1CLElBQUksY0FBYyxDQUFDO1FBQzdFLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUVELGlEQUFpRDtBQUNqRCxTQUFTLGNBQWMsQ0FBQyxJQUFpQjs7SUFDckMsc0JBQXNCO0lBQ3RCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQXFCLENBQUM7SUFDdkYsSUFBSSxhQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2pELGlCQUFpQixDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsc0RBQXNEO0lBQ3RELE1BQU0sdUJBQXVCLEdBQUc7UUFDNUIscUJBQXFCO1FBQ3JCLG9DQUFvQyxFQUFFLHFCQUFxQixFQUFFLDhCQUE4QjtRQUMzRixvQkFBb0I7UUFDcEIsc0NBQXNDLEVBQUUsdUJBQXVCLEVBQUUsZ0NBQWdDO1FBQ2pHLHVDQUF1QyxFQUFFLHdCQUF3QixFQUFFLGlDQUFpQztRQUNwRyx1Q0FBdUMsRUFBRSx3QkFBd0IsRUFBRSxpQ0FBaUM7UUFDcEcsa0NBQWtDLEVBQUUsbUJBQW1CLEVBQUUsNEJBQTRCO1FBQ3JGLG9CQUFvQjtRQUNwQix1Q0FBdUMsRUFBRSx3QkFBd0IsRUFBRSxpQ0FBaUM7UUFDcEcsa0JBQWtCO1FBQ2xCLHFDQUFxQyxFQUFFLHNCQUFzQixFQUFFLCtCQUErQjtRQUM5RixrQkFBa0I7UUFDbEIscUJBQXFCLEVBQUUsd0JBQXdCLEVBQUUsc0JBQXNCLEVBQUUsK0JBQStCO1FBQ3hHLHFEQUFxRDtRQUNyRCxvQkFBb0I7S0FDdkIsQ0FBQztJQUVGLGtEQUFrRDtJQUNsRCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFFekIsS0FBSyxNQUFNLFFBQVEsSUFBSSx1QkFBdUIsRUFBRSxDQUFDO1FBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUvQyxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUF1QixFQUFFLENBQUM7WUFDM0QsNEVBQTRFO1lBQzVFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNO2dCQUNwQixLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVE7aUJBQ3ZCLFdBQUssQ0FBQyxJQUFJLDBDQUFFLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO2lCQUM1QyxXQUFLLENBQUMsRUFBRSwwQ0FBRSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztpQkFDMUMsV0FBSyxDQUFDLFdBQVcsMENBQUUsV0FBVyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRSxDQUFDO2dCQUN0RCxTQUFTO1lBQ2IsQ0FBQztZQUVELGlCQUFpQjtZQUNqQixpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDakMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQzlCLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxFQUFFLElBQUksaUJBQWlCLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pHLFlBQVksR0FBRyxJQUFJLENBQUM7WUFDcEIsTUFBTTtRQUNWLENBQUM7UUFFRCxJQUFJLFlBQVk7WUFBRSxNQUFNO0lBQzVCLENBQUM7SUFFRCxnSEFBZ0g7SUFDaEgsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUU5QyxLQUFLLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUNyQyxNQUFNLFNBQVMsR0FBRyxZQUFLLENBQUMsV0FBVywwQ0FBRSxXQUFXLEdBQUcsSUFBSSxFQUFFLEtBQUksRUFBRSxDQUFDO1lBRWhFLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUNyRixTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFFL0QsMENBQTBDO2dCQUMxQyxJQUFJLEtBQUssR0FBNEIsSUFBSSxDQUFDO2dCQUUxQyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDaEIscUNBQXFDO29CQUNyQyxLQUFLLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFxQixDQUFDO2dCQUN2RSxDQUFDO3FCQUFNLENBQUM7b0JBQ0osMENBQTBDO29CQUMxQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyx5Q0FBeUMsQ0FBcUIsQ0FBQztnQkFDL0YsQ0FBQztnQkFFRCxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ2pDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDakMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO29CQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixTQUFTLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN6RSxZQUFZLEdBQUcsSUFBSSxDQUFDO29CQUNwQixNQUFNO2dCQUNWLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztJQUNMLENBQUM7SUFFRCxvR0FBb0c7SUFDcEcsSUFBSSxDQUFDLFlBQVksSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNqQyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLHVDQUF1QyxDQUFxQixDQUFDO1FBQ3ZHLElBQUksY0FBYyxFQUFFLENBQUM7WUFDakIsaUJBQWlCLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUN2QyxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzFFLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUVELG1GQUFtRjtBQUNuRixTQUFTLGlCQUFpQixDQUFDLEtBQXVCLEVBQUUsS0FBYTs7SUFDN0Qsd0NBQXdDO0lBQ3hDLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsUUFBUTtRQUFFLE9BQU87SUFFN0MsTUFBTSxzQkFBc0IsR0FBRyxZQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsMENBQUUsR0FBRyxDQUFDO0lBQ2hILElBQUksc0JBQXNCLEVBQUUsQ0FBQztRQUN6QixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsbUNBQW1DO0lBQ2xGLENBQUM7U0FBTSxDQUFDO1FBQ0osMENBQTBDO1FBQzFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLENBQUM7SUFFRCwrRUFBK0U7SUFDL0UsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUV2RCxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ3ZCLElBQUksS0FBSyxDQUFDO1FBQ1YsSUFBSSxTQUFTLEtBQUssU0FBUyxJQUFJLFNBQVMsS0FBSyxPQUFPLEVBQUUsQ0FBQztZQUNuRCx5Q0FBeUM7WUFDekMsS0FBSyxHQUFHLElBQUksYUFBYSxDQUFDLFNBQVMsRUFBRTtnQkFDakMsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLEdBQUcsRUFBRSxHQUFHLENBQUMseUJBQXlCO2FBQ3JDLENBQUMsQ0FBQztRQUNQLENBQUM7YUFBTSxDQUFDO1lBQ0osc0NBQXNDO1lBQ3RDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBQ0QsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztJQUVILHNEQUFzRDtJQUN0RCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDZCxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ1osS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2pCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNaLENBQUM7QUFFRCwwQ0FBMEM7QUFDMUMsU0FBUyxxQkFBcUIsQ0FBQyxRQUFzQztJQUNqRSx5QkFBeUI7SUFDekIsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDL0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0lBQ3hCLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUN6QixLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztJQUNoRCxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7SUFDdEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzdCLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUNqQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyw2QkFBNkIsQ0FBQztJQUN0RCxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDNUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQzdCLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztJQUNyQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7SUFFbEMsaUJBQWlCO0lBQ2pCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxtQkFBbUIsQ0FBQztJQUMxQyxPQUFPLENBQUMsS0FBSyxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7SUFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO0lBQ2hDLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFM0IsMEJBQTBCO0lBQzFCLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEQsZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3ZDLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQztJQUNuQyxLQUFLLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRW5DLG9CQUFvQjtJQUNwQixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ25ELFNBQVMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzlCLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztJQUNyQyxTQUFTLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7SUFDNUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2hDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUNyQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7SUFDaEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0lBQ25DLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFdkMsbUJBQW1CO0lBQ25CLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbEQsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDNUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO0lBQ3BDLFFBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztJQUMzQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDL0IsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQ3BDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztJQUMvQixRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7SUFDbEMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUV0QyxpQ0FBaUM7SUFDakMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDckMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7UUFDcEMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBRUgsb0JBQW9CO0lBQ3BCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JDLENBQUM7QUFFRCwyREFBMkQ7QUFDM0QsU0FBUywwQkFBMEIsQ0FBQyxJQUFpQjtJQUNqRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsdURBQXVELENBQUMsQ0FBQztJQUV0RyxnRUFBZ0U7SUFDaEUsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQzlCLE1BQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDOUYsaUNBQWlDO1lBQ2pDLE1BQU0sT0FBTyxHQUFHLEtBQW1FLENBQUM7WUFDcEYsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLE9BQU8sS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNO2dCQUN4QixLQUFLLENBQUMsVUFBVSxLQUFLLFFBQVE7Z0JBQzdCLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFDekIsT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRO2dCQUN6QixPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyw0Q0FBNEM7WUFDNUMsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDMUIsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUN2QyxDQUFDO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsMENBQTBDO0lBQzFDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDNUMsaUNBQWlDO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLEtBQW1FLENBQUM7UUFDcEYsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUMxQixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ3ZDLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFFRCxtR0FBbUc7QUFDbkcsU0FBUyxjQUFjLENBQUMsT0FBZ0I7SUFDcEMsT0FBTyxPQUFPLFlBQVksZ0JBQWdCO1FBQ25DLE9BQU8sWUFBWSxpQkFBaUI7UUFDcEMsT0FBTyxZQUFZLG1CQUFtQixDQUFDO0FBQ2xELENBQUM7QUFFRCxzREFBc0Q7QUFDdEQsU0FBUyw0QkFBNEIsQ0FBQyxJQUFpQjtJQUNuRCwwQ0FBMEM7SUFDMUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixLQUFLLE1BQU0sRUFBRSxDQUFDO1FBQ2hELE9BQU87SUFDWCxDQUFDO0lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxNQUFNLENBQUM7SUFFNUMsaURBQWlEO0lBQ2pELE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrRkFBa0YsQ0FBQyxDQUFDO0lBRWhJLGFBQWEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDM0IsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFTLEtBQUs7WUFDM0MsbURBQW1EO1lBQ25ELElBQUksMEJBQTBCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDbkMsa0NBQWtDO2dCQUNsQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFFeEIsMEJBQTBCO2dCQUMxQixxQkFBcUIsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO29CQUNoQyxJQUFJLFNBQVMsRUFBRSxDQUFDO3dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDbEMsQ0FBQzt5QkFBTSxDQUFDO3dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztvQkFDdEMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsMERBQTBEO0lBQzFELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQVMsS0FBSztZQUMxQyxtREFBbUQ7WUFDbkQsSUFBSSwwQkFBMEIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNuQyxrQ0FBa0M7Z0JBQ2xDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUV4QiwwQkFBMEI7Z0JBQzFCLHFCQUFxQixDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7b0JBQ2hDLElBQUksU0FBUyxFQUFFLENBQUM7d0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO29CQUNsQyxDQUFDO3lCQUFNLENBQUM7d0JBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO29CQUN0QyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztBQUNMLENBQUM7QUFFRCxrREFBa0Q7QUFDbEQsU0FBUyxVQUFVLENBQUMsSUFBVTtJQUMxQixJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RDLE1BQU0sSUFBSSxHQUFHLElBQW1CLENBQUM7UUFFakMsNkJBQTZCO1FBQzdCLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxNQUFNLEVBQUUsQ0FBQztZQUMxQixJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUNwQixjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JCLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25DLENBQUM7aUJBQU0sSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDNUIsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2hDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7UUFDTCxDQUFDO1FBQ0QsNERBQTREO2FBQ3ZELElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLENBQUM7WUFDcEQsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDcEIsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQixnQkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3hDLENBQUM7aUJBQU0sSUFBSSxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDNUIsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDckMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsQ0FBQztRQUNMLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUVELDJFQUEyRTtBQUMzRSxTQUFTLFFBQVEsQ0FBQyxJQUFjLEVBQUUsS0FBYTtJQUMzQyxJQUFJLE9BQXNDLENBQUM7SUFDM0MsT0FBTyxDQUFDLEdBQUcsSUFBVyxFQUFFLEVBQUU7UUFDdEIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVELDZFQUE2RTtBQUM3RSxNQUFNLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixDQUNqQyxRQUFRLENBQUMsQ0FBQyxTQUEyQixFQUFFLEVBQUU7SUFDckMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzNCLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDakMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyw2QkFBNkI7UUFDMUUsQ0FBQzthQUFNLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3hELFVBQVUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQywwQkFBMEI7UUFDM0QsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLGtEQUFrRDtDQUM3RCxDQUFDO0FBRUYsMENBQTBDO0FBQzFDLFNBQVMsT0FBTztJQUNaLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ3ZCLFVBQVUsRUFBRSxJQUFJLEVBQUUsc0RBQXNEO1FBQ3hFLGVBQWUsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUUsaUNBQWlDO1FBQ2hGLGFBQWEsRUFBRSxLQUFLLEVBQUUsc0JBQXNCO1FBQzVDLFNBQVMsRUFBRSxJQUFJLEVBQUUsZ0NBQWdDO1FBQ2pELE9BQU8sRUFBRSxJQUFJLEVBQUUsNEJBQTRCO0tBQzlDLENBQUMsQ0FBQztJQUVILG1EQUFtRDtJQUNuRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXRELHFDQUFxQztJQUNyQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsOEJBQThCLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDckUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsQ0FBQztZQUMvQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVELHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Jyb3dzZXItZXh0ZW5zaW9uLy4vc3JjL2NvbnRlbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRnVuY3Rpb24gdG8gbG9nIGZvcm0gZGV0ZWN0aW9uXG5mdW5jdGlvbiBsb2dGb3JtRGV0ZWN0aW9uKGZvcm1UeXBlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhgJHtmb3JtVHlwZX0gZm9ybSBkZXRlY3RlZCEhIWApO1xufVxuXG4vLyBGdW5jdGlvbiB0byBjaGVjayBpZiBhbiBlbGVtZW50IGlzIGEgbG9naW4gZm9ybSB3aXRoIGltcHJvdmVkIGFjY3VyYWN5XG5mdW5jdGlvbiBpc0xvZ2luRm9ybShlbGVtOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIC8vIENoZWNrIGZvciBwYXNzd29yZCBmaWVsZCAtIGVzc2VudGlhbCBmb3IgbG9naW4gZm9ybXNcbiAgICBjb25zdCBoYXNQYXNzd29yZCA9IGVsZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdLCBpbnB1dFtuYW1lKj1cInBhc3NcIl0sIGlucHV0W2lkKj1cInBhc3NcIl0nKTtcbiAgICBpZiAoIWhhc1Bhc3N3b3JkKSByZXR1cm4gZmFsc2U7XG4gICAgXG4gICAgLy8gRXhwYW5kZWQgY2hlY2sgZm9yIHVzZXJuYW1lL3VzZXIgSUQvZW1haWwgZmllbGRzIHdpdGggbW9yZSB2YXJpYXRpb25zXG4gICAgY29uc3QgdXNlcklkZW50aWZpZXJTZWxlY3RvcnMgPSBbXG4gICAgICAgIC8vIFVzZXJuYW1lIHNlbGVjdG9yc1xuICAgICAgICAnaW5wdXRbdHlwZT1cInRleHRcIl1bbmFtZSo9XCJ1c2VyXCIgaV0nLCAnaW5wdXRbaWQqPVwidXNlclwiIGldJywgJ2lucHV0W3BsYWNlaG9sZGVyKj1cInVzZXJcIiBpXScsXG4gICAgICAgIC8vIFVzZXIgSUQgc2VsZWN0b3JzXG4gICAgICAgICdpbnB1dFt0eXBlPVwidGV4dFwiXVtuYW1lKj1cInVzZXJpZFwiIGldJywgJ2lucHV0W2lkKj1cInVzZXJpZFwiIGldJywgJ2lucHV0W3BsYWNlaG9sZGVyKj1cInVzZXJpZFwiIGldJyxcbiAgICAgICAgJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdW25hbWUqPVwidXNlcl9pZFwiIGldJywgJ2lucHV0W2lkKj1cInVzZXJfaWRcIiBpXScsICdpbnB1dFtwbGFjZWhvbGRlcio9XCJ1c2VyX2lkXCIgaV0nLFxuICAgICAgICAnaW5wdXRbdHlwZT1cInRleHRcIl1bbmFtZSo9XCJ1c2VyLWlkXCIgaV0nLCAnaW5wdXRbaWQqPVwidXNlci1pZFwiIGldJywgJ2lucHV0W3BsYWNlaG9sZGVyKj1cInVzZXItaWRcIiBpXScsXG4gICAgICAgICdpbnB1dFt0eXBlPVwidGV4dFwiXVtuYW1lKj1cImlkXCIgaV0nLCAnaW5wdXRbaWQqPVwiaWRcIiBpXScsICdpbnB1dFtwbGFjZWhvbGRlcio9XCJpZFwiIGldJyxcbiAgICAgICAgLy8gQWNjb3VudCBzZWxlY3RvcnNcbiAgICAgICAgJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdW25hbWUqPVwiYWNjb3VudFwiIGldJywgJ2lucHV0W2lkKj1cImFjY291bnRcIiBpXScsICdpbnB1dFtwbGFjZWhvbGRlcio9XCJhY2NvdW50XCIgaV0nLFxuICAgICAgICAvLyBMb2dpbiBzZWxlY3RvcnNcbiAgICAgICAgJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdW25hbWUqPVwibG9naW5cIiBpXScsICdpbnB1dFtpZCo9XCJsb2dpblwiIGldJywgJ2lucHV0W3BsYWNlaG9sZGVyKj1cImxvZ2luXCIgaV0nLFxuICAgICAgICAvLyBFbWFpbCBzZWxlY3RvcnNcbiAgICAgICAgJ2lucHV0W3R5cGU9XCJlbWFpbFwiXScsICdpbnB1dFtuYW1lKj1cImVtYWlsXCIgaV0nLCAnaW5wdXRbaWQqPVwiZW1haWxcIiBpXScsICdpbnB1dFtwbGFjZWhvbGRlcio9XCJlbWFpbFwiIGldJ1xuICAgIF07XG4gICAgXG4gICAgLy8gQ2hlY2sgZm9yIGFueSB1c2VyIGlkZW50aWZpZXIgZmllbGRcbiAgICBjb25zdCBoYXNVc2VySWRlbnRpZmllciA9IHVzZXJJZGVudGlmaWVyU2VsZWN0b3JzLnNvbWUoc2VsZWN0b3IgPT4gZWxlbS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKSAhPT0gbnVsbCk7XG4gICAgXG4gICAgLy8gQ2hlY2sgZm9yIGxhYmVscyB0aGF0IG1pZ2h0IGluZGljYXRlIHVzZXIgSUQgZmllbGRzXG4gICAgY29uc3QgaGFzVXNlcklkTGFiZWwgPSBBcnJheS5mcm9tKGVsZW0ucXVlcnlTZWxlY3RvckFsbCgnbGFiZWwnKSkuc29tZShsYWJlbCA9PiB7XG4gICAgICAgIGNvbnN0IGxhYmVsVGV4dCA9IGxhYmVsLnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpLnRyaW0oKSB8fCAnJztcbiAgICAgICAgcmV0dXJuIGxhYmVsVGV4dC5pbmNsdWRlcygndXNlciBpZCcpIHx8IFxuICAgICAgICAgICAgICAgbGFiZWxUZXh0LmluY2x1ZGVzKCd1c2VyaWQnKSB8fCBcbiAgICAgICAgICAgICAgIGxhYmVsVGV4dC5pbmNsdWRlcygndXNlci1pZCcpIHx8IFxuICAgICAgICAgICAgICAgbGFiZWxUZXh0LmluY2x1ZGVzKCd1c2VyX2lkJykgfHwgXG4gICAgICAgICAgICAgICBsYWJlbFRleHQuaW5jbHVkZXMoJ2lkJykgfHwgXG4gICAgICAgICAgICAgICBsYWJlbFRleHQgPT09ICdpZCc7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gQ2hlY2sgZm9yIGxvZ2luLXNwZWNpZmljIGJ1dHRvbnMgb3IgdGV4dCBpbmRpY2F0aW5nIHRoaXMgaXMgYSBsb2dpbiAobm90IHNpZ251cCkgZm9ybVxuICAgIGNvbnN0IGxvZ2luQnV0dG9uVGV4dHMgPSBbXCJsb2cgaW5cIiwgXCJzaWduIGluXCIsIFwibG9naW5cIiwgXCJzaWduaW5cIiwgXCJhdXRoZW50aWNhdGVcIiwgXCJjb250aW51ZVwiLCBcInN1Ym1pdFwiLCBcImdvXCJdO1xuICAgIGNvbnN0IHNpZ251cEJ1dHRvblRleHRzID0gW1wic2lnbiB1cFwiLCBcInNpZ251cFwiLCBcInJlZ2lzdGVyXCIsIFwiY3JlYXRlIGFjY291bnRcIiwgXCJqb2luIG5vd1wiLCBcImdldCBzdGFydGVkXCJdO1xuICAgIFxuICAgIC8vIEZpbmQgYWxsIGJ1dHRvbnMgYW5kIHN1Ym1pdCBpbnB1dHNcbiAgICBjb25zdCBidXR0b25zID0gQXJyYXkuZnJvbShlbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvbiwgaW5wdXRbdHlwZT1cInN1Ym1pdFwiXSwgYS5idG4sIGFbcm9sZT1cImJ1dHRvblwiXScpKTtcbiAgICBcbiAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgbG9naW4gYnV0dG9uc1xuICAgIGNvbnN0IGhhc0xvZ2luQnV0dG9uID0gYnV0dG9ucy5zb21lKChidXR0b24pID0+IHtcbiAgICAgICAgY29uc3QgYnV0dG9uVGV4dCA9IGJ1dHRvbi50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKS50cmltKCkgfHwgJyc7XG4gICAgICAgIGNvbnN0IGJ1dHRvblZhbHVlID0gKGJ1dHRvbiBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZT8udG9Mb3dlckNhc2UoKS50cmltKCkgfHwgJyc7XG4gICAgICAgIGNvbnN0IGJ1dHRvbklkID0gYnV0dG9uLmlkPy50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuICAgICAgICBjb25zdCBidXR0b25DbGFzcyA9IGJ1dHRvbi5jbGFzc05hbWU/LnRvTG93ZXJDYXNlKCkgfHwgJyc7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbG9naW5CdXR0b25UZXh0cy5zb21lKHRleHQgPT4gXG4gICAgICAgICAgICBidXR0b25UZXh0LmluY2x1ZGVzKHRleHQpIHx8IFxuICAgICAgICAgICAgYnV0dG9uVmFsdWUuaW5jbHVkZXModGV4dCkgfHwgXG4gICAgICAgICAgICBidXR0b25JZC5pbmNsdWRlcyh0ZXh0KSB8fCBcbiAgICAgICAgICAgIGJ1dHRvbkNsYXNzLmluY2x1ZGVzKHRleHQpXG4gICAgICAgICk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyBhY3R1YWxseSBhIHNpZ251cCBmb3JtICh0byBleGNsdWRlIGl0KVxuICAgIGNvbnN0IGlzU2lnbnVwRm9ybSA9IGJ1dHRvbnMuc29tZSgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ1dHRvblRleHQgPSBidXR0b24udGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkudHJpbSgpIHx8ICcnO1xuICAgICAgICBjb25zdCBidXR0b25WYWx1ZSA9IChidXR0b24gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU/LnRvTG93ZXJDYXNlKCkudHJpbSgpIHx8ICcnO1xuICAgICAgICByZXR1cm4gc2lnbnVwQnV0dG9uVGV4dHMuc29tZSh0ZXh0ID0+IGJ1dHRvblRleHQuaW5jbHVkZXModGV4dCkgfHwgYnV0dG9uVmFsdWUuaW5jbHVkZXModGV4dCkpO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIENoZWNrIGZvciBzaWdudXAtcmVsYXRlZCBmaWVsZHNcbiAgICBjb25zdCBoYXNTaWdudXBGaWVsZHMgPSBcbiAgICAgICAgZWxlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lKj1cImNvbmZpcm1cIiBpXScpICE9PSBudWxsIHx8IC8vIENvbmZpcm0gcGFzc3dvcmRcbiAgICAgICAgZWxlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtwbGFjZWhvbGRlcio9XCJjb25maXJtXCIgaV0nKSAhPT0gbnVsbCB8fFxuICAgICAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWUqPVwic2lnbnVwXCIgaV0nKSAhPT0gbnVsbCB8fFxuICAgICAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWUqPVwic2lnbi11cFwiIGldJykgIT09IG51bGw7XG4gICAgXG4gICAgLy8gQ2hlY2sgZm9yIHNlYXJjaC1yZWxhdGVkIGF0dHJpYnV0ZXMgdG8gZXhjbHVkZSBzZWFyY2ggYmFyc1xuICAgIGNvbnN0IGlzU2VhcmNoRm9ybSA9IFxuICAgICAgICBlbGVtLmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnc2VhcmNoJyB8fCBcbiAgICAgICAgZWxlbS5pZD8udG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnc2VhcmNoJykgfHwgXG4gICAgICAgIGVsZW0uY2xhc3NOYW1lPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdzZWFyY2gnKSB8fFxuICAgICAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJzZWFyY2hcIl0nKSAhPT0gbnVsbCB8fFxuICAgICAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWUqPVwic2VhcmNoXCIgaV0nKSAhPT0gbnVsbCB8fFxuICAgICAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3BsYWNlaG9sZGVyKj1cInNlYXJjaFwiIGldJykgIT09IG51bGw7XG4gICAgXG4gICAgLy8gQWRkaXRpb25hbCBjaGVjayBmb3IgZm9ybSBhY3Rpb24gb3IgSUQgdGhhdCBjb250YWlucyBsb2dpbi1yZWxhdGVkIHRlcm1zXG4gICAgY29uc3QgZm9ybUFjdGlvbiA9IGVsZW0uZ2V0QXR0cmlidXRlKCdhY3Rpb24nKT8udG9Mb3dlckNhc2UoKSB8fCAnJztcbiAgICBjb25zdCBmb3JtSWQgPSBlbGVtLmlkPy50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuICAgIGNvbnN0IGZvcm1DbGFzcyA9IGVsZW0uY2xhc3NOYW1lPy50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuICAgIGNvbnN0IGZvcm1NZXRob2QgPSBlbGVtLmdldEF0dHJpYnV0ZSgnbWV0aG9kJyk/LnRvTG93ZXJDYXNlKCkgfHwgJyc7XG4gICAgXG4gICAgY29uc3QgaGFzTG9naW5JZGVudGlmaWVyID0gXG4gICAgICAgIGZvcm1BY3Rpb24uaW5jbHVkZXMoJ2xvZ2luJykgfHwgXG4gICAgICAgIGZvcm1BY3Rpb24uaW5jbHVkZXMoJ3NpZ25pbicpIHx8IFxuICAgICAgICBmb3JtQWN0aW9uLmluY2x1ZGVzKCdhdXRoJykgfHxcbiAgICAgICAgZm9ybUlkLmluY2x1ZGVzKCdsb2dpbicpIHx8IFxuICAgICAgICBmb3JtSWQuaW5jbHVkZXMoJ3NpZ25pbicpIHx8XG4gICAgICAgIGZvcm1JZC5pbmNsdWRlcygnYXV0aCcpIHx8XG4gICAgICAgIGZvcm1DbGFzcy5pbmNsdWRlcygnbG9naW4nKSB8fFxuICAgICAgICBmb3JtQ2xhc3MuaW5jbHVkZXMoJ3NpZ25pbicpIHx8XG4gICAgICAgIGZvcm1DbGFzcy5pbmNsdWRlcygnYXV0aCcpO1xuICAgICAgICBcbiAgICAvLyBDaGVjayBpZiB0aGUgZm9ybSBoYXMgYSB0aXRsZSBvciBsZWdlbmQgaW5kaWNhdGluZyBsb2dpblxuICAgIGNvbnN0IGhhc0xvZ2luVGl0bGUgPSBBcnJheS5mcm9tKGVsZW0ucXVlcnlTZWxlY3RvckFsbCgnaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgbGVnZW5kJykpLnNvbWUoaGVhZGluZyA9PiB7XG4gICAgICAgIGNvbnN0IGhlYWRpbmdUZXh0ID0gaGVhZGluZy50ZXh0Q29udGVudD8udG9Mb3dlckNhc2UoKS50cmltKCkgfHwgJyc7XG4gICAgICAgIHJldHVybiBoZWFkaW5nVGV4dC5pbmNsdWRlcygnbG9naW4nKSB8fCBcbiAgICAgICAgICAgICAgIGhlYWRpbmdUZXh0LmluY2x1ZGVzKCdzaWduIGluJykgfHwgXG4gICAgICAgICAgICAgICBoZWFkaW5nVGV4dC5pbmNsdWRlcygnbG9nIGluJykgfHxcbiAgICAgICAgICAgICAgIGhlYWRpbmdUZXh0LmluY2x1ZGVzKCdhdXRoZW50aWNhdGUnKTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBJZiBpdCBoYXMgbG9naW4gaW5kaWNhdG9ycyBhbmQgaXMgbm90IGEgc2lnbnVwIGZvcm0gb3Igc2VhcmNoIGZvcm1cbiAgICByZXR1cm4gKGhhc1Bhc3N3b3JkICYmIFxuICAgICAgICAgICAoaGFzVXNlcklkZW50aWZpZXIgfHwgaGFzVXNlcklkTGFiZWwgfHwgaGFzTG9naW5CdXR0b24gfHwgaGFzTG9naW5JZGVudGlmaWVyIHx8IGhhc0xvZ2luVGl0bGUpICYmIFxuICAgICAgICAgICAhaXNTaWdudXBGb3JtICYmIFxuICAgICAgICAgICAhaGFzU2lnbnVwRmllbGRzICYmIFxuICAgICAgICAgICAhaXNTZWFyY2hGb3JtKTtcbn1cblxuLy8gTkVXIEZVTkNUSU9OOiBDaGVjayBpZiBhbiBlbGVtZW50IGlzIGEgc2lnbnVwIGZvcm1cbmZ1bmN0aW9uIGlzU2lnbnVwRm9ybShlbGVtOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIC8vIENoZWNrIGZvciBwYXNzd29yZCBmaWVsZCAtIGVzc2VudGlhbCBmb3Igc2lnbnVwIGZvcm1zXG4gICAgY29uc3QgaGFzUGFzc3dvcmQgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXSwgaW5wdXRbbmFtZSo9XCJwYXNzXCJdLCBpbnB1dFtpZCo9XCJwYXNzXCJdJyk7XG4gICAgaWYgKCFoYXNQYXNzd29yZCkgcmV0dXJuIGZhbHNlO1xuICAgIFxuICAgIC8vIENoZWNrIGZvciBzaWdudXAtc3BlY2lmaWMgYnV0dG9ucyBvciB0ZXh0XG4gICAgY29uc3Qgc2lnbnVwQnV0dG9uVGV4dHMgPSBbXCJzaWduIHVwXCIsIFwic2lnbnVwXCIsIFwicmVnaXN0ZXJcIiwgXCJjcmVhdGUgYWNjb3VudFwiLCBcImpvaW4gbm93XCIsIFwiZ2V0IHN0YXJ0ZWRcIiwgXCJjcmVhdGVcIl07XG4gICAgXG4gICAgLy8gRmluZCBhbGwgYnV0dG9ucyBhbmQgc3VibWl0IGlucHV0c1xuICAgIGNvbnN0IGJ1dHRvbnMgPSBBcnJheS5mcm9tKGVsZW0ucXVlcnlTZWxlY3RvckFsbCgnYnV0dG9uLCBpbnB1dFt0eXBlPVwic3VibWl0XCJdLCBhLmJ0biwgYVtyb2xlPVwiYnV0dG9uXCJdJykpO1xuICAgIFxuICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBzaWdudXAgYnV0dG9uc1xuICAgIGNvbnN0IGhhc1NpZ251cEJ1dHRvbiA9IGJ1dHRvbnMuc29tZSgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ1dHRvblRleHQgPSBidXR0b24udGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkudHJpbSgpIHx8ICcnO1xuICAgICAgICBjb25zdCBidXR0b25WYWx1ZSA9IChidXR0b24gYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU/LnRvTG93ZXJDYXNlKCkudHJpbSgpIHx8ICcnO1xuICAgICAgICBjb25zdCBidXR0b25JZCA9IGJ1dHRvbi5pZD8udG9Mb3dlckNhc2UoKSB8fCAnJztcbiAgICAgICAgY29uc3QgYnV0dG9uQ2xhc3MgPSBidXR0b24uY2xhc3NOYW1lPy50b0xvd2VyQ2FzZSgpIHx8ICcnO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHNpZ251cEJ1dHRvblRleHRzLnNvbWUodGV4dCA9PiBcbiAgICAgICAgICAgIGJ1dHRvblRleHQuaW5jbHVkZXModGV4dCkgfHwgXG4gICAgICAgICAgICBidXR0b25WYWx1ZS5pbmNsdWRlcyh0ZXh0KSB8fCBcbiAgICAgICAgICAgIGJ1dHRvbklkLmluY2x1ZGVzKHRleHQpIHx8IFxuICAgICAgICAgICAgYnV0dG9uQ2xhc3MuaW5jbHVkZXModGV4dClcbiAgICAgICAgKTtcbiAgICB9KTtcbiAgICBcbiAgICAvLyBDaGVjayBmb3Igc2lnbnVwLXJlbGF0ZWQgZmllbGRzXG4gICAgY29uc3QgaGFzU2lnbnVwRmllbGRzID0gXG4gICAgICAgIGVsZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZSo9XCJjb25maXJtXCIgaV0nKSAhPT0gbnVsbCB8fCAvLyBDb25maXJtIHBhc3N3b3JkXG4gICAgICAgIGVsZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbcGxhY2Vob2xkZXIqPVwiY29uZmlybVwiIGldJykgIT09IG51bGwgfHxcbiAgICAgICAgZWxlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lKj1cInNpZ251cFwiIGldJykgIT09IG51bGwgfHxcbiAgICAgICAgZWxlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dFtuYW1lKj1cInNpZ24tdXBcIiBpXScpICE9PSBudWxsIHx8XG4gICAgICAgIGVsZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbbmFtZSo9XCJyZWdpc3RlclwiIGldJykgIT09IG51bGw7XG4gICAgXG4gICAgLy8gQ2hlY2sgZm9yIHNlYXJjaC1yZWxhdGVkIGF0dHJpYnV0ZXMgdG8gZXhjbHVkZSBzZWFyY2ggYmFyc1xuICAgIGNvbnN0IGlzU2VhcmNoRm9ybSA9IFxuICAgICAgICBlbGVtLmdldEF0dHJpYnV0ZSgncm9sZScpID09PSAnc2VhcmNoJyB8fCBcbiAgICAgICAgZWxlbS5pZD8udG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnc2VhcmNoJykgfHwgXG4gICAgICAgIGVsZW0uY2xhc3NOYW1lPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdzZWFyY2gnKSB8fFxuICAgICAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJzZWFyY2hcIl0nKSAhPT0gbnVsbCB8fFxuICAgICAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W25hbWUqPVwic2VhcmNoXCIgaV0nKSAhPT0gbnVsbCB8fFxuICAgICAgICBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3BsYWNlaG9sZGVyKj1cInNlYXJjaFwiIGldJykgIT09IG51bGw7XG4gICAgXG4gICAgLy8gQWRkaXRpb25hbCBjaGVjayBmb3IgZm9ybSBhY3Rpb24gb3IgSUQgdGhhdCBjb250YWlucyBzaWdudXAtcmVsYXRlZCB0ZXJtc1xuICAgIGNvbnN0IGZvcm1BY3Rpb24gPSBlbGVtLmdldEF0dHJpYnV0ZSgnYWN0aW9uJyk/LnRvTG93ZXJDYXNlKCkgfHwgJyc7XG4gICAgY29uc3QgZm9ybUlkID0gZWxlbS5pZD8udG9Mb3dlckNhc2UoKSB8fCAnJztcbiAgICBjb25zdCBmb3JtQ2xhc3MgPSBlbGVtLmNsYXNzTmFtZT8udG9Mb3dlckNhc2UoKSB8fCAnJztcbiAgICBcbiAgICBjb25zdCBoYXNTaWdudXBJZGVudGlmaWVyID0gXG4gICAgICAgIGZvcm1BY3Rpb24uaW5jbHVkZXMoJ3NpZ251cCcpIHx8IFxuICAgICAgICBmb3JtQWN0aW9uLmluY2x1ZGVzKCdyZWdpc3RlcicpIHx8IFxuICAgICAgICBmb3JtQWN0aW9uLmluY2x1ZGVzKCdjcmVhdGUnKSB8fFxuICAgICAgICBmb3JtSWQuaW5jbHVkZXMoJ3NpZ251cCcpIHx8IFxuICAgICAgICBmb3JtSWQuaW5jbHVkZXMoJ3JlZ2lzdGVyJykgfHxcbiAgICAgICAgZm9ybUlkLmluY2x1ZGVzKCdjcmVhdGUnKSB8fFxuICAgICAgICBmb3JtQ2xhc3MuaW5jbHVkZXMoJ3NpZ251cCcpIHx8XG4gICAgICAgIGZvcm1DbGFzcy5pbmNsdWRlcygncmVnaXN0ZXInKSB8fFxuICAgICAgICBmb3JtQ2xhc3MuaW5jbHVkZXMoJ2NyZWF0ZScpO1xuICAgICAgICBcbiAgICAvLyBDaGVjayBpZiB0aGUgZm9ybSBoYXMgYSB0aXRsZSBvciBsZWdlbmQgaW5kaWNhdGluZyBzaWdudXBcbiAgICBjb25zdCBoYXNTaWdudXBUaXRsZSA9IEFycmF5LmZyb20oZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdoMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBsZWdlbmQnKSkuc29tZShoZWFkaW5nID0+IHtcbiAgICAgICAgY29uc3QgaGVhZGluZ1RleHQgPSBoZWFkaW5nLnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpLnRyaW0oKSB8fCAnJztcbiAgICAgICAgcmV0dXJuIGhlYWRpbmdUZXh0LmluY2x1ZGVzKCdzaWduIHVwJykgfHwgXG4gICAgICAgICAgICAgICBoZWFkaW5nVGV4dC5pbmNsdWRlcygnc2lnbnVwJykgfHwgXG4gICAgICAgICAgICAgICBoZWFkaW5nVGV4dC5pbmNsdWRlcygncmVnaXN0ZXInKSB8fFxuICAgICAgICAgICAgICAgaGVhZGluZ1RleHQuaW5jbHVkZXMoJ2NyZWF0ZSBhY2NvdW50JykgfHxcbiAgICAgICAgICAgICAgIGhlYWRpbmdUZXh0LmluY2x1ZGVzKCdqb2luJyk7XG4gICAgfSk7XG4gICAgXG4gICAgLy8gSWYgaXQgaGFzIHNpZ251cCBpbmRpY2F0b3JzIGFuZCBpcyBub3QgYSBzZWFyY2ggZm9ybVxuICAgIHJldHVybiAoaGFzUGFzc3dvcmQgJiYgXG4gICAgICAgICAgIChoYXNTaWdudXBCdXR0b24gfHwgaGFzU2lnbnVwRmllbGRzIHx8IGhhc1NpZ251cElkZW50aWZpZXIgfHwgaGFzU2lnbnVwVGl0bGUpICYmIFxuICAgICAgICAgICAhaXNTZWFyY2hGb3JtKTtcbn1cblxuLy8gRnVuY3Rpb24gdG8gZmlsbCBsb2dpbiBmb3JtIGlucHV0cyB3aXRoIFwiTE9WRVwiXG5mdW5jdGlvbiBmaWxsRm9ybUlucHV0cyhlbGVtOiBIVE1MRWxlbWVudCkge1xuICAgIC8vIEZpbGwgcGFzc3dvcmQgZmllbGRcbiAgICBjb25zdCBwYXNzd29yZElucHV0ID0gZWxlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGlmIChwYXNzd29yZElucHV0ICYmICFwYXNzd29yZElucHV0LmRhdGFzZXQuZmlsbGVkKSB7XG4gICAgICAgIHNpbXVsYXRlVXNlcklucHV0KHBhc3N3b3JkSW5wdXQsIFwiTE9WRVwiKTtcbiAgICAgICAgcGFzc3dvcmRJbnB1dC5kYXRhc2V0LmZpbGxlZCA9IFwidHJ1ZVwiO1xuICAgICAgICBjb25zb2xlLmRlYnVnKFwiRmlsbGVkIHBhc3N3b3JkIGlucHV0IHdpdGggJ0xPVkUnOlwiLCBwYXNzd29yZElucHV0KTtcbiAgICB9XG5cbiAgICAvLyBEZWZpbmUgYWxsIHRoZSBzZWxlY3RvcnMgZm9yIHVzZXIgaWRlbnRpZmllciBmaWVsZHNcbiAgICBjb25zdCB1c2VySWRlbnRpZmllclNlbGVjdG9ycyA9IFtcbiAgICAgICAgLy8gVXNlcm5hbWUgc2VsZWN0b3JzXG4gICAgICAgICdpbnB1dFt0eXBlPVwidGV4dFwiXVtuYW1lKj1cInVzZXJcIiBpXScsICdpbnB1dFtpZCo9XCJ1c2VyXCIgaV0nLCAnaW5wdXRbcGxhY2Vob2xkZXIqPVwidXNlclwiIGldJyxcbiAgICAgICAgLy8gVXNlciBJRCBzZWxlY3RvcnNcbiAgICAgICAgJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdW25hbWUqPVwidXNlcmlkXCIgaV0nLCAnaW5wdXRbaWQqPVwidXNlcmlkXCIgaV0nLCAnaW5wdXRbcGxhY2Vob2xkZXIqPVwidXNlcmlkXCIgaV0nLFxuICAgICAgICAnaW5wdXRbdHlwZT1cInRleHRcIl1bbmFtZSo9XCJ1c2VyX2lkXCIgaV0nLCAnaW5wdXRbaWQqPVwidXNlcl9pZFwiIGldJywgJ2lucHV0W3BsYWNlaG9sZGVyKj1cInVzZXJfaWRcIiBpXScsXG4gICAgICAgICdpbnB1dFt0eXBlPVwidGV4dFwiXVtuYW1lKj1cInVzZXItaWRcIiBpXScsICdpbnB1dFtpZCo9XCJ1c2VyLWlkXCIgaV0nLCAnaW5wdXRbcGxhY2Vob2xkZXIqPVwidXNlci1pZFwiIGldJyxcbiAgICAgICAgJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdW25hbWUqPVwiaWRcIiBpXScsICdpbnB1dFtpZCo9XCJpZFwiIGldJywgJ2lucHV0W3BsYWNlaG9sZGVyKj1cImlkXCIgaV0nLFxuICAgICAgICAvLyBBY2NvdW50IHNlbGVjdG9yc1xuICAgICAgICAnaW5wdXRbdHlwZT1cInRleHRcIl1bbmFtZSo9XCJhY2NvdW50XCIgaV0nLCAnaW5wdXRbaWQqPVwiYWNjb3VudFwiIGldJywgJ2lucHV0W3BsYWNlaG9sZGVyKj1cImFjY291bnRcIiBpXScsXG4gICAgICAgIC8vIExvZ2luIHNlbGVjdG9yc1xuICAgICAgICAnaW5wdXRbdHlwZT1cInRleHRcIl1bbmFtZSo9XCJsb2dpblwiIGldJywgJ2lucHV0W2lkKj1cImxvZ2luXCIgaV0nLCAnaW5wdXRbcGxhY2Vob2xkZXIqPVwibG9naW5cIiBpXScsXG4gICAgICAgIC8vIEVtYWlsIHNlbGVjdG9yc1xuICAgICAgICAnaW5wdXRbdHlwZT1cImVtYWlsXCJdJywgJ2lucHV0W25hbWUqPVwiZW1haWxcIiBpXScsICdpbnB1dFtpZCo9XCJlbWFpbFwiIGldJywgJ2lucHV0W3BsYWNlaG9sZGVyKj1cImVtYWlsXCIgaV0nLFxuICAgICAgICAvLyBHZW5lcmljIHRleHQgaW5wdXRzIHRoYXQgbWlnaHQgYmUgdXNlciBpZGVudGlmaWVyc1xuICAgICAgICAnaW5wdXRbdHlwZT1cInRleHRcIl0nXG4gICAgXTtcbiAgICBcbiAgICAvLyBUcnkgZWFjaCBzZWxlY3RvciB1bnRpbCB3ZSBmaW5kIGEgZmllbGQgdG8gZmlsbFxuICAgIGxldCB1c2VySWRGaWxsZWQgPSBmYWxzZTtcbiAgICBcbiAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHVzZXJJZGVudGlmaWVyU2VsZWN0b3JzKSB7XG4gICAgICAgIGNvbnN0IGlucHV0cyA9IGVsZW0ucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGlucHV0IG9mIEFycmF5LmZyb20oaW5wdXRzKSBhcyBIVE1MSW5wdXRFbGVtZW50W10pIHtcbiAgICAgICAgICAgIC8vIFNraXAgaW5wdXRzIHRoYXQgYXJlIGFscmVhZHkgZmlsbGVkIG9yIGFyZSBsaWtlbHkgc2VhcmNoIG9yIGhpZGRlbiBmaWVsZHNcbiAgICAgICAgICAgIGlmIChpbnB1dC5kYXRhc2V0LmZpbGxlZCB8fCBcbiAgICAgICAgICAgICAgICBpbnB1dC50eXBlID09PSAnaGlkZGVuJyB8fCBcbiAgICAgICAgICAgICAgICBpbnB1dC5uYW1lPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKCdzZWFyY2gnKSB8fCBcbiAgICAgICAgICAgICAgICBpbnB1dC5pZD8udG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnc2VhcmNoJykgfHxcbiAgICAgICAgICAgICAgICBpbnB1dC5wbGFjZWhvbGRlcj8udG9Mb3dlckNhc2UoKS5pbmNsdWRlcygnc2VhcmNoJykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gRmlsbCB0aGUgZmllbGRcbiAgICAgICAgICAgIHNpbXVsYXRlVXNlcklucHV0KGlucHV0LCBcIkxPVkVcIik7XG4gICAgICAgICAgICBpbnB1dC5kYXRhc2V0LmZpbGxlZCA9IFwidHJ1ZVwiO1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhgRmlsbGVkICR7aW5wdXQubmFtZSB8fCBpbnB1dC5pZCB8fCAndXNlciBpZGVudGlmaWVyJ30gaW5wdXQgd2l0aCAnTE9WRSc6YCwgaW5wdXQpO1xuICAgICAgICAgICAgdXNlcklkRmlsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodXNlcklkRmlsbGVkKSBicmVhaztcbiAgICB9XG4gICAgXG4gICAgLy8gSWYgd2Ugc3RpbGwgaGF2ZW4ndCBmb3VuZCBhIGZpZWxkIHRvIGZpbGwsIGxvb2sgZm9yIHRleHQgaW5wdXRzIHRoYXQgbWlnaHQgYmUgbmVhciBsYWJlbHMgd2l0aCBcInVzZXIgaWRcIiB0ZXh0XG4gICAgaWYgKCF1c2VySWRGaWxsZWQpIHtcbiAgICAgICAgY29uc3QgbGFiZWxzID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdsYWJlbCcpO1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBsYWJlbCBvZiBBcnJheS5mcm9tKGxhYmVscykpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhYmVsVGV4dCA9IGxhYmVsLnRleHRDb250ZW50Py50b0xvd2VyQ2FzZSgpLnRyaW0oKSB8fCAnJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGxhYmVsVGV4dC5pbmNsdWRlcygndXNlcicpIHx8IGxhYmVsVGV4dC5pbmNsdWRlcygnaWQnKSB8fCBsYWJlbFRleHQuaW5jbHVkZXMoJ2VtYWlsJykgfHwgXG4gICAgICAgICAgICAgICAgbGFiZWxUZXh0LmluY2x1ZGVzKCdsb2dpbicpIHx8IGxhYmVsVGV4dC5pbmNsdWRlcygnYWNjb3VudCcpKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgdGhlIGlucHV0IHRoaXMgbGFiZWwgaXMgZm9yXG4gICAgICAgICAgICAgICAgbGV0IGlucHV0OiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsLmh0bWxGb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIGxhYmVsIGhhcyBhIFwiZm9yXCIgYXR0cmlidXRlXG4gICAgICAgICAgICAgICAgICAgIGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobGFiZWwuaHRtbEZvcikgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBPciBpZiB0aGUgaW5wdXQgaXMgYSBjaGlsZCBvZiB0aGUgbGFiZWxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQgPSBsYWJlbC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwidGV4dFwiXSwgaW5wdXRbdHlwZT1cImVtYWlsXCJdJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGlucHV0ICYmICFpbnB1dC5kYXRhc2V0LmZpbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICBzaW11bGF0ZVVzZXJJbnB1dChpbnB1dCwgXCJMT1ZFXCIpO1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5kYXRhc2V0LmZpbGxlZCA9IFwidHJ1ZVwiO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKGBGaWxsZWQgbGFiZWxlZCBpbnB1dCAoJHtsYWJlbFRleHR9KSB3aXRoICdMT1ZFJzpgLCBpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJJZEZpbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBMYXN0IHJlc29ydDogSWYgd2UgZm91bmQgYSBwYXNzd29yZCBmaWVsZCBidXQgbm8gdXNlcm5hbWUvSUQgZmllbGQsIGxvb2sgZm9yIHRoZSBmaXJzdCB0ZXh0IGlucHV0XG4gICAgaWYgKCF1c2VySWRGaWxsZWQgJiYgcGFzc3dvcmRJbnB1dCkge1xuICAgICAgICBjb25zdCBmaXJzdFRleHRJbnB1dCA9IGVsZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInRleHRcIl06bm90KFtkYXRhLWZpbGxlZF0pJykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgaWYgKGZpcnN0VGV4dElucHV0KSB7XG4gICAgICAgICAgICBzaW11bGF0ZVVzZXJJbnB1dChmaXJzdFRleHRJbnB1dCwgXCJMT1ZFXCIpO1xuICAgICAgICAgICAgZmlyc3RUZXh0SW5wdXQuZGF0YXNldC5maWxsZWQgPSBcInRydWVcIjtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJGaWxsZWQgZmlyc3QgdGV4dCBpbnB1dCB3aXRoICdMT1ZFJzpcIiwgZmlyc3RUZXh0SW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBGdW5jdGlvbiB0byBzaW11bGF0ZSB1c2VyIGlucHV0LCBlbnN1cmluZyBmcmFtZXdvcmtzIChSZWFjdCwgVnVlKSBkZXRlY3QgY2hhbmdlc1xuZnVuY3Rpb24gc2ltdWxhdGVVc2VySW5wdXQoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICAvLyBTa2lwIGlmIGlucHV0IGlzIGRpc2FibGVkIG9yIHJlYWRvbmx5XG4gICAgaWYgKGlucHV0LmRpc2FibGVkIHx8IGlucHV0LnJlYWRPbmx5KSByZXR1cm47XG4gICAgXG4gICAgY29uc3QgbmF0aXZlSW5wdXRWYWx1ZVNldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93LkhUTUxJbnB1dEVsZW1lbnQucHJvdG90eXBlLCBcInZhbHVlXCIpPy5zZXQ7XG4gICAgaWYgKG5hdGl2ZUlucHV0VmFsdWVTZXR0ZXIpIHtcbiAgICAgICAgbmF0aXZlSW5wdXRWYWx1ZVNldHRlci5jYWxsKGlucHV0LCB2YWx1ZSk7IC8vIFNldCBpbnB1dCB2YWx1ZSBwcm9ncmFtbWF0aWNhbGx5XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRmFsbGJhY2sgaWYgdGhlIHNldHRlciBpcyBub3QgYXZhaWxhYmxlXG4gICAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gRGlzcGF0Y2ggbXVsdGlwbGUgZXZlbnRzIGZvciBtYXhpbXVtIGNvbXBhdGliaWxpdHkgd2l0aCBkaWZmZXJlbnQgZnJhbWV3b3Jrc1xuICAgIGNvbnN0IGV2ZW50cyA9IFsnaW5wdXQnLCAnY2hhbmdlJywgJ2tleWRvd24nLCAna2V5dXAnXTtcbiAgICBcbiAgICBldmVudHMuZm9yRWFjaChldmVudFR5cGUgPT4ge1xuICAgICAgICBsZXQgZXZlbnQ7XG4gICAgICAgIGlmIChldmVudFR5cGUgPT09ICdrZXlkb3duJyB8fCBldmVudFR5cGUgPT09ICdrZXl1cCcpIHtcbiAgICAgICAgICAgIC8vIEZvciBrZXkgZXZlbnRzLCBjcmVhdGUgYSBLZXlib2FyZEV2ZW50XG4gICAgICAgICAgICBldmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KGV2ZW50VHlwZSwge1xuICAgICAgICAgICAgICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBrZXk6ICdMJyAvLyBGaXJzdCBsZXR0ZXIgb2YgXCJMT1ZFXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gRm9yIG90aGVyIGV2ZW50cywgdXNlIHJlZ3VsYXIgRXZlbnRcbiAgICAgICAgICAgIGV2ZW50ID0gbmV3IEV2ZW50KGV2ZW50VHlwZSwgeyBidWJibGVzOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIFNvbWUgZnJhbWV3b3JrcyBtaWdodCB1c2UgZm9jdXMvYmx1ciBldmVudHMgYXMgd2VsbFxuICAgIGlucHV0LmZvY3VzKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlucHV0LmJsdXIoKTtcbiAgICB9LCAxMDApO1xufVxuXG4vLyBORVcgRlVOQ1RJT046IENyZWF0ZSBjb25maXJtYXRpb24gcG9wdXBcbmZ1bmN0aW9uIHNob3dDb25maXJtYXRpb25Qb3B1cChjYWxsYmFjazogKGNvbmZpcm1lZDogYm9vbGVhbikgPT4gdm9pZCkge1xuICAgIC8vIENyZWF0ZSBwb3B1cCBjb250YWluZXJcbiAgICBjb25zdCBwb3B1cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBvcHVwLnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgICBwb3B1cC5zdHlsZS50b3AgPSAnNTAlJztcbiAgICBwb3B1cC5zdHlsZS5sZWZ0ID0gJzUwJSc7XG4gICAgcG9wdXAuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XG4gICAgcG9wdXAuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgICBwb3B1cC5zdHlsZS5wYWRkaW5nID0gJzIwcHgnO1xuICAgIHBvcHVwLnN0eWxlLmJvcmRlclJhZGl1cyA9ICc1cHgnO1xuICAgIHBvcHVwLnN0eWxlLmJveFNoYWRvdyA9ICcwIDAgMTBweCByZ2JhKDAsIDAsIDAsIDAuMyknO1xuICAgIHBvcHVwLnN0eWxlLnpJbmRleCA9ICc5OTk5JztcbiAgICBwb3B1cC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xuICAgIHBvcHVwLnN0eWxlLmZsZXhEaXJlY3Rpb24gPSAnY29sdW1uJztcbiAgICBwb3B1cC5zdHlsZS5hbGlnbkl0ZW1zID0gJ2NlbnRlcic7XG4gICAgXG4gICAgLy8gQ3JlYXRlIG1lc3NhZ2VcbiAgICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSAnU2F2ZSBDcmVkZW50aWFscz8nO1xuICAgIG1lc3NhZ2Uuc3R5bGUubWFyZ2luQm90dG9tID0gJzIwcHgnO1xuICAgIG1lc3NhZ2Uuc3R5bGUuZm9udFNpemUgPSAnMTZweCc7XG4gICAgcG9wdXAuYXBwZW5kQ2hpbGQobWVzc2FnZSk7XG4gICAgXG4gICAgLy8gQ3JlYXRlIGJ1dHRvbiBjb250YWluZXJcbiAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidXR0b25Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBidXR0b25Db250YWluZXIuc3R5bGUuZ2FwID0gJzEwcHgnO1xuICAgIHBvcHVwLmFwcGVuZENoaWxkKGJ1dHRvbkNvbnRhaW5lcik7XG4gICAgXG4gICAgLy8gQ3JlYXRlIFllcyBidXR0b25cbiAgICBjb25zdCB5ZXNCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICB5ZXNCdXR0b24udGV4dENvbnRlbnQgPSAnWWVzJztcbiAgICB5ZXNCdXR0b24uc3R5bGUucGFkZGluZyA9ICc4cHggMTZweCc7XG4gICAgeWVzQnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjNENBRjUwJztcbiAgICB5ZXNCdXR0b24uc3R5bGUuYm9yZGVyID0gJ25vbmUnO1xuICAgIHllc0J1dHRvbi5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnNHB4JztcbiAgICB5ZXNCdXR0b24uc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgIHllc0J1dHRvbi5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKHllc0J1dHRvbik7XG4gICAgXG4gICAgLy8gQ3JlYXRlIE5vIGJ1dHRvblxuICAgIGNvbnN0IG5vQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgbm9CdXR0b24udGV4dENvbnRlbnQgPSAnTm8nO1xuICAgIG5vQnV0dG9uLnN0eWxlLnBhZGRpbmcgPSAnOHB4IDE2cHgnO1xuICAgIG5vQnV0dG9uLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZjQ0MzM2JztcbiAgICBub0J1dHRvbi5zdHlsZS5ib3JkZXIgPSAnbm9uZSc7XG4gICAgbm9CdXR0b24uc3R5bGUuYm9yZGVyUmFkaXVzID0gJzRweCc7XG4gICAgbm9CdXR0b24uc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xuICAgIG5vQnV0dG9uLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJztcbiAgICBidXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQobm9CdXR0b24pO1xuICAgIFxuICAgIC8vIEFkZCBldmVudCBsaXN0ZW5lcnMgdG8gYnV0dG9uc1xuICAgIHllc0J1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChwb3B1cCk7XG4gICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgIH0pO1xuICAgIFxuICAgIG5vQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHBvcHVwKTtcbiAgICAgICAgY2FsbGJhY2soZmFsc2UpO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIEFkZCBwb3B1cCB0byBwYWdlXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwb3B1cCk7XG59XG5cbi8vIEZ1bmN0aW9uIHRvIGNoZWNrIGlmIGFsbCByZXF1aXJlZCBmb3JtIGlucHV0cyBhcmUgZmlsbGVkXG5mdW5jdGlvbiBhcmVBbGxSZXF1aXJlZElucHV0c0ZpbGxlZChmb3JtOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJlcXVpcmVkSW5wdXRzID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFtyZXF1aXJlZF0sIHNlbGVjdFtyZXF1aXJlZF0sIHRleHRhcmVhW3JlcXVpcmVkXScpO1xuICAgIFxuICAgIC8vIElmIHRoZXJlIGFyZSBubyByZXF1aXJlZCBpbnB1dHMsIGNoZWNrIHZpc2libGUgaW5wdXRzIGluc3RlYWRcbiAgICBpZiAocmVxdWlyZWRJbnB1dHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IHZpc2libGVJbnB1dHMgPSBBcnJheS5mcm9tKGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEnKSkuZmlsdGVyKGlucHV0ID0+IHtcbiAgICAgICAgICAgIC8vIENhc3QgdGhlIGlucHV0IHRvIGEgdW5pb24gdHlwZVxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IGlucHV0IGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlLmRpc3BsYXkgIT09ICdub25lJyAmJiBcbiAgICAgICAgICAgICAgICAgICBzdHlsZS52aXNpYmlsaXR5ICE9PSAnaGlkZGVuJyAmJiBcbiAgICAgICAgICAgICAgICAgICBlbGVtZW50LnR5cGUgIT09ICdoaWRkZW4nICYmIFxuICAgICAgICAgICAgICAgICAgIGVsZW1lbnQudHlwZSAhPT0gJ3N1Ym1pdCcgJiYgXG4gICAgICAgICAgICAgICAgICAgZWxlbWVudC50eXBlICE9PSAnYnV0dG9uJztcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdmlzaWJsZUlucHV0cy5ldmVyeShlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIC8vIEVuc3VyZSB0aGUgZWxlbWVudCBpcyBvZiB0aGUgY29ycmVjdCB0eXBlXG4gICAgICAgICAgICBpZiAoaXNJbnB1dEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC52YWx1ZS50cmltKCkgIT09ICcnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgYWxsIHJlcXVpcmVkIGlucHV0cyBhcmUgZmlsbGVkXG4gICAgcmV0dXJuIEFycmF5LmZyb20ocmVxdWlyZWRJbnB1dHMpLmV2ZXJ5KGlucHV0ID0+IHtcbiAgICAgICAgLy8gQ2FzdCB0aGUgaW5wdXQgdG8gYSB1bmlvbiB0eXBlXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBpbnB1dCBhcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFNlbGVjdEVsZW1lbnQgfCBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgICAgICBpZiAoaXNJbnB1dEVsZW1lbnQoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlLnRyaW0oKSAhPT0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xufVxuXG4vLyBUeXBlIGd1YXJkIHRvIGNoZWNrIGlmIGFuIGVsZW1lbnQgaXMgSFRNTElucHV0RWxlbWVudCwgSFRNTFNlbGVjdEVsZW1lbnQsIG9yIEhUTUxUZXh0QXJlYUVsZW1lbnRcbmZ1bmN0aW9uIGlzSW5wdXRFbGVtZW50KGVsZW1lbnQ6IEVsZW1lbnQpOiBlbGVtZW50IGlzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQge1xuICAgIHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCB8fCBcbiAgICAgICAgICAgZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxTZWxlY3RFbGVtZW50IHx8IFxuICAgICAgICAgICBlbGVtZW50IGluc3RhbmNlb2YgSFRNTFRleHRBcmVhRWxlbWVudDtcbn1cblxuLy8gRnVuY3Rpb24gdG8gc2V0IHVwIHN1Ym1pdCBoYW5kbGVycyBmb3Igc2lnbnVwIGZvcm1zXG5mdW5jdGlvbiBzZXR1cFNpZ251cEZvcm1TdWJtaXRIYW5kbGVyKGZvcm06IEhUTUxFbGVtZW50KSB7XG4gICAgLy8gRmxhZyB0byBwcmV2ZW50IG11bHRpcGxlIGV2ZW50IGhhbmRsZXJzXG4gICAgaWYgKGZvcm0uZGF0YXNldC5zdWJtaXRIYW5kbGVyQXR0YWNoZWQgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvcm0uZGF0YXNldC5zdWJtaXRIYW5kbGVyQXR0YWNoZWQgPSAndHJ1ZSc7XG4gICAgXG4gICAgLy8gRmluZCBhbGwgc3VibWl0IGJ1dHRvbnMgYW5kIGFkZCBjbGljayBoYW5kbGVyc1xuICAgIGNvbnN0IHN1Ym1pdEJ1dHRvbnMgPSBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdLCBpbnB1dFt0eXBlPVwic3VibWl0XCJdLCBidXR0b246bm90KFt0eXBlXSksIFtyb2xlPVwiYnV0dG9uXCJdJyk7XG4gICAgXG4gICAgc3VibWl0QnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBPbmx5IGludGVyY2VwdCBpZiBhbGwgcmVxdWlyZWQgZmllbGRzIGFyZSBmaWxsZWRcbiAgICAgICAgICAgIGlmIChhcmVBbGxSZXF1aXJlZElucHV0c0ZpbGxlZChmb3JtKSkge1xuICAgICAgICAgICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCBmb3JtIHN1Ym1pc3Npb25cbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFNob3cgY29uZmlybWF0aW9uIHBvcHVwXG4gICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1hdGlvblBvcHVwKChjb25maXJtZWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm1lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQYXNzd29yZCBzYXZlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc3dvcmQgbm90IHNhdmVkXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIEZvciBleHRyYSByZWxpYWJpbGl0eSwgYWxzbyBhdHRhY2ggdG8gZm9ybSBzdWJtaXQgZXZlbnRcbiAgICBpZiAoZm9ybS50YWdOYW1lID09PSAnRk9STScpIHtcbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy8gT25seSBpbnRlcmNlcHQgaWYgYWxsIHJlcXVpcmVkIGZpZWxkcyBhcmUgZmlsbGVkXG4gICAgICAgICAgICBpZiAoYXJlQWxsUmVxdWlyZWRJbnB1dHNGaWxsZWQoZm9ybSkpIHtcbiAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgZm9ybSBzdWJtaXNzaW9uXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBTaG93IGNvbmZpcm1hdGlvbiBwb3B1cFxuICAgICAgICAgICAgICAgIHNob3dDb25maXJtYXRpb25Qb3B1cCgoY29uZmlybWVkKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maXJtZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUGFzc3dvcmQgc2F2ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBhc3N3b3JkIG5vdCBzYXZlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8vIEZ1bmN0aW9uIHRvIGRldGVjdCBhbmQgcHJvY2VzcyBmb3JtcyBpbiB0aGUgRE9NXG5mdW5jdGlvbiBkZXRlY3RGb3JtKG5vZGU6IE5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IG5vZGUgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGEgZm9ybVxuICAgICAgICBpZiAoZWxlbS50YWdOYW1lID09PSAnRk9STScpIHtcbiAgICAgICAgICAgIGlmIChpc0xvZ2luRm9ybShlbGVtKSkge1xuICAgICAgICAgICAgICAgIGZpbGxGb3JtSW5wdXRzKGVsZW0pO1xuICAgICAgICAgICAgICAgIGxvZ0Zvcm1EZXRlY3Rpb24oXCJMb2dpbiBmb3JtXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChpc1NpZ251cEZvcm0oZWxlbSkpIHtcbiAgICAgICAgICAgICAgICBsb2dGb3JtRGV0ZWN0aW9uKFwiU2lnbnVwIGZvcm1cIik7XG4gICAgICAgICAgICAgICAgc2V0dXBTaWdudXBGb3JtU3VibWl0SGFuZGxlcihlbGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgLy8gQWxzbyBjaGVjayBmb3IgY29udGFpbmVycyB0aGF0IG1pZ2h0IG5vdCB1c2UgdGhlIGZvcm0gdGFnXG4gICAgICAgIGVsc2UgaWYgKGVsZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdJykpIHtcbiAgICAgICAgICAgIGlmIChpc0xvZ2luRm9ybShlbGVtKSkge1xuICAgICAgICAgICAgICAgIGZpbGxGb3JtSW5wdXRzKGVsZW0pO1xuICAgICAgICAgICAgICAgIGxvZ0Zvcm1EZXRlY3Rpb24oXCJMb2dpbiBjb250YWluZXJcIik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzU2lnbnVwRm9ybShlbGVtKSkge1xuICAgICAgICAgICAgICAgIGxvZ0Zvcm1EZXRlY3Rpb24oXCJTaWdudXAgY29udGFpbmVyXCIpO1xuICAgICAgICAgICAgICAgIHNldHVwU2lnbnVwRm9ybVN1Ym1pdEhhbmRsZXIoZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIERlYm91bmNlIGZ1bmN0aW9uIHRvIGxpbWl0IHJhcGlkIGV4ZWN1dGlvbiBvZiBNdXRhdGlvbk9ic2VydmVyIGNhbGxiYWNrc1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYzogRnVuY3Rpb24sIGRlbGF5OiBudW1iZXIpIHtcbiAgICBsZXQgdGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD47XG4gICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IGZ1bmMoLi4uYXJncyksIGRlbGF5KTtcbiAgICB9O1xufVxuXG4vLyBDcmVhdGUgYSBNdXRhdGlvbk9ic2VydmVyIHRvIGRldGVjdCBuZXcgZm9ybXMgZHluYW1pY2FsbHkgYWRkZWQgdG8gdGhlIERPTVxuY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICBkZWJvdW5jZSgobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uLmFkZGVkTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaChkZXRlY3RGb3JtKTsgLy8gQ2hlY2sgbmV3bHkgYWRkZWQgZWxlbWVudHNcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobXV0YXRpb24udGFyZ2V0Lm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgIGRldGVjdEZvcm0obXV0YXRpb24udGFyZ2V0KTsgLy8gQ2hlY2sgbW9kaWZpZWQgZWxlbWVudHNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSwgMTAwKSAvLyBEZWJvdW5jZSBkZWxheSBvZiAxMDBtcyB0byBvcHRpbWl6ZSBwZXJmb3JtYW5jZVxuKTtcblxuLy8gRnVuY3Rpb24gdG8gc3RhcnQgb2JzZXJ2aW5nIERPTSBjaGFuZ2VzXG5mdW5jdGlvbiBvYnNlcnZlKCkge1xuICAgIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSwgLy8gV2F0Y2ggZm9yIGF0dHJpYnV0ZSBjaGFuZ2VzIHRoYXQgbWlnaHQgcmV2ZWFsIGZvcm1zXG4gICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydjbGFzcycsICdzdHlsZScsICdoaWRkZW4nXSwgLy8gT25seSB3YXRjaCByZWxldmFudCBhdHRyaWJ1dGVzXG4gICAgICAgIGNoYXJhY3RlckRhdGE6IGZhbHNlLCAvLyBJZ25vcmUgdGV4dCBjaGFuZ2VzXG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSwgLy8gV2F0Y2ggZm9yIGFkZGVkL3JlbW92ZWQgbm9kZXNcbiAgICAgICAgc3VidHJlZTogdHJ1ZSwgLy8gV2F0Y2ggdGhlIGVudGlyZSBET00gdHJlZVxuICAgIH0pO1xuXG4gICAgLy8gUHJvY2VzcyBhbGwgcG90ZW50aWFsIGZvcm1zIHdoZW4gdGhlIHNjcmlwdCBydW5zXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImZvcm1cIikuZm9yRWFjaChkZXRlY3RGb3JtKTtcbiAgICBcbiAgICAvLyBBbHNvIGNoZWNrIGZvciBub24tZm9ybSBjb250YWluZXJzXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImRpdiwgc2VjdGlvbiwgbWFpbiwgZmllbGRzZXRcIikuZm9yRWFjaChlbGVtID0+IHtcbiAgICAgICAgaWYgKGVsZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdJykpIHtcbiAgICAgICAgICAgIGRldGVjdEZvcm0oZWxlbSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8gU3RhcnQgbW9uaXRvcmluZyB0aGUgRE9NIGZvciBmb3Jtc1xub2JzZXJ2ZSgpOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==