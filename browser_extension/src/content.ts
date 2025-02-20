// Function to log login form detection
function logLoginFormDetection() {
    console.log("Login form detected!!!"); // Logs when a login form is detected
}

// Function to check if an element is a login form
function isLoginForm(elem: HTMLElement): boolean {
    // Check for input fields that typically belong to login forms
    const hasUsername = elem.querySelector('input[type="text"], input[name*="user"], input[id*="user"]');
    const hasPassword = elem.querySelector('input[type="password"], input[name*="pass"], input[id*="pass"]');
    const hasEmail = elem.querySelector('input[type="email"], input[name*="email"], input[id*="email"]');

    // Common button texts for login forms
    const loginButtonTexts = ["log in", "sign in", "login", "signin", "sign up", "signup"];
    
    // Check for a button or link with a login-related label
    const hasLoginButton = Array.from(elem.querySelectorAll('button, input[type="submit"], a')).some((button) => {
        const buttonText = button.textContent?.toLowerCase().trim();
        return buttonText && loginButtonTexts.includes(buttonText);
    });

    // A login form should have a password field and either a username, email, or login button
    return !!(hasPassword && (hasUsername || hasEmail || hasLoginButton));
}

// Function to fill login form inputs with "LOVE"
function fillPasswordInput(elem: HTMLElement) {
    // Find password input and fill it
    const passwordInput = elem.querySelector('input[type="password"]') as HTMLInputElement;
    if (passwordInput && !passwordInput.dataset.filled) { // Check if already filled
        simulateUserInput(passwordInput, "LOVE");
        passwordInput.dataset.filled = "true"; // Mark as filled
        console.debug("Filled password input with 'LOVE':", passwordInput);
    }

    // Find username or email input and fill it
    const emailOrUsernameInput = elem.querySelector('input[type="text"], input[type="email"]') as HTMLInputElement;
    if (emailOrUsernameInput && !emailOrUsernameInput.dataset.filled) { // Check if already filled
        simulateUserInput(emailOrUsernameInput, "LOVE");
        emailOrUsernameInput.dataset.filled = "true"; // Mark as filled
        console.debug("Filled email/username input with 'LOVE':", emailOrUsernameInput);
    }
}

// Function to simulate user input, ensuring frameworks (React, Vue) detect changes
function simulateUserInput(input: HTMLInputElement, value: string) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(input, value); // Set input value programmatically

    // Dispatch an input event to notify frameworks like React that the value has changed
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
}

// Function to detect and process login forms in the DOM
function detectLoginForm(node: Node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement;
        
        // Check if the element is a <form> or contains login inputs
        if (elem.tagName === 'FORM' || isLoginForm(elem)) {
            fillPasswordInput(elem); // Fill detected login form
            logLoginFormDetection(); // Log detection
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

// Create a MutationObserver to detect new login forms dynamically added to the DOM
const observer = new MutationObserver(
    debounce((mutations: MutationRecord[]) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(detectLoginForm); // Check newly added elements
            } else {
                detectLoginForm(mutation.target); // Check modified elements
            }
        });
    }, 100) // Debounce delay of 100ms to optimize performance
);

// Function to start observing DOM changes
function observe() {
    observer.observe(document, {
        attributes: false, // Ignore attribute changes
        characterData: false, // Ignore text changes
        childList: true, // Watch for added/removed nodes
        subtree: true, // Watch the entire DOM tree
    });

    // Process all existing forms when the script runs
    document.querySelectorAll("form").forEach(detectLoginForm);
}

// Start monitoring the DOM for login forms
observe();
