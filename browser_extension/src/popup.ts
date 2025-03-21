import { setBadgeText } from "./common";

// Set the extension to always be enabled
setBadgeText(true); // Set badge to "ON"

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
