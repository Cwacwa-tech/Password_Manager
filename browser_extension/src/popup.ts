import { setBadgeText } from "./common";

// Set the extension to always be enabled
setBadgeText(true); // Set badge to "ON"

console.log("Hello, world from popup!");

// Generate password button logic
const generatePasswordButton = document.getElementById("generate-password");
const passwordDisplay = document.getElementById("password-display");
const generatedPasswordInput = document.getElementById("generated-password") as HTMLInputElement;

// Check if elements exist before using them
if (generatePasswordButton && passwordDisplay && generatedPasswordInput) {
    generatePasswordButton.addEventListener("click", () => {
        // Send message to background to generate a password
        chrome.runtime.sendMessage(
            { action: "generate_password" },
            (response) => {
                if (response?.password) {
                    generatedPasswordInput.value = response.password; // Autofill the input field
                } else if (response?.error) {
                    passwordDisplay.textContent = "Failed to generate password.";
                }
            }
        );
    });
} else {
    console.error("Elements not found: generatePasswordButton, passwordDisplay, or generatedPasswordInput.");
}

// Login form logic
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");
    const emailInput = document.getElementById("email") as HTMLInputElement | null;
    const masterPasswordInput = document.getElementById("master-password") as HTMLInputElement | null;

    if (loginButton && emailInput && masterPasswordInput) {
        loginButton.addEventListener("click", () => {
            const email = emailInput.value.trim();
            const masterPassword = masterPasswordInput.value.trim();

            if (!email || !masterPassword) {
                console.error("Email and password cannot be empty.");
                return;
            }

            console.log("Sending login request...");

            // Send login request to background script
            chrome.runtime.sendMessage(
                { action: "login", email, masterPassword },
                (response) => {
                    if (response?.success) {
                        console.log("Login successful:", response);
                    } else {
                        console.error("Login failed:", response?.error);
                    }
                }
            );
        });
    } else {
        console.error("Login button or input fields not found.");
    }
});
