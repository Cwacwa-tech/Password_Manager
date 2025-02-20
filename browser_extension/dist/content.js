/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/

// Function to log login form detection
function logLoginFormDetection() {
    console.log("Login form detected!!!"); // Logs when a login form is detected
}
// Function to check if an element is a login form
function isLoginForm(elem) {
    // Check for input fields that typically belong to login forms
    const hasUsername = elem.querySelector('input[type="text"], input[name*="user"], input[id*="user"]');
    const hasPassword = elem.querySelector('input[type="password"], input[name*="pass"], input[id*="pass"]');
    const hasEmail = elem.querySelector('input[type="email"], input[name*="email"], input[id*="email"]');
    // Common button texts for login forms
    const loginButtonTexts = ["log in", "sign in", "login", "signin", "sign up", "signup"];
    // Check for a button or link with a login-related label
    const hasLoginButton = Array.from(elem.querySelectorAll('button, input[type="submit"], a')).some((button) => {
        var _a;
        const buttonText = (_a = button.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().trim();
        return buttonText && loginButtonTexts.includes(buttonText);
    });
    // A login form should have a password field and either a username, email, or login button
    return !!(hasPassword && (hasUsername || hasEmail || hasLoginButton));
}
// Function to fill login form inputs with "LOVE"
function fillPasswordInput(elem) {
    // Find password input and fill it
    const passwordInput = elem.querySelector('input[type="password"]');
    if (passwordInput && !passwordInput.dataset.filled) { // Check if already filled
        simulateUserInput(passwordInput, "LOVE");
        passwordInput.dataset.filled = "true"; // Mark as filled
        console.debug("Filled password input with 'LOVE':", passwordInput);
    }
    // Find username or email input and fill it
    const emailOrUsernameInput = elem.querySelector('input[type="text"], input[type="email"]');
    if (emailOrUsernameInput && !emailOrUsernameInput.dataset.filled) { // Check if already filled
        simulateUserInput(emailOrUsernameInput, "LOVE");
        emailOrUsernameInput.dataset.filled = "true"; // Mark as filled
        console.debug("Filled email/username input with 'LOVE':", emailOrUsernameInput);
    }
}
// Function to simulate user input, ensuring frameworks (React, Vue) detect changes
function simulateUserInput(input, value) {
    var _a;
    const nativeInputValueSetter = (_a = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")) === null || _a === void 0 ? void 0 : _a.set;
    nativeInputValueSetter === null || nativeInputValueSetter === void 0 ? void 0 : nativeInputValueSetter.call(input, value); // Set input value programmatically
    // Dispatch an input event to notify frameworks like React that the value has changed
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
}
// Function to detect and process login forms in the DOM
function detectLoginForm(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node;
        // Check if the element is a <form> or contains login inputs
        if (elem.tagName === 'FORM' || isLoginForm(elem)) {
            fillPasswordInput(elem); // Fill detected login form
            logLoginFormDetection(); // Log detection
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
// Create a MutationObserver to detect new login forms dynamically added to the DOM
const observer = new MutationObserver(debounce((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach(detectLoginForm); // Check newly added elements
        }
        else {
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLDZCQUE2QjtRQUMvRSxDQUFDO2FBQU0sQ0FBQztZQUNKLGVBQWUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQywwQkFBMEI7UUFDaEUsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLGtEQUFrRDtDQUM3RCxDQUFDO0FBRUYsMENBQTBDO0FBQzFDLFNBQVMsT0FBTztJQUNaLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ3ZCLFVBQVUsRUFBRSxLQUFLLEVBQUUsMkJBQTJCO1FBQzlDLGFBQWEsRUFBRSxLQUFLLEVBQUUsc0JBQXNCO1FBQzVDLFNBQVMsRUFBRSxJQUFJLEVBQUUsZ0NBQWdDO1FBQ2pELE9BQU8sRUFBRSxJQUFJLEVBQUUsNEJBQTRCO0tBQzlDLENBQUMsQ0FBQztJQUVILGtEQUFrRDtJQUNsRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFFRCwyQ0FBMkM7QUFDM0MsT0FBTyxFQUFFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9icm93c2VyLWV4dGVuc2lvbi8uL3NyYy9jb250ZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEZ1bmN0aW9uIHRvIGxvZyBsb2dpbiBmb3JtIGRldGVjdGlvblxuZnVuY3Rpb24gbG9nTG9naW5Gb3JtRGV0ZWN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwiTG9naW4gZm9ybSBkZXRlY3RlZCEhIVwiKTsgLy8gTG9ncyB3aGVuIGEgbG9naW4gZm9ybSBpcyBkZXRlY3RlZFxufVxuXG4vLyBGdW5jdGlvbiB0byBjaGVjayBpZiBhbiBlbGVtZW50IGlzIGEgbG9naW4gZm9ybVxuZnVuY3Rpb24gaXNMb2dpbkZvcm0oZWxlbTogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICAvLyBDaGVjayBmb3IgaW5wdXQgZmllbGRzIHRoYXQgdHlwaWNhbGx5IGJlbG9uZyB0byBsb2dpbiBmb3Jtc1xuICAgIGNvbnN0IGhhc1VzZXJuYW1lID0gZWxlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwidGV4dFwiXSwgaW5wdXRbbmFtZSo9XCJ1c2VyXCJdLCBpbnB1dFtpZCo9XCJ1c2VyXCJdJyk7XG4gICAgY29uc3QgaGFzUGFzc3dvcmQgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXSwgaW5wdXRbbmFtZSo9XCJwYXNzXCJdLCBpbnB1dFtpZCo9XCJwYXNzXCJdJyk7XG4gICAgY29uc3QgaGFzRW1haWwgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJlbWFpbFwiXSwgaW5wdXRbbmFtZSo9XCJlbWFpbFwiXSwgaW5wdXRbaWQqPVwiZW1haWxcIl0nKTtcblxuICAgIC8vIENvbW1vbiBidXR0b24gdGV4dHMgZm9yIGxvZ2luIGZvcm1zXG4gICAgY29uc3QgbG9naW5CdXR0b25UZXh0cyA9IFtcImxvZyBpblwiLCBcInNpZ24gaW5cIiwgXCJsb2dpblwiLCBcInNpZ25pblwiLCBcInNpZ24gdXBcIiwgXCJzaWdudXBcIl07XG4gICAgXG4gICAgLy8gQ2hlY2sgZm9yIGEgYnV0dG9uIG9yIGxpbmsgd2l0aCBhIGxvZ2luLXJlbGF0ZWQgbGFiZWxcbiAgICBjb25zdCBoYXNMb2dpbkJ1dHRvbiA9IEFycmF5LmZyb20oZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24sIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0sIGEnKSkuc29tZSgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ1dHRvblRleHQgPSBidXR0b24udGV4dENvbnRlbnQ/LnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgICAgICByZXR1cm4gYnV0dG9uVGV4dCAmJiBsb2dpbkJ1dHRvblRleHRzLmluY2x1ZGVzKGJ1dHRvblRleHQpO1xuICAgIH0pO1xuXG4gICAgLy8gQSBsb2dpbiBmb3JtIHNob3VsZCBoYXZlIGEgcGFzc3dvcmQgZmllbGQgYW5kIGVpdGhlciBhIHVzZXJuYW1lLCBlbWFpbCwgb3IgbG9naW4gYnV0dG9uXG4gICAgcmV0dXJuICEhKGhhc1Bhc3N3b3JkICYmIChoYXNVc2VybmFtZSB8fCBoYXNFbWFpbCB8fCBoYXNMb2dpbkJ1dHRvbikpO1xufVxuXG4vLyBGdW5jdGlvbiB0byBmaWxsIGxvZ2luIGZvcm0gaW5wdXRzIHdpdGggXCJMT1ZFXCJcbmZ1bmN0aW9uIGZpbGxQYXNzd29yZElucHV0KGVsZW06IEhUTUxFbGVtZW50KSB7XG4gICAgLy8gRmluZCBwYXNzd29yZCBpbnB1dCBhbmQgZmlsbCBpdFxuICAgIGNvbnN0IHBhc3N3b3JkSW5wdXQgPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJwYXNzd29yZFwiXScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKHBhc3N3b3JkSW5wdXQgJiYgIXBhc3N3b3JkSW5wdXQuZGF0YXNldC5maWxsZWQpIHsgLy8gQ2hlY2sgaWYgYWxyZWFkeSBmaWxsZWRcbiAgICAgICAgc2ltdWxhdGVVc2VySW5wdXQocGFzc3dvcmRJbnB1dCwgXCJMT1ZFXCIpO1xuICAgICAgICBwYXNzd29yZElucHV0LmRhdGFzZXQuZmlsbGVkID0gXCJ0cnVlXCI7IC8vIE1hcmsgYXMgZmlsbGVkXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJGaWxsZWQgcGFzc3dvcmQgaW5wdXQgd2l0aCAnTE9WRSc6XCIsIHBhc3N3b3JkSW5wdXQpO1xuICAgIH1cblxuICAgIC8vIEZpbmQgdXNlcm5hbWUgb3IgZW1haWwgaW5wdXQgYW5kIGZpbGwgaXRcbiAgICBjb25zdCBlbWFpbE9yVXNlcm5hbWVJbnB1dCA9IGVsZW0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInRleHRcIl0sIGlucHV0W3R5cGU9XCJlbWFpbFwiXScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKGVtYWlsT3JVc2VybmFtZUlucHV0ICYmICFlbWFpbE9yVXNlcm5hbWVJbnB1dC5kYXRhc2V0LmZpbGxlZCkgeyAvLyBDaGVjayBpZiBhbHJlYWR5IGZpbGxlZFxuICAgICAgICBzaW11bGF0ZVVzZXJJbnB1dChlbWFpbE9yVXNlcm5hbWVJbnB1dCwgXCJMT1ZFXCIpO1xuICAgICAgICBlbWFpbE9yVXNlcm5hbWVJbnB1dC5kYXRhc2V0LmZpbGxlZCA9IFwidHJ1ZVwiOyAvLyBNYXJrIGFzIGZpbGxlZFxuICAgICAgICBjb25zb2xlLmRlYnVnKFwiRmlsbGVkIGVtYWlsL3VzZXJuYW1lIGlucHV0IHdpdGggJ0xPVkUnOlwiLCBlbWFpbE9yVXNlcm5hbWVJbnB1dCk7XG4gICAgfVxufVxuXG4vLyBGdW5jdGlvbiB0byBzaW11bGF0ZSB1c2VyIGlucHV0LCBlbnN1cmluZyBmcmFtZXdvcmtzIChSZWFjdCwgVnVlKSBkZXRlY3QgY2hhbmdlc1xuZnVuY3Rpb24gc2ltdWxhdGVVc2VySW5wdXQoaW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQsIHZhbHVlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBuYXRpdmVJbnB1dFZhbHVlU2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuSFRNTElucHV0RWxlbWVudC5wcm90b3R5cGUsIFwidmFsdWVcIik/LnNldDtcbiAgICBuYXRpdmVJbnB1dFZhbHVlU2V0dGVyPy5jYWxsKGlucHV0LCB2YWx1ZSk7IC8vIFNldCBpbnB1dCB2YWx1ZSBwcm9ncmFtbWF0aWNhbGx5XG5cbiAgICAvLyBEaXNwYXRjaCBhbiBpbnB1dCBldmVudCB0byBub3RpZnkgZnJhbWV3b3JrcyBsaWtlIFJlYWN0IHRoYXQgdGhlIHZhbHVlIGhhcyBjaGFuZ2VkXG4gICAgY29uc3QgZXZlbnQgPSBuZXcgRXZlbnQoJ2lucHV0JywgeyBidWJibGVzOiB0cnVlIH0pO1xuICAgIGlucHV0LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xufVxuXG4vLyBGdW5jdGlvbiB0byBkZXRlY3QgYW5kIHByb2Nlc3MgbG9naW4gZm9ybXMgaW4gdGhlIERPTVxuZnVuY3Rpb24gZGV0ZWN0TG9naW5Gb3JtKG5vZGU6IE5vZGUpIHtcbiAgICBpZiAobm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IG5vZGUgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAgIFxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgZWxlbWVudCBpcyBhIDxmb3JtPiBvciBjb250YWlucyBsb2dpbiBpbnB1dHNcbiAgICAgICAgaWYgKGVsZW0udGFnTmFtZSA9PT0gJ0ZPUk0nIHx8IGlzTG9naW5Gb3JtKGVsZW0pKSB7XG4gICAgICAgICAgICBmaWxsUGFzc3dvcmRJbnB1dChlbGVtKTsgLy8gRmlsbCBkZXRlY3RlZCBsb2dpbiBmb3JtXG4gICAgICAgICAgICBsb2dMb2dpbkZvcm1EZXRlY3Rpb24oKTsgLy8gTG9nIGRldGVjdGlvblxuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBEZWJvdW5jZSBmdW5jdGlvbiB0byBsaW1pdCByYXBpZCBleGVjdXRpb24gb2YgTXV0YXRpb25PYnNlcnZlciBjYWxsYmFja3NcbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmM6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyKSB7XG4gICAgbGV0IHRpbWVvdXQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+O1xuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiBmdW5jKC4uLmFyZ3MpLCBkZWxheSk7XG4gICAgfTtcbn1cblxuLy8gQ3JlYXRlIGEgTXV0YXRpb25PYnNlcnZlciB0byBkZXRlY3QgbmV3IGxvZ2luIGZvcm1zIGR5bmFtaWNhbGx5IGFkZGVkIHRvIHRoZSBET01cbmNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgZGVib3VuY2UoKG11dGF0aW9uczogTXV0YXRpb25SZWNvcmRbXSkgPT4ge1xuICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgICAgICAgIGlmIChtdXRhdGlvbi5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goZGV0ZWN0TG9naW5Gb3JtKTsgLy8gQ2hlY2sgbmV3bHkgYWRkZWQgZWxlbWVudHNcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGV0ZWN0TG9naW5Gb3JtKG11dGF0aW9uLnRhcmdldCk7IC8vIENoZWNrIG1vZGlmaWVkIGVsZW1lbnRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIDEwMCkgLy8gRGVib3VuY2UgZGVsYXkgb2YgMTAwbXMgdG8gb3B0aW1pemUgcGVyZm9ybWFuY2Vcbik7XG5cbi8vIEZ1bmN0aW9uIHRvIHN0YXJ0IG9ic2VydmluZyBET00gY2hhbmdlc1xuZnVuY3Rpb24gb2JzZXJ2ZSgpIHtcbiAgICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LCB7XG4gICAgICAgIGF0dHJpYnV0ZXM6IGZhbHNlLCAvLyBJZ25vcmUgYXR0cmlidXRlIGNoYW5nZXNcbiAgICAgICAgY2hhcmFjdGVyRGF0YTogZmFsc2UsIC8vIElnbm9yZSB0ZXh0IGNoYW5nZXNcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLCAvLyBXYXRjaCBmb3IgYWRkZWQvcmVtb3ZlZCBub2Rlc1xuICAgICAgICBzdWJ0cmVlOiB0cnVlLCAvLyBXYXRjaCB0aGUgZW50aXJlIERPTSB0cmVlXG4gICAgfSk7XG5cbiAgICAvLyBQcm9jZXNzIGFsbCBleGlzdGluZyBmb3JtcyB3aGVuIHRoZSBzY3JpcHQgcnVuc1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJmb3JtXCIpLmZvckVhY2goZGV0ZWN0TG9naW5Gb3JtKTtcbn1cblxuLy8gU3RhcnQgbW9uaXRvcmluZyB0aGUgRE9NIGZvciBsb2dpbiBmb3Jtc1xub2JzZXJ2ZSgpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9