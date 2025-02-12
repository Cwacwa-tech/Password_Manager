import {setBadgeText} from "./common"

// Set the extension to always be enabled
setBadgeText(true); // Set badge to "ON"

console.log("Hello, world from popup!");

// Handle the input field (we keep this logic)
const input = document.getElementById("item") as HTMLInputElement;
chrome.storage.sync.get("item", (data) => {
    input.value = data.item || "";
});

input.addEventListener("change", (event) => {
    if (event.target instanceof HTMLInputElement) {
        void chrome.storage.sync.set({ "item": event.target.value });
    }
});

// Generate password button logic
const generatePasswordButton = document.getElementById("generate-password");
const passwordDisplay = document.getElementById("password-display");

const generatedPasswordInput = document.getElementById("generated-password") as HTMLInputElement;

// Check if elements exist before using them
if (generatePasswordButton && passwordDisplay) {
    generatePasswordButton.addEventListener("click", () => {
        // Send message to background to generate a password
        chrome.runtime.sendMessage(
            { action: "generate_password" },
            (response) => {
                if (response.password) {
                    generatedPasswordInput.value = response.password; // Autofill the second input field
                } else if (response.error) {
                    passwordDisplay.textContent = "Failed to generate password.";
                }
            }
        );
    });
} else {
    console.error("Elements not found: generatePasswordButton or passwordDisplay.");
}
