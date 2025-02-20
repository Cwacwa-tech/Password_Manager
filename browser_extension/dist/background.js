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
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(/*! ./common */ "./src/common.ts");
// Set the badge text to "ON" when the background script starts.
(0, common_1.setBadgeText)(true);
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "generate_password") {
        // Send the request to the backend to generate a password
        fetch('http://localhost:8000/password/generate', {
            method: 'GET', // Or POST if necessary, depending on your backend setup
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json()) // Assuming the backend returns a JSON response
            .then((data) => {
            if (data.password) {
                // Send the generated password to the popup
                sendResponse({ password: data.password });
            }
            else {
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
            }
            else {
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUUsR0FBRyxFQUFFO29CQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUM7Z0JBQzlDLENBQUMsQ0FBQyxDQUFDO2dCQUVILFlBQVksQ0FBQyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBQzlELENBQUM7aUJBQU0sQ0FBQztnQkFDSixZQUFZLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDM0UsQ0FBQztRQUNMLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLFlBQVksQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLDJCQUEyQixFQUFFLENBQUMsQ0FBQztRQUN6RSxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxDQUFDLENBQUMsNkJBQTZCO0lBQzlDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Jyb3dzZXItZXh0ZW5zaW9uLy4vc3JjL2NvbW1vbi50cyIsIndlYnBhY2s6Ly9icm93c2VyLWV4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9icm93c2VyLWV4dGVuc2lvbi8uL3NyYy9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBzZXRCYWRnZVRleHQoZW5hYmxlZDogYm9vbGVhbikge1xuICAgIGNvbnN0IHRleHQgPSBlbmFibGVkID8gXCJPTlwiIDogXCJPRkZcIlxuICAgIHZvaWQgY2hyb21lLmFjdGlvbi5zZXRCYWRnZVRleHQoe3RleHQ6IHRleHR9KVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJpbXBvcnQge3NldEJhZGdlVGV4dH0gZnJvbSBcIi4vY29tbW9uXCJcbi8vIFNldCB0aGUgYmFkZ2UgdGV4dCB0byBcIk9OXCIgd2hlbiB0aGUgYmFja2dyb3VuZCBzY3JpcHQgc3RhcnRzLlxuc2V0QmFkZ2VUZXh0KHRydWUpO1xuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UuYWN0aW9uID09PSBcImdlbmVyYXRlX3Bhc3N3b3JkXCIpIHtcbiAgICAgICAgLy8gU2VuZCB0aGUgcmVxdWVzdCB0byB0aGUgYmFja2VuZCB0byBnZW5lcmF0ZSBhIHBhc3N3b3JkXG4gICAgICAgIGZldGNoKCdodHRwOi8vbG9jYWxob3N0OjgwMDAvcGFzc3dvcmQvZ2VuZXJhdGUnLCB7XG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLCAgLy8gT3IgUE9TVCBpZiBuZWNlc3NhcnksIGRlcGVuZGluZyBvbiB5b3VyIGJhY2tlbmQgc2V0dXBcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKSAgLy8gQXNzdW1pbmcgdGhlIGJhY2tlbmQgcmV0dXJucyBhIEpTT04gcmVzcG9uc2VcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2VuZCB0aGUgZ2VuZXJhdGVkIHBhc3N3b3JkIHRvIHRoZSBwb3B1cFxuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBwYXNzd29yZDogZGF0YS5wYXNzd29yZCB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBlcnJvcjogJ0ZhaWxlZCB0byBnZW5lcmF0ZSBwYXNzd29yZCcgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBnZW5lcmF0aW5nIHBhc3N3b3JkOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBlcnJvcjogJ0ZhaWxlZCB0byBjb250YWN0IGJhY2tlbmQnIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gS2VlcCB0aGUgcmVzcG9uc2UgY2hhbm5lbCBvcGVuIHVudGlsIHRoZSBhc3luYyBvcGVyYXRpb24gZmluaXNoZXNcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UuYWN0aW9uID09PSBcImxvZ2luXCIpIHtcbiAgICAgICAgLy8gRm9yd2FyZCB0aGUgbG9naW4gcmVxdWVzdCB0byB0aGUgQmFja2VuZFxuICAgICAgICBjb25zdCBsb2dpbkRhdGEgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIGxvZ2luRGF0YS5hcHBlbmQoXCJ1c2VybmFtZVwiLCBtZXNzYWdlLmVtYWlsKTtcbiAgICAgICAgbG9naW5EYXRhLmFwcGVuZChcInBhc3N3b3JkXCIsIG1lc3NhZ2UubWFzdGVyUGFzc3dvcmQpO1xuXG4gICAgICAgIGZldGNoKCdodHRwOi8vbG9jYWxob3N0OjgwMDAvYXV0aC9sb2dpbicsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSxcbiAgICAgICAgICAgIGJvZHk6IGxvZ2luRGF0YS50b1N0cmluZygpLFxuICAgICAgICB9KVxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgaWYgKGRhdGEuYWNjZXNzX3Rva2VuKSB7XG4gICAgICAgICAgICAgICAgLy8gU3RvcmUgdGhlIHRva2VuIGluIGNocm9tZSBzdG9yYWdlIGZvciBsYXRlciB1c2VcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyB0b2tlbjogZGF0YS5hY2Nlc3NfdG9rZW4gfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRva2VuIHN0b3JlZCBzdWNjZXNzZnVsbHkuXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSwgdG9rZW46IGRhdGEuYWNjZXNzX3Rva2VuIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGRhdGEuZGV0YWlsIHx8IFwiTG9naW4gZmFpbGVkXCIgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTG9naW4gZXJyb3I6XCIsIGVycm9yKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJGYWlsZWQgdG8gY29udGFjdCBiYWNrZW5kXCIgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBLZWVwIHJlc3BvbnNlIGNoYW5uZWwgb3BlblxuICAgIH1cbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9