import {setBadgeText} from "./common"
// Set the badge text to "ON" when the background script starts.
setBadgeText(true);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "generate_password") {
        // Send the request to the backend to generate a password
        fetch('http://localhost:8000/password/generate', {
            method: 'GET',  // Or POST if necessary, depending on your backend setup
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())  // Assuming the backend returns a JSON response
            .then((data) => {
                if (data.password) {
                    // Send the generated password to the popup
                    sendResponse({ password: data.password });
                } else {
                    sendResponse({ error: 'Failed to generate password' });
                }
            })
            .catch((error) => {
                console.error('Error generating password:', error);
                sendResponse({ error: 'Failed to contact backend' });
            });

        // Keep the response channel open until the async operation finishes
        return true;
    }

    if (message.action === "login") {
        // Forward the login request to the Backend
        const loginData = new URLSearchParams();
        loginData.append("username", message.email);
        loginData.append("password", message.masterPassword);

        fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: loginData.toString(),
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                // Store the token in chrome storage for later use
                chrome.storage.local.set({ token: data.access_token }, () => {
                    console.log("Token stored successfully.");
                });

                sendResponse({ success: true, token: data.access_token });
            } else {
                sendResponse({ success: false, error: data.detail || "Login failed" });
            }
        })
        .catch(error => {
            console.error("Login error:", error);
            sendResponse({ success: false, error: "Failed to contact backend" });
        });

        return true; // Keep response channel open
    }
});