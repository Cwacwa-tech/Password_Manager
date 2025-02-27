/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/common.ts":
/*!***********************!*\
  !*** ./src/common.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setBadgeText = setBadgeText;
function setBadgeText(enabled) {
    const text = enabled ? "ON" : "OFF";
    void chrome.action.setBadgeText({ text: text });
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
// Set the extension to always be enabled
(0, common_1.setBadgeText)(true); // Set badge to "ON"
// Generate password button logic
const generatePasswordButton = document.getElementById("generate-password");
const passwordDisplay = document.getElementById("password-display");
const generatedPasswordInput = document.getElementById("generated-password");
// Check if elements exist before using them
if (generatePasswordButton && passwordDisplay && generatedPasswordInput) {
    generatePasswordButton.addEventListener("click", () => {
        // Send message to background to generate a password
        chrome.runtime.sendMessage({ action: "generate_password" }, (response) => {
            if (response === null || response === void 0 ? void 0 : response.password) {
                generatedPasswordInput.value = response.password; // Autofill the input field
            }
            else if (response === null || response === void 0 ? void 0 : response.error) {
                passwordDisplay.textContent = "Failed to generate password.";
            }
        });
    });
}
else {
    console.error("Elements not found: generatePasswordButton, passwordDisplay, or generatedPasswordInput.");
}
// Login form logic
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");
    const emailInput = document.getElementById("email");
    const masterPasswordInput = document.getElementById("master-password");
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
            chrome.runtime.sendMessage({ action: "login", email, masterPassword }, (response) => {
                if (response === null || response === void 0 ? void 0 : response.success) {
                    console.log("Login successful:", response);
                }
                else {
                    console.error("Login failed:", response === null || response === void 0 ? void 0 : response.error);
                }
            });
        });
    }
    else {
        console.error("Login button or input fields not found.");
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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WUFDMUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQ3RCLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQzFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ1QsSUFBSSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsT0FBTyxFQUFFLENBQUM7b0JBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQy9DLENBQUM7cUJBQU0sQ0FBQztvQkFDSixPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ3BELENBQUM7WUFDTCxDQUFDLENBQ0osQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztTQUFNLENBQUM7UUFDSixPQUFPLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7SUFDN0QsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYnJvd3Nlci1leHRlbnNpb24vLi9zcmMvY29tbW9uLnRzIiwid2VicGFjazovL2Jyb3dzZXItZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Jyb3dzZXItZXh0ZW5zaW9uLy4vc3JjL3BvcHVwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBzZXRCYWRnZVRleHQoZW5hYmxlZDogYm9vbGVhbikge1xuICAgIGNvbnN0IHRleHQgPSBlbmFibGVkID8gXCJPTlwiIDogXCJPRkZcIlxuICAgIHZvaWQgY2hyb21lLmFjdGlvbi5zZXRCYWRnZVRleHQoe3RleHQ6IHRleHR9KVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQgeyBzZXRCYWRnZVRleHQgfSBmcm9tIFwiLi9jb21tb25cIjtcblxuLy8gU2V0IHRoZSBleHRlbnNpb24gdG8gYWx3YXlzIGJlIGVuYWJsZWRcbnNldEJhZGdlVGV4dCh0cnVlKTsgLy8gU2V0IGJhZGdlIHRvIFwiT05cIlxuXG4vLyBHZW5lcmF0ZSBwYXNzd29yZCBidXR0b24gbG9naWNcbmNvbnN0IGdlbmVyYXRlUGFzc3dvcmRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdlbmVyYXRlLXBhc3N3b3JkXCIpO1xuY29uc3QgcGFzc3dvcmREaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXNzd29yZC1kaXNwbGF5XCIpO1xuY29uc3QgZ2VuZXJhdGVkUGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGVkLXBhc3N3b3JkXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cbi8vIENoZWNrIGlmIGVsZW1lbnRzIGV4aXN0IGJlZm9yZSB1c2luZyB0aGVtXG5pZiAoZ2VuZXJhdGVQYXNzd29yZEJ1dHRvbiAmJiBwYXNzd29yZERpc3BsYXkgJiYgZ2VuZXJhdGVkUGFzc3dvcmRJbnB1dCkge1xuICAgIGdlbmVyYXRlUGFzc3dvcmRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgLy8gU2VuZCBtZXNzYWdlIHRvIGJhY2tncm91bmQgdG8gZ2VuZXJhdGUgYSBwYXNzd29yZFxuICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZShcbiAgICAgICAgICAgIHsgYWN0aW9uOiBcImdlbmVyYXRlX3Bhc3N3b3JkXCIgfSxcbiAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZT8ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVkUGFzc3dvcmRJbnB1dC52YWx1ZSA9IHJlc3BvbnNlLnBhc3N3b3JkOyAvLyBBdXRvZmlsbCB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlPy5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZERpc3BsYXkudGV4dENvbnRlbnQgPSBcIkZhaWxlZCB0byBnZW5lcmF0ZSBwYXNzd29yZC5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfSk7XG59IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFbGVtZW50cyBub3QgZm91bmQ6IGdlbmVyYXRlUGFzc3dvcmRCdXR0b24sIHBhc3N3b3JkRGlzcGxheSwgb3IgZ2VuZXJhdGVkUGFzc3dvcmRJbnB1dC5cIik7XG59XG5cbi8vIExvZ2luIGZvcm0gbG9naWNcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgICBjb25zdCBsb2dpbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4tYnV0dG9uXCIpO1xuICAgIGNvbnN0IGVtYWlsSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtYWlsXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuICAgIGNvbnN0IG1hc3RlclBhc3N3b3JkSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hc3Rlci1wYXNzd29yZFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcblxuICAgIGlmIChsb2dpbkJ1dHRvbiAmJiBlbWFpbElucHV0ICYmIG1hc3RlclBhc3N3b3JkSW5wdXQpIHtcbiAgICAgICAgbG9naW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVtYWlsID0gZW1haWxJbnB1dC52YWx1ZS50cmltKCk7XG4gICAgICAgICAgICBjb25zdCBtYXN0ZXJQYXNzd29yZCA9IG1hc3RlclBhc3N3b3JkSW5wdXQudmFsdWUudHJpbSgpO1xuXG4gICAgICAgICAgICBpZiAoIWVtYWlsIHx8ICFtYXN0ZXJQYXNzd29yZCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFbWFpbCBhbmQgcGFzc3dvcmQgY2Fubm90IGJlIGVtcHR5LlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBsb2dpbiByZXF1ZXN0Li4uXCIpO1xuXG4gICAgICAgICAgICAvLyBTZW5kIGxvZ2luIHJlcXVlc3QgdG8gYmFja2dyb3VuZCBzY3JpcHRcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKFxuICAgICAgICAgICAgICAgIHsgYWN0aW9uOiBcImxvZ2luXCIsIGVtYWlsLCBtYXN0ZXJQYXNzd29yZCB9LFxuICAgICAgICAgICAgICAgIChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2U/LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTG9naW4gc3VjY2Vzc2Z1bDpcIiwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkxvZ2luIGZhaWxlZDpcIiwgcmVzcG9uc2U/LmVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJMb2dpbiBidXR0b24gb3IgaW5wdXQgZmllbGRzIG5vdCBmb3VuZC5cIik7XG4gICAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=