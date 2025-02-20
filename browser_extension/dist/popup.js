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
console.log("Hello, world from popup!");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFFeEMsMENBQTBDO1lBQzFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUN0QixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxFQUMxQyxDQUFDLFFBQVEsRUFBRSxFQUFFO2dCQUNULElBQUksUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLE9BQU8sRUFBRSxDQUFDO29CQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDO3FCQUFNLENBQUM7b0JBQ0osT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNwRCxDQUFDO1lBQ0wsQ0FBQyxDQUNKLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7U0FBTSxDQUFDO1FBQ0osT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Jyb3dzZXItZXh0ZW5zaW9uLy4vc3JjL2NvbW1vbi50cyIsIndlYnBhY2s6Ly9icm93c2VyLWV4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9icm93c2VyLWV4dGVuc2lvbi8uL3NyYy9wb3B1cC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gc2V0QmFkZ2VUZXh0KGVuYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB0ZXh0ID0gZW5hYmxlZCA/IFwiT05cIiA6IFwiT0ZGXCJcbiAgICB2b2lkIGNocm9tZS5hY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OiB0ZXh0fSlcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiaW1wb3J0IHsgc2V0QmFkZ2VUZXh0IH0gZnJvbSBcIi4vY29tbW9uXCI7XG5cbi8vIFNldCB0aGUgZXh0ZW5zaW9uIHRvIGFsd2F5cyBiZSBlbmFibGVkXG5zZXRCYWRnZVRleHQodHJ1ZSk7IC8vIFNldCBiYWRnZSB0byBcIk9OXCJcblxuY29uc29sZS5sb2coXCJIZWxsbywgd29ybGQgZnJvbSBwb3B1cCFcIik7XG5cbi8vIEdlbmVyYXRlIHBhc3N3b3JkIGJ1dHRvbiBsb2dpY1xuY29uc3QgZ2VuZXJhdGVQYXNzd29yZEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGUtcGFzc3dvcmRcIik7XG5jb25zdCBwYXNzd29yZERpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhc3N3b3JkLWRpc3BsYXlcIik7XG5jb25zdCBnZW5lcmF0ZWRQYXNzd29yZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZW5lcmF0ZWQtcGFzc3dvcmRcIikgYXMgSFRNTElucHV0RWxlbWVudDtcblxuLy8gQ2hlY2sgaWYgZWxlbWVudHMgZXhpc3QgYmVmb3JlIHVzaW5nIHRoZW1cbmlmIChnZW5lcmF0ZVBhc3N3b3JkQnV0dG9uICYmIHBhc3N3b3JkRGlzcGxheSAmJiBnZW5lcmF0ZWRQYXNzd29yZElucHV0KSB7XG4gICAgZ2VuZXJhdGVQYXNzd29yZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAvLyBTZW5kIG1lc3NhZ2UgdG8gYmFja2dyb3VuZCB0byBnZW5lcmF0ZSBhIHBhc3N3b3JkXG4gICAgICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKFxuICAgICAgICAgICAgeyBhY3Rpb246IFwiZ2VuZXJhdGVfcGFzc3dvcmRcIiB9LFxuICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlPy5wYXNzd29yZCkge1xuICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZWRQYXNzd29yZElucHV0LnZhbHVlID0gcmVzcG9uc2UucGFzc3dvcmQ7IC8vIEF1dG9maWxsIHRoZSBpbnB1dCBmaWVsZFxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzcG9uc2U/LmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkRGlzcGxheS50ZXh0Q29udGVudCA9IFwiRmFpbGVkIHRvIGdlbmVyYXRlIHBhc3N3b3JkLlwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9KTtcbn0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcIkVsZW1lbnRzIG5vdCBmb3VuZDogZ2VuZXJhdGVQYXNzd29yZEJ1dHRvbiwgcGFzc3dvcmREaXNwbGF5LCBvciBnZW5lcmF0ZWRQYXNzd29yZElucHV0LlwiKTtcbn1cblxuLy8gTG9naW4gZm9ybSBsb2dpY1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IGxvZ2luQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1idXR0b25cIik7XG4gICAgY29uc3QgZW1haWxJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxcIikgYXMgSFRNTElucHV0RWxlbWVudCB8IG51bGw7XG4gICAgY29uc3QgbWFzdGVyUGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFzdGVyLXBhc3N3b3JkXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xuXG4gICAgaWYgKGxvZ2luQnV0dG9uICYmIGVtYWlsSW5wdXQgJiYgbWFzdGVyUGFzc3dvcmRJbnB1dCkge1xuICAgICAgICBsb2dpbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZW1haWwgPSBlbWFpbElucHV0LnZhbHVlLnRyaW0oKTtcbiAgICAgICAgICAgIGNvbnN0IG1hc3RlclBhc3N3b3JkID0gbWFzdGVyUGFzc3dvcmRJbnB1dC52YWx1ZS50cmltKCk7XG5cbiAgICAgICAgICAgIGlmICghZW1haWwgfHwgIW1hc3RlclBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVtYWlsIGFuZCBwYXNzd29yZCBjYW5ub3QgYmUgZW1wdHkuXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTZW5kaW5nIGxvZ2luIHJlcXVlc3QuLi5cIik7XG5cbiAgICAgICAgICAgIC8vIFNlbmQgbG9naW4gcmVxdWVzdCB0byBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoXG4gICAgICAgICAgICAgICAgeyBhY3Rpb246IFwibG9naW5cIiwgZW1haWwsIG1hc3RlclBhc3N3b3JkIH0sXG4gICAgICAgICAgICAgICAgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZT8uc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2dpbiBzdWNjZXNzZnVsOlwiLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTG9naW4gZmFpbGVkOlwiLCByZXNwb25zZT8uZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkxvZ2luIGJ1dHRvbiBvciBpbnB1dCBmaWVsZHMgbm90IGZvdW5kLlwiKTtcbiAgICB9XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==