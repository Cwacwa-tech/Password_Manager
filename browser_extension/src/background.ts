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
});